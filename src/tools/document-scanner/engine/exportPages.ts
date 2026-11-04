// Export: full-resolution decode, render in the worker, JPEG encode, download.

import { zipFiles } from '../../../utils/zip.ts';
import { EXPORT_DECODE_SIDE, EXPORT_SIDE, JPEG_QUALITY } from '../config.ts';
import { exportFileName, ZIP_FILE_NAME } from '../messages.ts';
import type { Raster, ScanPage } from '../types.ts';
import { decodeToRaster } from './decode.ts';
import { toImageData } from './imageData.ts';
import type { ScannerClient } from './workerClient.ts';

export type NamedBlob = { name: string; blob: Blob };

function rasterToJpeg(r: Raster): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = r.width;
  canvas.height = r.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.reject(new Error('canvas unavailable'));
  ctx.fillStyle = '#ffffff'; // JPEG has no alpha channel
  ctx.fillRect(0, 0, r.width, r.height);
  ctx.putImageData(toImageData(r), 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        // Some browsers silently fall back to PNG when they cannot encode the type.
        if (blob && blob.type === 'image/jpeg') resolve(blob);
        else reject(new Error('jpeg encoding failed'));
      },
      'image/jpeg',
      JPEG_QUALITY,
    );
  });
}

async function renderJpeg(client: ScannerClient, page: ScanPage): Promise<Blob> {
  const full = await decodeToRaster(page.file, EXPORT_DECODE_SIDE);
  const out = await client.exportRender(full, page.corners, page.rotation, page.filter, EXPORT_SIDE);
  return rasterToJpeg(out);
}

export async function exportOne(client: ScannerClient, page: ScanPage, index: number): Promise<NamedBlob> {
  return { name: exportFileName(index), blob: await renderJpeg(client, page) };
}

/** One page at a time, to keep peak memory low. */
export async function exportAll(client: ScannerClient, pages: ScanPage[]): Promise<NamedBlob> {
  const files: NamedBlob[] = [];
  for (let i = 0; i < pages.length; i++) files.push(await exportOne(client, pages[i], i));
  return { name: ZIP_FILE_NAME, blob: await zipFiles(files) };
}

export function downloadBlob({ name, blob }: NamedBlob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
