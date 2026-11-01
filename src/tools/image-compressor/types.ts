import type { SupportedFormat, AllowedMaxDimension } from '../../utils/imageCompressor.ts';

export type ItemStatus = 'queued' | 'processing' | 'done' | 'error';

export type ErrorCode =
  | 'empty'
  | 'unsupported'
  | 'mismatch'
  | 'animated'
  | 'DECODE_FAILED'
  | 'CANVAS_FAILED'
  | 'FORMAT_NOT_PRESERVED'
  | 'ENGINE_LOAD_FAILED';

export interface ImageResult {
  blob: Blob;
  size: number;
  outputName: string;
}

export interface ImageItem {
  id: string;
  file: File;
  format: SupportedFormat;
  originalSize: number;
  status: ItemStatus;
  previewUrl: string;
  result?: ImageResult;
  warning?: 'LARGER_THAN_ORIGINAL';
  error?: ErrorCode;
}

export interface FileRejection {
  id: string;
  name: string;
  reason: ErrorCode;
}

export type { SupportedFormat, AllowedMaxDimension };
