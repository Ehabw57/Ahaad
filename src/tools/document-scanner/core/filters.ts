// Scan filters. Every filter returns a new raster and never mutates its input
// ('original' returns the input itself, so callers must not mutate results either).

import type { FilterId, Raster } from '../types.ts';
import {
  blurPlane,
  histogramPercentile,
  integralImage,
  maxFilter,
  resizeRaster,
  toGray,
} from './imageOps.ts';

function lumaHistogram(data: Uint8ClampedArray): Uint32Array {
  const hist = new Uint32Array(256);
  for (let i = 0; i < data.length; i += 4) {
    hist[(data[i] * 77 + data[i + 1] * 150 + data[i + 2] * 29) >> 8]++;
  }
  return hist;
}

function grayFilter(r: Raster): Raster {
  const { width: w, height: h } = r;
  const g = toGray(r);
  const hist = new Uint32Array(256);
  for (let i = 0; i < g.data.length; i++) hist[g.data[i]]++;
  const lo = histogramPercentile(hist, w * h, 0.01);
  const hi = histogramPercentile(hist, w * h, 0.99);
  const span = hi - lo;
  const out = new Uint8ClampedArray(w * h * 4);
  for (let i = 0, p = 0; i < g.data.length; i++, p += 4) {
    const v = span >= 20 ? ((g.data[i] - lo) * 255) / span : g.data[i];
    out[p] = v;
    out[p + 1] = v;
    out[p + 2] = v;
    out[p + 3] = 255;
  }
  return { data: out, width: w, height: h };
}

/** Adaptive threshold against the local mean (integral image). */
function bwFilter(r: Raster): Raster {
  const { width: w, height: h } = r;
  const g = toGray(r);
  const ii = integralImage(g);
  const half = Math.max(7, Math.round(Math.max(w, h) / 32));
  const out = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - half);
    const y1 = Math.min(h, y + half + 1);
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - half);
      const x1 = Math.min(w, x + half + 1);
      const sum = ii[y1 * (w + 1) + x1] - ii[y0 * (w + 1) + x1] - ii[y1 * (w + 1) + x0] + ii[y0 * (w + 1) + x0];
      const mean = sum / ((x1 - x0) * (y1 - y0));
      const v = g.data[y * w + x];
      const p = (y * w + x) * 4;
      const white = v > mean * 0.88 && v > 50 ? 255 : 0;
      out[p] = white;
      out[p + 1] = white;
      out[p + 2] = white;
      out[p + 3] = 255;
    }
  }
  return { data: out, width: w, height: h };
}

/**
 * Even out lighting: estimate the paper color per channel (dilate away ink, then a
 * wide blur on a small copy), divide it out, then stretch the dark end.
 */
function autoFilter(r: Raster): Raster {
  const { width: w, height: h, data } = r;
  const f = Math.max(1, Math.floor(Math.max(w, h) / 160));
  const sw = Math.max(1, Math.ceil(w / f));
  const sh = Math.max(1, Math.ceil(h / f));
  const small = resizeRaster(r, sw, sh);
  const blurRadius = Math.max(2, Math.round(Math.min(sw, sh) / 10));

  const bg: Float32Array[] = [];
  for (let c = 0; c < 3; c++) {
    const plane = new Float32Array(sw * sh);
    for (let i = 0; i < plane.length; i++) plane[i] = small.data[i * 4 + c];
    bg.push(blurPlane(maxFilter(plane, sw, sh, 2), sw, sh, blurRadius));
  }

  const sx = w / sw;
  const sy = h / sh;
  const out = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    const gy = Math.min(sh - 1, Math.max(0, (y + 0.5) / sy - 0.5));
    const y0 = Math.floor(gy);
    const y1 = Math.min(sh - 1, y0 + 1);
    const fy = gy - y0;
    for (let x = 0; x < w; x++) {
      const gx = Math.min(sw - 1, Math.max(0, (x + 0.5) / sx - 0.5));
      const x0 = Math.floor(gx);
      const x1 = Math.min(sw - 1, x0 + 1);
      const fx = gx - x0;
      const p = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const plane = bg[c];
        const top = plane[y0 * sw + x0] * (1 - fx) + plane[y0 * sw + x1] * fx;
        const bottom = plane[y1 * sw + x0] * (1 - fx) + plane[y1 * sw + x1] * fx;
        const bgv = Math.max(24, top * (1 - fy) + bottom * fy);
        out[p + c] = (data[p + c] * 255) / bgv;
      }
      out[p + 3] = 255;
    }
  }

  const lo = Math.min(110, histogramPercentile(lumaHistogram(out), w * h, 0.01));
  if (lo > 2) {
    const k = 255 / (255 - lo);
    for (let i = 0; i < out.length; i += 4) {
      out[i] = (out[i] - lo) * k;
      out[i + 1] = (out[i + 1] - lo) * k;
      out[i + 2] = (out[i + 2] - lo) * k;
    }
  }
  return { data: out, width: w, height: h };
}

export function applyFilter(r: Raster, id: FilterId): Raster {
  switch (id) {
    case 'original':
      return r;
    case 'gray':
      return grayFilter(r);
    case 'bw':
      return bwFilter(r);
    case 'auto':
      return autoFilter(r);
  }
}
