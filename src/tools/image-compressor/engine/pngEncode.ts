/**
 * pngEncode.ts — Lossless PNG compression via @jsquash/oxipng (WASM).
 * Only imported dynamically when a PNG is actually processed.
 */

import {
  computeTargetSize,
  readPngSize,
} from '../../../utils/imageCompressor.ts';
import { decodeImage } from './decode.ts';

export interface PngEncodeOptions {
  file: File;
  maxDimension: number | null;
}

/**
 * Optimises a PNG file using oxipng.
 * Resizes via canvas beforehand only if dimensions exceed maxDimension.
 */
export async function encodePng({
  file,
  maxDimension,
}: PngEncodeOptions): Promise<Blob> {
  // Dynamically load oxipng WASM module
  let oxipngModule: typeof import('@jsquash/oxipng');
  try {
    oxipngModule = await import('@jsquash/oxipng');
  } catch {
    throw new Error('ENGINE_LOAD_FAILED');
  }

  const { optimise } = oxipngModule;

  const originalBuffer = await file.arrayBuffer();
  let bufferToOptimise: ArrayBuffer = originalBuffer;

  // Check if downscaling is required
  if (maxDimension) {
    const pngSize = readPngSize(new Uint8Array(originalBuffer.slice(0, 32)));
    const longestSide = pngSize ? Math.max(pngSize.width, pngSize.height) : 0;

    if (longestSide > maxDimension) {
      // Decode and downscale on canvas
      const decoded = await decodeImage(file);
      try {
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
        // Note: Do not fill background — keep PNG transparency intact
        decoded.draw(ctx, 0, 0, targetSize.width, targetSize.height);

        const resizedBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), 'image/png');
        });

        canvas.width = 0;
        canvas.height = 0;

        if (!resizedBlob || resizedBlob.type !== 'image/png') {
          throw new Error('CANVAS_FAILED');
        }

        bufferToOptimise = await resizedBlob.arrayBuffer();
      } finally {
        decoded.close();
      }
    }
  }

  try {
    const optimisedBytes = await optimise(bufferToOptimise, {
      level: 2,
      interlace: false,
    });

    return new Blob([optimisedBytes], { type: 'image/png' });
  } catch (err: unknown) {
    // If oxipng failed due to memory or bad chunk, rethrow or fall back
    if (err instanceof Error && err.message.includes('ENGINE_LOAD')) {
      throw err;
    }
    throw new Error('CANVAS_FAILED');
  }
}
