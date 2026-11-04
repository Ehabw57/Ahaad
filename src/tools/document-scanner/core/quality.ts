// Corner quality: do the corners actually sit on document edges?
//
// Independent of the detection gate. It does not look at how the corners were
// found, only at the image under them, so it can also score manual or default
// corners. Three signals, weighted in config.ts:
//   edge   - strong, side-aligned gradient at every sample, with gaussian falloff by distance
//   ring   - consistent brightness change across each side
//   shape  - angles and side ratios that a real document photo can produce
// Edge and ring are the evidence. Shape never adds to the score, it only lowers it,
// so a nice rectangle drawn over noise cannot score well.

import { QUALITY } from '../config.ts';
import type { Corners, Gray, Point } from '../types.ts';
import { clamp, interiorAngles, sideLengths, toPixels } from './geometry.ts';
import { blurGray, histogram, histogramPercentile, sobel } from './imageOps.ts';

const clamp01 = (v: number) => clamp(v, 0, 1);

function percentileOf(values: Float32Array, p: number): number {
  const step = Math.max(1, Math.floor(values.length / 20000));
  const sample: number[] = [];
  for (let i = 0; i < values.length; i += step) sample.push(values[i]);
  sample.sort((a, b) => a - b);
  return sample[Math.min(sample.length - 1, Math.floor(sample.length * p))] ?? 0;
}

function signedArea(q: Point[]): number {
  let s = 0;
  for (let i = 0; i < q.length; i++) {
    const a = q[i];
    const b = q[(i + 1) % q.length];
    s += a.x * b.y - b.x * a.y;
  }
  return s / 2;
}

function shapeScore(q: Point[]): number {
  const angles = interiorAngles(q);
  const meanDev = angles.reduce((s, a) => s + Math.abs(a - 90), 0) / 4;
  const angleScore = clamp01(1 - (meanDev - 15) / 45);

  const sides = sideLengths(q);
  const ratio = (a: number, b: number) => (Math.max(a, b) < 1e-6 ? 0 : Math.min(a, b) / Math.max(a, b));
  const ratioScore =
    (clamp01((ratio(sides[0], sides[2]) - 0.35) / 0.4) + clamp01((ratio(sides[1], sides[3]) - 0.35) / 0.4)) / 2;

  return 0.6 * angleScore + 0.4 * ratioScore;
}

/** Quality in 0..1. Never throws on well-formed input. */
export function scoreCorners(gray: Gray, corners: Corners): number {
  const { width: w, height: h } = gray;
  const smooth = blurGray(gray, 1);
  const { gx, gy, mag } = sobel(smooth);

  const hist = histogram(smooth);
  const range = Math.max(
    1,
    histogramPercentile(hist, w * h, 0.95) - histogramPercentile(hist, w * h, 0.05),
  );
  // A clean step of height H has gradient ~4*H. A real edge must clear two bars:
  //  - an absolute floor, so faint edges in flat scenes do not count;
  //  - a multiple of the scene's typical gradient (median), so texture and noise do not count.
  // The median ignores the document's own text and borders, which a high percentile would not.
  const threshold = Math.max(4 * QUALITY.minStep * 0.6, QUALITY.textureFactor * percentileOf(mag, 0.5));
  const ringStep = Math.max(0.12 * range, QUALITY.minStep * 0.6);

  const q = toPixels(corners, w, h);
  const flip = signedArea(q) < 0 ? -1 : 1;
  const shortSide = Math.min(w, h);
  const reach = Math.max(2, Math.round(QUALITY.searchRange * shortSide));
  const sigma = Math.max(1, QUALITY.sigma * shortSide);
  const n = QUALITY.samplesPerSide;

  const sideEdge: number[] = [];
  let ringTotal = 0;
  let ringSig = 0;
  let ringPos = 0;
  let ringNeg = 0;

  for (let k = 0; k < 4; k++) {
    const a = q[k];
    const b = q[(k + 1) % 4];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    if (len < 1) {
      sideEdge.push(0);
      continue;
    }
    const nx = (-(b.y - a.y) / len) * flip;
    const ny = ((b.x - a.x) / len) * flip;

    let sum = 0;
    for (let i = 0; i < n; i++) {
      const t = 0.1 + (0.8 * (i + 0.5)) / n;
      const px = a.x + (b.x - a.x) * t;
      const py = a.y + (b.y - a.y) * t;

      // A side lying on the image border counts as supported.
      if (px <= 1.5 || py <= 1.5 || px >= w - 1.5 || py >= h - 1.5) {
        sum += 1;
        continue;
      }

      let weight = 0;
      for (let s = 0; s <= reach && weight === 0; s++) {
        for (const sign of s === 0 ? [1] : [-1, 1]) {
          const ix = Math.floor(px + nx * s * sign);
          const iy = Math.floor(py + ny * s * sign);
          if (ix < 0 || iy < 0 || ix >= w || iy >= h) continue;
          const idx = iy * w + ix;
          const m = mag[idx];
          if (m < threshold) continue;
          if (Math.abs(gx[idx] * nx + gy[idx] * ny) / m < 0.7) continue;
          weight = Math.exp(-((s / sigma) ** 2));
          break;
        }
      }
      sum += weight;

      // Ring contrast: brightness just inside vs just outside this sample.
      let inside = 0;
      let outside = 0;
      let ok = true;
      for (let d = 3; d <= 6; d++) {
        const ix = Math.floor(px + nx * d);
        const iy = Math.floor(py + ny * d);
        const ox = Math.floor(px - nx * d);
        const oy = Math.floor(py - ny * d);
        if (ix < 0 || iy < 0 || ix >= w || iy >= h || ox < 0 || oy < 0 || ox >= w || oy >= h) {
          ok = false;
          break;
        }
        inside += smooth.data[iy * w + ix];
        outside += smooth.data[oy * w + ox];
      }
      if (!ok) continue;
      ringTotal++;
      const diff = (inside - outside) / 4;
      if (Math.abs(diff) >= ringStep) {
        ringSig++;
        if (diff > 0) ringPos++;
        else ringNeg++;
      }
    }
    sideEdge.push(sum / n);
  }

  const edge = 0.5 * (sideEdge.reduce((s, v) => s + v, 0) / 4) + 0.5 * Math.min(...sideEdge);
  const ring = ringTotal === 0 ? 1 : (ringSig / ringTotal) * (ringSig === 0 ? 0 : Math.max(ringPos, ringNeg) / ringSig);
  const shape = shapeScore(q);

  const evidence = (QUALITY.weightEdge * edge + QUALITY.weightRing * ring) / (QUALITY.weightEdge + QUALITY.weightRing);
  return clamp01(evidence * (QUALITY.shapeFloor + (1 - QUALITY.shapeFloor) * shape));
}
