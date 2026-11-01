/**
 * decode.ts — Decodes image file with EXIF orientation handling.
 */

export interface DecodedImage {
  width: number;
  height: number;
  draw(
    ctx: CanvasRenderingContext2D,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
  ): void;
  close(): void;
}

/**
 * Decodes an image file into a drawable representation, respecting EXIF orientation.
 * Throws 'DECODE_FAILED' on failure.
 */
export async function decodeImage(file: File): Promise<DecodedImage> {
  // Method 1: createImageBitmap with orientation
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: 'from-image',
      });
      return {
        width: bitmap.width,
        height: bitmap.height,
        draw: (ctx, dx, dy, dw, dh) => {
          ctx.drawImage(bitmap, dx, dy, dw, dh);
        },
        close: () => {
          bitmap.close();
        },
      };
    } catch {
      // Fall through to HTMLImageElement fallback
    }
  }

  // Method 2: HTMLImageElement via object URL
  return new Promise<DecodedImage>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        draw: (ctx, dx, dy, dw, dh) => {
          ctx.drawImage(img, dx, dy, dw, dh);
        },
        close: () => {
          URL.revokeObjectURL(url);
        },
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('DECODE_FAILED'));
    };

    img.src = url;
  });
}
