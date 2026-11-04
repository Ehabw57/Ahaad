// Raster -> browser ImageData. Our buffers are always plain ArrayBuffers.

import type { Raster } from '../types.ts';

export const toImageData = (r: Raster): ImageData =>
  new ImageData(r.data as Uint8ClampedArray<ArrayBuffer>, r.width, r.height);
