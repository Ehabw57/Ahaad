// The only entry points the worker and tests need.
//   analyze        - detect + score + decide (never throws, never blocks a scan)
//   renderPage     - warp + filter + rotate at one size
//   renderVariants - the four filters at tile size, warping once

import { DETECT_SIDE, EDGE_INSET, FRAME_MARGIN, QUALITY } from '../config.ts';
import type { Corners, Detection, FilterId, Raster, Rotation } from '../types.ts';
import { detectQuads } from './detect.ts';
import { applyFilter } from './filters.ts';
import { fullFrame, insetCorners } from './geometry.ts';
import { downscaleToMax, fitWithin, flattenOnWhite, resizeRaster, rotateRaster, toGray } from './imageOps.ts';
import { scoreCorners } from './quality.ts';
import { outputSize, warpPerspective } from './warp.ts';

export type AnalyzeResult = { corners: Corners; detection: Detection };
export type Scored = { corners: Corners; quality: number };

/**
 * Policy. Scored candidates in, one decision out.
 *   none                -> full frame, found=false, quality=0
 *   quality < low       -> full frame (a doubtful crop could cut content), found=true
 *   otherwise           -> best candidate
 * The hint threshold is applied by the UI from `detection.quality`.
 */
export function decide(scored: Scored[]): AnalyzeResult {
  const frame = fullFrame(FRAME_MARGIN);
  let best: Scored | null = null;
  for (const s of scored) if (!best || s.quality > best.quality) best = s;
  if (!best) return { corners: frame, detection: { found: false, quality: 0 } };
  if (best.quality < QUALITY.low) return { corners: frame, detection: { found: true, quality: best.quality } };
  return { corners: best.corners, detection: { found: true, quality: best.quality } };
}

/** Best-effort analysis. Any failure degrades to the full frame. */
export function analyze(proxy: Raster): AnalyzeResult {
  try {
    const gray = toGray(downscaleToMax(proxy, DETECT_SIDE));
    return decide(detectQuads(gray).map((corners) => ({ corners, quality: scoreCorners(gray, corners) })));
  } catch {
    return decide([]);
  }
}

/** Warp at up to 2x the target (for small targets) then average down, for clean thumbnails. */
function warpTo(src: Raster, rawCorners: Corners, maxSide: number): Raster {
  const corners = insetCorners(rawCorners, EDGE_INSET);
  const work = maxSide <= 500 ? maxSide * 2 : maxSide;
  const { width, height } = outputSize(corners, src.width, src.height, work);
  const warped = warpPerspective(src, corners, width, height);
  const final = fitWithin(width, height, maxSide);
  return flattenOnWhite(resizeRaster(warped, final.width, final.height));
}

export function renderPage(
  src: Raster,
  corners: Corners,
  rotation: Rotation,
  filter: FilterId,
  maxSide: number,
): Raster {
  return rotateRaster(applyFilter(warpTo(src, corners, maxSide), filter), rotation);
}

const FILTER_IDS: FilterId[] = ['original', 'auto', 'bw', 'gray'];

export function renderVariants(
  src: Raster,
  corners: Corners,
  rotation: Rotation,
  side: number,
): Record<FilterId, Raster> {
  const base = warpTo(src, corners, side);
  const out = {} as Record<FilterId, Raster>;
  for (const id of FILTER_IDS) out[id] = rotateRaster(applyFilter(base, id), rotation);
  return out;
}
