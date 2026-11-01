/**
 * qrGenerator.ts — QR Code Generator logic and utilities for Ahaad.
 * Encapsulates URL normalization, size definitions, QR generation using 'qrcode',
 * and client-side asset export/downloading.
 */

import QRCode from "qrcode";

export type QrSizeKey = "small" | "medium" | "large";

export interface QrSizeConfig {
  key: QrSizeKey;
  label: string;
  dimension: number;
  spec: string;
  pixelLabel: string;
}

export const QR_SIZES: Record<QrSizeKey, QrSizeConfig> = {
  small: {
    key: "small",
    label: "صغير",
    dimension: 256,
    spec: "256×256",
    pixelLabel: "256px",
  },
  medium: {
    key: "medium",
    label: "متوسط",
    dimension: 512,
    spec: "512×512",
    pixelLabel: "512px",
  },
  large: {
    key: "large",
    label: "كبير",
    dimension: 1024,
    spec: "1024×1024",
    pixelLabel: "1024px",
  },
};

export const DEFAULT_QR_SIZE: QrSizeKey = "medium";

/**
 * Validates and normalizes website URL input per specification:
 * - Accepts URLs with or without https://
 * - Accepts both http:// and https://
 * - Automatically prepends https:// when missing protocol
 * - Rejects empty input, spaces, and invalid domains
 * - The normalized URL must be the exact value encoded in the QR code
 */
export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Disallow internal whitespace
  if (/\s/.test(trimmed)) return null;

  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    const host = parsed.hostname;
    if (!host) return null;

    // Check host: localhost or must contain valid dot-separated domain parts
    if (host !== "localhost") {
      if (!host.includes(".") || host.endsWith(".")) {
        return null;
      }
      const parts = host.split(".");
      if (parts.some((p) => !p || p.startsWith("-") || p.endsWith("-"))) {
        return null;
      }
    }

    return candidate;
  } catch {
    return null;
  }
}

export interface QrGenerationResult {
  svg: string;
  dataUrl: string;
}

/**
 * Generates both SVG markup and PNG data URL for the given normalized URL and dimension.
 * Fixed standard black foreground (#000000) and white background (#ffffff) with Error Correction Level M.
 */
export async function generateQrCode(
  url: string,
  dimension: number = QR_SIZES.medium.dimension,
): Promise<QrGenerationResult> {
  const options = {
    errorCorrectionLevel: "M" as const,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  };

  const [svg, dataUrl] = await Promise.all([
    QRCode.toString(url, {
      ...options,
      type: "svg",
      width: dimension,
    }),
    QRCode.toDataURL(url, {
      ...options,
      width: dimension,
    }),
  ]);

  return { svg: svg.trim(), dataUrl };
}

/**
 * Triggers a client-side download of a PNG image.
 */
export function downloadPng(dataUrl: string, filename: string): void {
  if (typeof window === "undefined") return;
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Triggers a client-side download of an SVG file.
 */
export function downloadSvg(svgString: string, filename: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Converts a data URL to a binary Blob for clipboard operations.
 */
export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return await response.blob();
}
