// Shared types for the document scanner. Pure data, no runtime code.

/** A point. Crop corners use normalized 0..1 coordinates on physical axes. */
export type Point = { x: number; y: number };

/** Quad corners in order: top-left, top-right, bottom-right, bottom-left. */
export type Corners = [Point, Point, Point, Point];

export type FilterId = 'original' | 'auto' | 'bw' | 'gray';

export type Rotation = 0 | 90 | 180 | 270;

/** RGBA pixels. Structurally compatible with the browser's ImageData. */
export type Raster = { data: Uint8ClampedArray; width: number; height: number };

/** 8-bit single channel image. */
export type Gray = { data: Uint8ClampedArray; width: number; height: number };

/**
 * found:   a geometrically valid quad candidate existed.
 * quality: 0..1, how well the corners sit on real document edges.
 * Both are informational. Neither one blocks a scan.
 */
export type Detection = { found: boolean; quality: number };

export type PageStatus = 'processing' | 'ready';

export type ScanPage = {
  id: string;
  file: File;
  proxy: Raster | null;
  corners: Corners;
  detection: Detection;
  manual: boolean;
  hintDismissed: boolean;
  rotation: Rotation;
  filter: FilterId;
  thumb: Raster | null;
  status: PageStatus;
};

export type Mode = 'view' | 'crop';

export type ScannerState = {
  pages: ScanPage[];
  activeId: string | null;
  mode: Mode;
  draft: Corners | null;
};
