// Pure 2D geometry for quads. No DOM, no image data.

import type { Corners, Point } from '../types.ts';

const EPS = 1e-9;

export const clamp = (v: number, lo: number, hi: number): number => (v < lo ? lo : v > hi ? hi : v);

export const dist = (a: Point, b: Point): number => Math.hypot(a.x - b.x, a.y - b.y);

export function centroid(pts: Point[]): Point {
  let x = 0;
  let y = 0;
  for (const p of pts) {
    x += p.x;
    y += p.y;
  }
  return { x: x / pts.length, y: y / pts.length };
}

/** Frame inset by `margin` on every side (normalized). */
export function fullFrame(margin: number): Corners {
  const a = margin;
  const b = 1 - margin;
  return [
    { x: a, y: a },
    { x: b, y: a },
    { x: b, y: b },
    { x: a, y: b },
  ];
}

export function toPixels(c: Corners, width: number, height: number): Corners {
  return c.map((p) => ({ x: p.x * width, y: p.y * height })) as Corners;
}

export function toNormalized(pts: Point[], width: number, height: number): Point[] {
  return pts.map((p) => ({ x: clamp(p.x / width, 0, 1), y: clamp(p.y / height, 0, 1) }));
}

export function polygonArea(p: Point[]): number {
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const a = p[i];
    const b = p[(i + 1) % p.length];
    s += a.x * b.y - b.x * a.y;
  }
  return Math.abs(s) / 2;
}

/** True when every turn goes the same way and none is degenerate. */
export function isConvex(p: Point[]): boolean {
  const n = p.length;
  if (n < 3) return false;
  let sign = 0;
  for (let i = 0; i < n; i++) {
    const a = p[i];
    const b = p[(i + 1) % n];
    const c = p[(i + 2) % n];
    const cross = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    if (Math.abs(cross) < EPS) return false;
    const s = cross > 0 ? 1 : -1;
    if (sign === 0) sign = s;
    else if (s !== sign) return false;
  }
  return true;
}

/** Order 4 points as top-left, top-right, bottom-right, bottom-left (clockwise on screen). */
export function orderCorners(pts: Point[]): Corners {
  const c = centroid(pts);
  const sorted = [...pts].sort(
    (a, b) => Math.atan2(a.y - c.y, a.x - c.x) - Math.atan2(b.y - c.y, b.x - c.x),
  );
  let start = 0;
  let best = Infinity;
  sorted.forEach((p, i) => {
    const s = p.x + p.y;
    if (s < best) {
      best = s;
      start = i;
    }
  });
  return [0, 1, 2, 3].map((k) => sorted[(start + k) % 4]) as Corners;
}

/** Andrew's monotone chain. */
export function convexHull(points: Point[]): Point[] {
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const pts = sorted.filter((p, i) => i === 0 || p.x !== sorted[i - 1].x || p.y !== sorted[i - 1].y);
  if (pts.length < 3) return pts;
  const cross = (o: Point, a: Point, b: Point) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower: Point[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: Point[] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

type Line = { px: number; py: number; dx: number; dy: number };

/** Total least squares line through points. */
function fitLine(pts: Point[]): Line | null {
  if (pts.length < 2) return null;
  const m = centroid(pts);
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (const p of pts) {
    const x = p.x - m.x;
    const y = p.y - m.y;
    sxx += x * x;
    sxy += x * y;
    syy += y * y;
  }
  const theta = 0.5 * Math.atan2(2 * sxy, sxx - syy);
  return { px: m.x, py: m.y, dx: Math.cos(theta), dy: Math.sin(theta) };
}

function intersect(a: Line, b: Line): Point | null {
  const det = a.dx * b.dy - a.dy * b.dx;
  if (Math.abs(det) < 1e-6) return null;
  const t = ((b.px - a.px) * b.dy - (b.py - a.py) * b.dx) / det;
  return { x: a.px + t * a.dx, y: a.py + t * a.dy };
}

/**
 * Reduce a convex hull to 4 corners: drop the vertex whose removal loses the least
 * area, then refit each side to the hull points it covers and intersect adjacent sides.
 * That recovers sharp corners even when the hull has beveled or stair-stepped corners.
 */
export function reduceToQuad(hull: Point[]): Point[] | null {
  if (hull.length < 4) return null;
  const idx = hull.map((_, i) => i);
  while (idx.length > 4) {
    let best = 0;
    let bestArea = Infinity;
    for (let i = 0; i < idx.length; i++) {
      const a = hull[idx[(i + idx.length - 1) % idx.length]];
      const b = hull[idx[i]];
      const c = hull[idx[(i + 1) % idx.length]];
      const area = Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) / 2;
      if (area < bestArea) {
        bestArea = area;
        best = i;
      }
    }
    idx.splice(best, 1);
  }

  const lines: (Line | null)[] = [];
  for (let k = 0; k < 4; k++) {
    const from = idx[k];
    const to = idx[(k + 1) % 4];
    const pts: Point[] = [];
    for (let i = from; ; i = (i + 1) % hull.length) {
      pts.push(hull[i]);
      if (i === to) break;
    }
    lines.push(fitLine(pts));
  }

  const xs = hull.map((p) => p.x);
  const ys = hull.map((p) => p.y);
  const limit = 0.15 * Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));

  return [0, 1, 2, 3].map((k) => {
    const original = hull[idx[k]];
    const prev = lines[(k + 3) % 4];
    const next = lines[k];
    if (!prev || !next) return original;
    const p = intersect(prev, next);
    return p && dist(p, original) <= limit ? p : original;
  });
}

export function sideLengths(q: Point[]): number[] {
  return q.map((p, i) => dist(p, q[(i + 1) % q.length]));
}

/** Interior angle at each vertex, in degrees. */
export function interiorAngles(q: Point[]): number[] {
  return q.map((p, i) => {
    const a = q[(i + q.length - 1) % q.length];
    const b = q[(i + 1) % q.length];
    const ux = a.x - p.x;
    const uy = a.y - p.y;
    const vx = b.x - p.x;
    const vy = b.y - p.y;
    const denom = Math.hypot(ux, uy) * Math.hypot(vx, vy);
    if (denom < EPS) return 0;
    return (Math.acos(clamp((ux * vx + uy * vy) / denom, -1, 1)) * 180) / Math.PI;
  });
}

/**
 * Move one corner to `p`, clamped to the image. A move that would make the quad
 * non-convex is refused; we then try each axis alone so the handle can slide.
 */
export function clampDrag(corners: Corners, index: number, p: Point): Corners {
  const target = { x: clamp(p.x, 0, 1), y: clamp(p.y, 0, 1) };
  const cur = corners[index];
  const attempts = [target, { x: target.x, y: cur.y }, { x: cur.x, y: target.y }];
  for (const a of attempts) {
    const next = corners.map((c, i) => (i === index ? a : c)) as Corners;
    if (isConvex(next)) return next;
  }
  return corners;
}

/** Shrink a quad toward its centroid by `amount` (0.01 = 1% per side), to keep background pixels out of the crop. */
export function insetCorners(c: Corners, amount: number): Corners {
  const m = centroid(c);
  const k = 1 - 2 * amount;
  return c.map((p) => ({ x: m.x + (p.x - m.x) * k, y: m.y + (p.y - m.y) * k })) as Corners;
}
