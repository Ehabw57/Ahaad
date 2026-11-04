// Perspective correction: inverse mapping with bilinear sampling.

import type { Corners, Raster } from '../types.ts';
import { dist, toPixels } from './geometry.ts';
import { homographyToQuad } from './homography.ts';
import { resizeRaster } from './imageOps.ts';

/**
 * Output size from the longer of each pair of opposite sides, in source pixels.
 * Never larger than the source resolution, and capped to `maxSide`.
 */
export function outputSize(
  corners: Corners,
  srcWidth: number,
  srcHeight: number,
  maxSide: number,
): { width: number; height: number } {
  const q = toPixels(corners, srcWidth, srcHeight);
  const w = Math.max(dist(q[0], q[1]), dist(q[3], q[2]));
  const h = Math.max(dist(q[0], q[3]), dist(q[1], q[2]));
  const scale = Math.min(1, maxSide / Math.max(w, h, 1));
  return { width: Math.max(1, Math.round(w * scale)), height: Math.max(1, Math.round(h * scale)) };
}

export function warpPerspective(src: Raster, corners: Corners, outW: number, outH: number): Raster {
  const H = homographyToQuad(outW, outH, toPixels(corners, src.width, src.height));
  if (!H) return resizeRaster(src, outW, outH);

  const [h0, h1, h2, h3, h4, h5, h6, h7, h8] = H;
  const { data: s, width: sw, height: sh } = src;
  const out = new Uint8ClampedArray(outW * outH * 4);

  for (let y = 0; y < outH; y++) {
    const py = y + 0.5;
    for (let x = 0; x < outW; x++) {
      const px = x + 0.5;
      const den = h6 * px + h7 * py + h8;
      const u = (h0 * px + h1 * py + h2) / den - 0.5;
      const v = (h3 * px + h4 * py + h5) / den - 0.5;

      const x0 = Math.floor(u);
      const y0 = Math.floor(v);
      const fx = u - x0;
      const fy = v - y0;
      const xa = x0 < 0 ? 0 : x0 >= sw ? sw - 1 : x0;
      const xb = x0 + 1 < 0 ? 0 : x0 + 1 >= sw ? sw - 1 : x0 + 1;
      const ya = y0 < 0 ? 0 : y0 >= sh ? sh - 1 : y0;
      const yb = y0 + 1 < 0 ? 0 : y0 + 1 >= sh ? sh - 1 : y0 + 1;

      const i00 = (ya * sw + xa) * 4;
      const i10 = (ya * sw + xb) * 4;
      const i01 = (yb * sw + xa) * 4;
      const i11 = (yb * sw + xb) * 4;
      const w00 = (1 - fx) * (1 - fy);
      const w10 = fx * (1 - fy);
      const w01 = (1 - fx) * fy;
      const w11 = fx * fy;

      const o = (y * outW + x) * 4;
      out[o] = s[i00] * w00 + s[i10] * w10 + s[i01] * w01 + s[i11] * w11;
      out[o + 1] = s[i00 + 1] * w00 + s[i10 + 1] * w10 + s[i01 + 1] * w01 + s[i11 + 1] * w11;
      out[o + 2] = s[i00 + 2] * w00 + s[i10 + 2] * w10 + s[i01 + 2] * w01 + s[i11 + 2] * w11;
      out[o + 3] = s[i00 + 3] * w00 + s[i10 + 3] * w10 + s[i01 + 3] * w01 + s[i11 + 3] * w11;
    }
  }
  return { data: out, width: outW, height: outH };
}
