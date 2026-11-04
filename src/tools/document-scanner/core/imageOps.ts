// Low-level pixel operations. Pure functions over typed arrays.

import type { Gray, Point, Raster, Rotation } from '../types.ts';

export function toGray(r: Raster): Gray {
  const { data, width, height } = r;
  const out = new Uint8ClampedArray(width * height);
  for (let i = 0, j = 0; j < out.length; i += 4, j++) {
    out[j] = (data[i] * 77 + data[i + 1] * 150 + data[i + 2] * 29) >> 8;
  }
  return { data: out, width, height };
}

/** Size that fits `maxSide` while keeping aspect. Never upscales. */
export function fitWithin(width: number, height: number, maxSide: number): { width: number; height: number } {
  const scale = Math.min(1, maxSide / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

/** Area-average resize. Good for downscaling; upscaling falls back to nearest. */
export function resizeRaster(src: Raster, dw: number, dh: number): Raster {
  if (dw === src.width && dh === src.height) return src;
  const out = new Uint8ClampedArray(dw * dh * 4);
  const sx = src.width / dw;
  const sy = src.height / dh;
  const s = src.data;
  for (let y = 0; y < dh; y++) {
    const y0 = y * sy;
    const y1 = y0 + sy;
    const iy0 = Math.floor(y0);
    const iy1 = Math.min(src.height, Math.ceil(y1));
    for (let x = 0; x < dw; x++) {
      const x0 = x * sx;
      const x1 = x0 + sx;
      const ix0 = Math.floor(x0);
      const ix1 = Math.min(src.width, Math.ceil(x1));
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let wsum = 0;
      for (let iy = iy0; iy < iy1; iy++) {
        const wy = Math.min(y1, iy + 1) - Math.max(y0, iy);
        for (let ix = ix0; ix < ix1; ix++) {
          const w = wy * (Math.min(x1, ix + 1) - Math.max(x0, ix));
          const p = (iy * src.width + ix) * 4;
          r += s[p] * w;
          g += s[p + 1] * w;
          b += s[p + 2] * w;
          a += s[p + 3] * w;
          wsum += w;
        }
      }
      const o = (y * dw + x) * 4;
      out[o] = r / wsum;
      out[o + 1] = g / wsum;
      out[o + 2] = b / wsum;
      out[o + 3] = a / wsum;
    }
  }
  return { data: out, width: dw, height: dh };
}

export function downscaleToMax(src: Raster, maxSide: number): Raster {
  const { width, height } = fitWithin(src.width, src.height, maxSide);
  return resizeRaster(src, width, height);
}

/** Blend semi-transparent pixels over white and make everything opaque. Mutates. */
export function flattenOnWhite(r: Raster): Raster {
  const d = r.data;
  for (let i = 0; i < d.length; i += 4) {
    const a = d[i + 3];
    if (a === 255) continue;
    const k = a / 255;
    d[i] = d[i] * k + 255 * (1 - k);
    d[i + 1] = d[i + 1] * k + 255 * (1 - k);
    d[i + 2] = d[i + 2] * k + 255 * (1 - k);
    d[i + 3] = 255;
  }
  return r;
}

/** Rotate clockwise by 0, 90, 180 or 270 degrees. */
export function rotateRaster(r: Raster, rotation: Rotation): Raster {
  if (rotation === 0) return r;
  const { width: w, height: h, data: s } = r;
  const swap = rotation !== 180;
  const dw = swap ? h : w;
  const dh = swap ? w : h;
  const out = new Uint8ClampedArray(dw * dh * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let nx: number;
      let ny: number;
      if (rotation === 90) {
        nx = h - 1 - y;
        ny = x;
      } else if (rotation === 180) {
        nx = w - 1 - x;
        ny = h - 1 - y;
      } else {
        nx = y;
        ny = w - 1 - x;
      }
      const si = (y * w + x) * 4;
      const di = (ny * dw + nx) * 4;
      out[di] = s[si];
      out[di + 1] = s[si + 1];
      out[di + 2] = s[si + 2];
      out[di + 3] = s[si + 3];
    }
  }
  return { data: out, width: dw, height: dh };
}

/** Separable box blur on a float plane, edges replicated. */
export function blurPlane(plane: Float32Array, w: number, h: number, radius: number): Float32Array {
  if (radius < 1) return plane.slice();
  const tmp = new Float32Array(w * h);
  const out = new Float32Array(w * h);
  const norm = 1 / (2 * radius + 1);

  for (let y = 0; y < h; y++) {
    const row = y * w;
    let sum = 0;
    for (let k = -radius; k <= radius; k++) sum += plane[row + clampIdx(k, w)];
    tmp[row] = sum * norm;
    for (let x = 1; x < w; x++) {
      sum += plane[row + clampIdx(x + radius, w)] - plane[row + clampIdx(x - radius - 1, w)];
      tmp[row + x] = sum * norm;
    }
  }
  for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let k = -radius; k <= radius; k++) sum += tmp[clampIdx(k, h) * w + x];
    out[x] = sum * norm;
    for (let y = 1; y < h; y++) {
      sum += tmp[clampIdx(y + radius, h) * w + x] - tmp[clampIdx(y - radius - 1, h) * w + x];
      out[y * w + x] = sum * norm;
    }
  }
  return out;
}

const clampIdx = (i: number, n: number): number => (i < 0 ? 0 : i >= n ? n - 1 : i);

/** Grayscale dilation (max filter), separable, square window. */
export function maxFilter(plane: Float32Array, w: number, h: number, radius: number): Float32Array {
  const tmp = new Float32Array(w * h);
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let m = -Infinity;
      for (let k = Math.max(0, x - radius); k <= Math.min(w - 1, x + radius); k++) {
        const v = plane[y * w + k];
        if (v > m) m = v;
      }
      tmp[y * w + x] = m;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let m = -Infinity;
      for (let k = Math.max(0, y - radius); k <= Math.min(h - 1, y + radius); k++) {
        const v = tmp[k * w + x];
        if (v > m) m = v;
      }
      out[y * w + x] = m;
    }
  }
  return out;
}

export function grayToPlane(g: Gray): Float32Array {
  const p = new Float32Array(g.data.length);
  for (let i = 0; i < p.length; i++) p[i] = g.data[i];
  return p;
}

export function blurGray(g: Gray, radius: number): Gray {
  const blurred = blurPlane(grayToPlane(g), g.width, g.height, radius);
  const out = new Uint8ClampedArray(blurred.length);
  for (let i = 0; i < out.length; i++) out[i] = blurred[i];
  return { data: out, width: g.width, height: g.height };
}

/** Sobel gradients. Magnitude of a perfect step of height H is about 4H. */
export function sobel(g: Gray): { gx: Float32Array; gy: Float32Array; mag: Float32Array } {
  const { data, width: w, height: h } = g;
  const gx = new Float32Array(w * h);
  const gy = new Float32Array(w * h);
  const mag = new Float32Array(w * h);
  const at = (x: number, y: number) => data[clampIdx(y, h) * w + clampIdx(x, w)];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx =
        at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x - 1, y) - at(x - 1, y + 1);
      const dy =
        at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1);
      const i = y * w + x;
      gx[i] = dx;
      gy[i] = dy;
      mag[i] = Math.hypot(dx, dy);
    }
  }
  return { gx, gy, mag };
}

export function histogram(g: Gray): Uint32Array {
  const hist = new Uint32Array(256);
  for (let i = 0; i < g.data.length; i++) hist[g.data[i]]++;
  return hist;
}

/** Value at percentile p (0..1) of a 256-bin histogram. */
export function histogramPercentile(hist: Uint32Array, total: number, p: number): number {
  const target = total * p;
  let acc = 0;
  for (let v = 0; v < 256; v++) {
    acc += hist[v];
    if (acc >= target) return v;
  }
  return 255;
}

export function otsuThreshold(g: Gray): number {
  const hist = histogram(g);
  const total = g.data.length;
  let sumAll = 0;
  for (let v = 0; v < 256; v++) sumAll += v * hist[v];
  let sumB = 0;
  let wB = 0;
  let best = 0;
  let bestVar = -1;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (wB === 0) continue;
    const wF = total - wB;
    if (wF === 0) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sumAll - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    if (between > bestVar) {
      bestVar = between;
      best = t;
    }
  }
  return best;
}

/** (w+1)*(h+1) summed-area table. */
export function integralImage(g: Gray): Float64Array {
  const { data, width: w, height: h } = g;
  const ii = new Float64Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) {
    let row = 0;
    for (let x = 0; x < w; x++) {
      row += data[y * w + x];
      ii[(y + 1) * (w + 1) + (x + 1)] = ii[y * (w + 1) + (x + 1)] + row;
    }
  }
  return ii;
}

function morph(mask: Uint8Array, w: number, h: number, r: number, kind: 'dilate' | 'erode'): Uint8Array {
  const ii = new Int32Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) {
    let row = 0;
    for (let x = 0; x < w; x++) {
      row += mask[y * w + x];
      ii[(y + 1) * (w + 1) + (x + 1)] = ii[y * (w + 1) + (x + 1)] + row;
    }
  }
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - r);
    const y1 = Math.min(h, y + r + 1);
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - r);
      const x1 = Math.min(w, x + r + 1);
      const count = ii[y1 * (w + 1) + x1] - ii[y0 * (w + 1) + x1] - ii[y1 * (w + 1) + x0] + ii[y0 * (w + 1) + x0];
      const area = (x1 - x0) * (y1 - y0);
      out[y * w + x] = kind === 'dilate' ? (count > 0 ? 1 : 0) : count === area ? 1 : 0;
    }
  }
  return out;
}

/** Morphological closing: fills small gaps and holes. Borders are not eroded. */
export function closeMask(mask: Uint8Array, w: number, h: number, r: number): Uint8Array {
  return morph(morph(mask, w, h, r, 'dilate'), w, h, r, 'erode');
}

/** Largest 4-connected component of a binary mask, or null when the mask is empty. */
export function largestComponent(mask: Uint8Array, w: number, h: number): { mask: Uint8Array; count: number } | null {
  const labels = new Int32Array(w * h);
  const stack = new Int32Array(w * h);
  let next = 0;
  let bestLabel = 0;
  let bestCount = 0;
  for (let start = 0; start < w * h; start++) {
    if (!mask[start] || labels[start]) continue;
    next++;
    let sp = 0;
    let count = 0;
    stack[sp++] = start;
    labels[start] = next;
    while (sp > 0) {
      const i = stack[--sp];
      count++;
      const x = i % w;
      const y = (i - x) / w;
      if (x > 0 && mask[i - 1] && !labels[i - 1]) {
        labels[i - 1] = next;
        stack[sp++] = i - 1;
      }
      if (x < w - 1 && mask[i + 1] && !labels[i + 1]) {
        labels[i + 1] = next;
        stack[sp++] = i + 1;
      }
      if (y > 0 && mask[i - w] && !labels[i - w]) {
        labels[i - w] = next;
        stack[sp++] = i - w;
      }
      if (y < h - 1 && mask[i + w] && !labels[i + w]) {
        labels[i + w] = next;
        stack[sp++] = i + w;
      }
    }
    if (count > bestCount) {
      bestCount = count;
      bestLabel = next;
    }
  }
  if (bestCount === 0) return null;
  const out = new Uint8Array(w * h);
  for (let i = 0; i < out.length; i++) if (labels[i] === bestLabel) out[i] = 1;
  return { mask: out, count: bestCount };
}

/**
 * Outline points of a mask: the first and last set pixel of every row and column,
 * as pixel edges. Their convex hull equals the hull of the whole mask.
 */
export function extremePoints(mask: Uint8Array, w: number, h: number): Point[] {
  const pts: Point[] = [];
  for (let y = 0; y < h; y++) {
    let first = -1;
    let last = -1;
    for (let x = 0; x < w; x++) {
      if (mask[y * w + x]) {
        if (first < 0) first = x;
        last = x;
      }
    }
    if (first >= 0) {
      pts.push({ x: first, y: y + 0.5 });
      pts.push({ x: last + 1, y: y + 0.5 });
    }
  }
  for (let x = 0; x < w; x++) {
    let first = -1;
    let last = -1;
    for (let y = 0; y < h; y++) {
      if (mask[y * w + x]) {
        if (first < 0) first = y;
        last = y;
      }
    }
    if (first >= 0) {
      pts.push({ x: x + 0.5, y: first });
      pts.push({ x: x + 0.5, y: last + 1 });
    }
  }
  return pts;
}
