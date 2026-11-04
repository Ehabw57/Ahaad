// Every tunable number lives here so tests and code share one source.

import type { FilterId } from './types.ts';

// Limits
export const MAX_PAGES = 20;
export const MAX_FILE_BYTES = 25 * 1024 * 1024;

// Working sizes (longest side, in pixels)
export const PROXY_SIDE = 1280;
export const DETECT_SIDE = 500;
export const PREVIEW_SIDE = 1000;
export const THUMB_SIDE = 240;
export const TILE_SIDE = 96;
export const EXPORT_SIDE = 3000;
export const EXPORT_DECODE_SIDE = 4096;

// Output
export const JPEG_QUALITY = 0.92;
export const DEFAULT_FILTER: FilterId = 'auto';

// Fallback frame used when no trustworthy quad exists
export const FRAME_MARGIN = 0.05;

// Rendering trims this fraction off every side so a sliver of background never survives at the edge
export const EDGE_INSET = 0.004;

// Gate: is a candidate a valid quadrilateral at all?
export const GATE = {
  minArea: 0.15, // fraction of the image
  maxArea: 0.98,
  minSide: 0.1, // fraction of the image diagonal
  minAngle: 45,
  maxAngle: 135,
};

// Quality: do the corners sit on real edges?
export const QUALITY = {
  /** Below this the detected quad is dropped for the full frame. */
  low: 0.35,
  /** Below this the crop button shows a hint. */
  hint: 0.6,
  weightEdge: 0.5,
  weightRing: 0.25,
  /** Shape can only lower the score: quality = evidence * (shapeFloor + (1 - shapeFloor) * shape). */
  shapeFloor: 0.5,
  /** Smallest brightness step (0..255) accepted as a real document edge. */
  minStep: 25,
  /** An edge gradient must exceed this multiple of the scene's median gradient. */
  textureFactor: 6,
  samplesPerSide: 40,
  /** Search range along the side normal, as a fraction of the shorter image side. */
  searchRange: 0.15,
  /** Localization falloff (gaussian sigma), same unit as searchRange. */
  sigma: 0.02,
};
