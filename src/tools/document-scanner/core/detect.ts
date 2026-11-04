// Candidate detection. This file only answers: "is there a valid-looking quad?"
// It says nothing about whether the quad sits on real edges; that is quality.ts.

import { GATE } from '../config.ts';
import type { Corners, Gray, Point } from '../types.ts';
import {
  convexHull,
  interiorAngles,
  isConvex,
  orderCorners,
  polygonArea,
  reduceToQuad,
  sideLengths,
  toNormalized,
} from './geometry.ts';
import { blurGray, closeMask, extremePoints, largestComponent, otsuThreshold } from './imageOps.ts';

/** The gate: geometric validity only (pixel-space quad). */
export function passesGate(q: Point[], width: number, height: number): boolean {
  if (q.length !== 4 || !isConvex(q)) return false;
  const area = polygonArea(q) / (width * height);
  if (area < GATE.minArea || area > GATE.maxArea) return false;
  const diagonal = Math.hypot(width, height);
  if (Math.min(...sideLengths(q)) < GATE.minSide * diagonal) return false;
  return interiorAngles(q).every((a) => a >= GATE.minAngle && a <= GATE.maxAngle);
}

/**
 * Candidate quads, normalized and ordered. Tries a bright document on a darker
 * background and the reverse; each polarity yields at most one candidate.
 */
export function detectQuads(gray: Gray): Corners[] {
  const { width: w, height: h } = gray;
  const smooth = blurGray(gray, 2);
  const threshold = otsuThreshold(smooth);
  const candidates: Corners[] = [];

  for (const bright of [true, false]) {
    const mask = new Uint8Array(w * h);
    for (let i = 0; i < mask.length; i++) mask[i] = smooth.data[i] > threshold === bright ? 1 : 0;

    const component = largestComponent(closeMask(mask, w, h, 2), w, h);
    if (!component || component.count < GATE.minArea * w * h * 0.5) continue;

    const quad = reduceToQuad(convexHull(extremePoints(component.mask, w, h)));
    if (!quad || !passesGate(quad, w, h)) continue;

    candidates.push(orderCorners(toNormalized(quad, w, h)));
  }
  return candidates;
}
