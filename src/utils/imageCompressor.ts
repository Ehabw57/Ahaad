/**
 * imageCompressor.ts — Pure logic for image compression tool.
 * Zero DOM or browser-specific dependencies.
 */

export type SupportedFormat = 'jpeg' | 'png' | 'webp';

export type ValidationReason = 'empty' | 'unsupported' | 'mismatch' | 'animated';

export type ValidationResult =
  | { ok: true; format: SupportedFormat }
  | { ok: false; reason: ValidationReason };

export const ALLOWED_MAX_DIMENSIONS = [3840, 2560, 1920, 1600, 1280, 1024, 800] as const;
export type AllowedMaxDimension = (typeof ALLOWED_MAX_DIMENSIONS)[number];

/**
 * Detect image format from magic bytes.
 */
export function detectFormat(bytes: Uint8Array): SupportedFormat | null {
  if (bytes.length < 12) return null;

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'png';
  }

  // WebP: RIFF at 0, WEBP at 8
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'webp';
  }

  return null;
}

/**
 * Check if a PNG or WebP image is animated.
 */
export function isAnimated(format: SupportedFormat, bytes: Uint8Array): boolean {
  if (format === 'jpeg') return false;

  if (format === 'png') {
    // Look for acTL chunk before first IDAT
    let offset = 8; // skip 8-byte signature
    while (offset + 8 <= bytes.length) {
      const length =
        ((bytes[offset] << 24) |
          (bytes[offset + 1] << 16) |
          (bytes[offset + 2] << 8) |
          bytes[offset + 3]) >>>
        0;
      const type = String.fromCharCode(
        bytes[offset + 4],
        bytes[offset + 5],
        bytes[offset + 6],
        bytes[offset + 7],
      );

      if (type === 'acTL') {
        return true;
      }
      if (type === 'IDAT' || type === 'IEND') {
        return false;
      }

      // Next chunk: 4 bytes length + 4 bytes type + length + 4 bytes CRC
      offset += 8 + length + 4;
    }
    return false;
  }

  if (format === 'webp') {
    // RIFF (4) + length (4) + WEBP (4)
    if (bytes.length < 16) return false;

    // Check chunk at offset 12
    const chunkType = String.fromCharCode(
      bytes[12],
      bytes[13],
      bytes[14],
      bytes[15],
    );

    if (chunkType === 'VP8X' && bytes.length >= 21) {
      // Flags byte is at offset 20
      const flags = bytes[20];
      // Bit 1: Animation flag
      if ((flags & 0x02) !== 0) {
        return true;
      }
    }

    // Scan chunks for 'ANIM' chunk
    let offset = 12;
    while (offset + 8 <= bytes.length) {
      const type = String.fromCharCode(
        bytes[offset],
        bytes[offset + 1],
        bytes[offset + 2],
        bytes[offset + 3],
      );
      if (type === 'ANIM') {
        return true;
      }
      // Chunk size is little-endian in RIFF
      const chunkSize =
        (bytes[offset + 4] |
          (bytes[offset + 5] << 8) |
          (bytes[offset + 6] << 16) |
          (bytes[offset + 7] << 24)) >>>
        0;

      // RIFF chunks are padded to even length
      const paddedSize = chunkSize + (chunkSize % 2);
      offset += 8 + paddedSize;
    }

    return false;
  }

  return false;
}

/**
 * Validates a file against sniffed format and animation state.
 */
export function validateFile(
  file: { name: string; type: string; size: number },
  sniffedFormat: SupportedFormat | null,
  animated = false,
): ValidationResult {
  if (file.size === 0) {
    return { ok: false, reason: 'empty' };
  }

  if (!sniffedFormat) {
    return { ok: false, reason: 'unsupported' };
  }

  if (animated) {
    return { ok: false, reason: 'animated' };
  }

  // Check declared MIME mismatch if present
  if (file.type && file.type.trim() !== '') {
    const declared = file.type.toLowerCase().trim();
    let declaredFormat: SupportedFormat | null = null;
    if (declared === 'image/jpeg' || declared === 'image/jpg') {
      declaredFormat = 'jpeg';
    } else if (declared === 'image/png') {
      declaredFormat = 'png';
    } else if (declared === 'image/webp') {
      declaredFormat = 'webp';
    }

    if (declaredFormat && declaredFormat !== sniffedFormat) {
      return { ok: false, reason: 'mismatch' };
    }
  }

  return { ok: true, format: sniffedFormat };
}

/**
 * Returns output MIME type for format.
 */
export function getOutputMime(format: SupportedFormat): string {
  switch (format) {
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
  }
}

/**
 * Returns extension for output file, preserving original extension if valid.
 */
export function getExtension(
  format: SupportedFormat,
  originalName: string,
): string {
  const match = originalName.match(/\.([a-zA-Z0-9]+)$/);
  const ext = match ? match[1].toLowerCase() : '';

  if (format === 'jpeg') {
    if (ext === 'jpeg') return '.jpeg';
    return '.jpg';
  }

  if (format === 'png') {
    return '.png';
  }

  if (format === 'webp') {
    return '.webp';
  }

  return `.${format}`;
}

/**
 * Generate output names with '-compressed' suffix, resolving collisions case-insensitively.
 */
export function makeOutputNames(originalNames: string[]): string[] {
  const used = new Map<string, number>();
  const results: string[] = [];

  for (const rawName of originalNames) {
    // Strip directory traversal / path separators
    const nameOnly = rawName.split(/[/\\]/).pop() || 'image';
    // Remove control characters
    const cleanName = nameOnly.replace(/[\x00-\x1f\x7f]/g, '');

    const lastDot = cleanName.lastIndexOf('.');
    let base = cleanName;
    let ext = '';
    if (lastDot > 0) {
      base = cleanName.substring(0, lastDot);
      ext = cleanName.substring(lastDot);
    }

    const compressedBase = `${base}-compressed`;
    let candidate = `${compressedBase}${ext}`;
    const candidateLower = candidate.toLowerCase();

    if (!used.has(candidateLower)) {
      used.set(candidateLower, 1);
      results.push(candidate);
    } else {
      let count = (used.get(candidateLower) || 1) + 1;
      let suffixedName = `${compressedBase}-${count}${ext}`;
      while (used.has(suffixedName.toLowerCase())) {
        count++;
        suffixedName = `${compressedBase}-${count}${ext}`;
      }
      used.set(candidateLower, count);
      used.set(suffixedName.toLowerCase(), 1);
      results.push(suffixedName);
    }
  }

  return results;
}

/**
 * Format bytes with Western digits and Arabic units.
 */
export function formatBytes(bytes: number): string {
  if (bytes < 0) return `0 بايت`;
  if (bytes < 1024) {
    return `${Math.round(bytes)} بايت`;
  }
  if (bytes < 1024 * 1024) {
    const kb = bytes / 1024;
    const formatted = kb < 10 ? kb.toFixed(1) : Math.round(kb).toString();
    return `${formatted.replace(/\.0$/, '')} كيلوبايت`;
  }
  const mb = bytes / (1024 * 1024);
  const formatted = mb < 10 ? mb.toFixed(1) : Math.round(mb).toString();
  return `${formatted.replace(/\.0$/, '')} ميغابايت`;
}

/**
 * Compute savings bytes and percentage.
 */
export function computeSavings(
  original: number,
  compressed: number,
): { percent: number; bytes: number; larger: boolean } {
  const bytes = original - compressed;
  const larger = compressed > original;
  const percent =
    original > 0 ? Math.round(((original - compressed) / original) * 100) : 0;

  return { percent, bytes, larger };
}

/**
 * Clamp quality value safely between 15 and 95.
 */
export function clampQuality(value: unknown, fallback = 75): number {
  let num: number;
  if (typeof value === 'number') {
    num = value;
  } else if (typeof value === 'string') {
    num = parseInt(value, 10);
  } else {
    return fallback;
  }

  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return fallback;
  }

  return Math.min(95, Math.max(15, Math.round(num)));
}

/**
 * Summarize done items for the completed bar.
 */
export function summarize(
  items: Array<{
    status: string;
    originalSize: number;
    result?: { size: number };
  }>,
) {
  const doneItems = items.filter(
    (i) => i.status === 'done' && i.result && typeof i.result.size === 'number',
  );

  const totalOriginal = doneItems.reduce((acc, i) => acc + i.originalSize, 0);
  const totalCompressed = doneItems.reduce(
    (acc, i) => acc + (i.result ? i.result.size : i.originalSize),
    0,
  );
  const savings = computeSavings(totalOriginal, totalCompressed);

  return {
    count: doneItems.length,
    totalOriginal,
    totalCompressed,
    savings,
  };
}

/**
 * Compute target dimensions given maximum dimension constraint without upscaling.
 */
export function computeTargetSize(
  width: number,
  height: number,
  maxDimension: number | null,
): { width: number; height: number; resized: boolean } {
  if (width <= 0 || height <= 0) {
    return { width: Math.max(1, width), height: Math.max(1, height), resized: false };
  }

  const longestSide = Math.max(width, height);
  if (!maxDimension || longestSide <= maxDimension) {
    return { width, height, resized: false };
  }

  const scale = maxDimension / longestSide;
  const targetW = Math.max(1, Math.round(width * scale));
  const targetH = Math.max(1, Math.round(height * scale));

  return { width: targetW, height: targetH, resized: true };
}

/**
 * Read width and height from PNG IHDR chunk without decoding pixels.
 */
export function readPngSize(
  bytes: Uint8Array,
): { width: number; height: number } | null {
  if (bytes.length < 24) return null;

  // Validate PNG signature
  if (
    bytes[0] !== 0x89 ||
    bytes[1] !== 0x50 ||
    bytes[2] !== 0x4e ||
    bytes[3] !== 0x47 ||
    bytes[4] !== 0x0d ||
    bytes[5] !== 0x0a ||
    bytes[6] !== 0x1a ||
    bytes[7] !== 0x0a
  ) {
    return null;
  }

  // IHDR starts at byte 12
  const chunkType = String.fromCharCode(
    bytes[12],
    bytes[13],
    bytes[14],
    bytes[15],
  );
  if (chunkType !== 'IHDR') return null;

  const width =
    ((bytes[16] << 24) |
      (bytes[17] << 16) |
      (bytes[18] << 8) |
      bytes[19]) >>>
    0;
  const height =
    ((bytes[20] << 24) |
      (bytes[21] << 16) |
      (bytes[22] << 8) |
      bytes[23]) >>>
    0;

  if (width === 0 || height === 0) return null;

  return { width, height };
}

/**
 * Parse and validate max dimension setting.
 */
export function parseMaxDimension(value: unknown): AllowedMaxDimension | null {
  if (value === null || value === undefined || value === '') return null;
  const num = typeof value === 'number' ? value : parseInt(String(value), 10);
  if (Number.isNaN(num)) return null;

  if ((ALLOWED_MAX_DIMENSIONS as readonly number[]).includes(num)) {
    return num as AllowedMaxDimension;
  }

  return null;
}
