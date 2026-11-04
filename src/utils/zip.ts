/**
 * zip.ts — Client-side ZIP creation using fflate and file download helper.
 */

import { zip, zipSync, type AsyncZippable } from "fflate";

/**
 * Initiates browser download of a Blob with the specified filename.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();

  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Builds a ZIP file containing the provided blobs using fflate async API.
 * Uses compression level 0 (store) because image files are already compressed.
 */
export async function buildZip(
  entries: Array<{ name: string; blob: Blob }>,
): Promise<Blob> {
  const zippable: AsyncZippable = {};

  for (const entry of entries) {
    const arrayBuf = await entry.blob.arrayBuffer();
    zippable[entry.name] = [new Uint8Array(arrayBuf), { level: 0 }];
  }

  return new Promise<Blob>((resolve, reject) => {
    zip(zippable, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(new Blob([data], { type: "application/zip" }));
      }
    });
  });
}

export async function zipFiles(
  files: { name: string; blob: Blob }[],
): Promise<Blob> {
  const entries: Record<string, Uint8Array> = {};
  for (const f of files)
    entries[f.name] = new Uint8Array(await f.blob.arrayBuffer());
  const zipped = zipSync(entries, { level: 0 });
  return new Blob([zipped as BlobPart], { type: "application/zip" });
}
