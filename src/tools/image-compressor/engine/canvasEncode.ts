/**
 * canvasEncode.ts — Compresses JPEG and WebP images using HTML5 Canvas.
 */

import {
  computeTargetSize,
  getOutputMime,
  type SupportedFormat,
} from '../../../utils/imageCompressor.ts';
import type { DecodedImage } from './decode.ts';

export interface CanvasEncodeOptions {
  decoded: DecodedImage;
  format: 'jpeg' | 'webp';
  quality: number; // 15-95
  maxDimension: number | null;
}

/**
 * Encodes decoded image to JPEG or WebP blob via canvas.
 */
export async function encodeCanvas({
  decoded,
  format,
  quality,
  maxDimension,
}: CanvasEncodeOptions): Promise<Blob> {
  const targetSize = computeTargetSize(
    decoded.width,
    decoded.height,
    maxDimension,
  );

  const canvas = document.createElement('canvas');
  canvas.width = targetSize.width;
  canvas.height = targetSize.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.width = 0;
    canvas.height = 0;
    throw new Error('CANVAS_FAILED');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // For JPEG, fill background with white before drawing to avoid black transparency
  if (format === 'jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetSize.width, targetSize.height);
  }

  // Draw image
  decoded.draw(ctx, 0, 0, targetSize.width, targetSize.height);

  const requestedMime = getOutputMime(format);
  const qualityFraction = Math.min(0.95, Math.max(0.15, quality / 100));

  try {
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (b) => {
          resolve(b);
        },
        requestedMime,
        qualityFraction,
      );
    });

    if (!blob) {
      throw new Error('CANVAS_FAILED');
    }

    if (blob.type !== requestedMime) {
      throw new Error('FORMAT_NOT_PRESERVED');
    }

    return blob;
  } finally {
    // Release canvas internal bitmap memory
    canvas.width = 0;
    canvas.height = 0;
  }
}
