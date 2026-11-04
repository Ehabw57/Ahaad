// File -> RGBA pixels, in the browser. EXIF orientation is applied and
// transparency is flattened onto white.

import { fitWithin } from '../core/imageOps.ts';
import type { Raster } from '../types.ts';

type Source = ImageBitmap | HTMLImageElement;

function loadImageElement(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('decode failed'));
    };
    img.src = url;
  });
}

async function open(file: File): Promise<Source> {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    // older engines reject the option object
  }
  try {
    return await createImageBitmap(file);
  } catch {
    // some engines cannot decode this file with createImageBitmap
  }
  return loadImageElement(file); // <img> applies EXIF orientation by default
}

/** Decode `file`, scaled down so its longest side is at most `maxSide`. */
export async function decodeToRaster(file: File, maxSide: number): Promise<Raster> {
  const src = await open(file);
  try {
    const sw = src instanceof HTMLImageElement ? src.naturalWidth : src.width;
    const sh = src instanceof HTMLImageElement ? src.naturalHeight : src.height;
    if (!sw || !sh) throw new Error('empty image');

    const { width, height } = fitWithin(sw, sh, maxSide);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('canvas unavailable');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, 0, 0, width, height);

    const image = ctx.getImageData(0, 0, width, height);
    return { data: image.data, width, height };
  } finally {
    if (!(src instanceof HTMLImageElement)) src.close();
  }
}
