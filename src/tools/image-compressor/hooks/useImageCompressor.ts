/**
 * useImageCompressor.ts — State management and orchestration for Image Compressor.
 */

import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import {
  detectFormat,
  isAnimated,
  validateFile,
  makeOutputNames,
  clampQuality,
  parseMaxDimension,
  type AllowedMaxDimension,
} from '../../../utils/imageCompressor.ts';
import { getStoredToolValue, setStoredToolValue } from '../../../utils/stateSync.ts';
import { decodeImage } from '../engine/decode.ts';
import { encodeCanvas } from '../engine/canvasEncode.ts';
import { encodePng } from '../engine/pngEncode.ts';
import { downloadBlob, buildZip } from '../../../utils/zip.ts'
import type { ImageItem, FileRejection, ErrorCode } from '../types.ts';

const TOOL_SLUG = 'image-compressor';

export function useImageCompressor() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [rejections, setRejections] = useState<FileRejection[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [isZipping, setIsZipping] = useState(false);

  // Settings
  const [quality, setQualityState] = useState<number>(75);
  const [maxDimension, setMaxDimensionState] = useState<AllowedMaxDimension | null>(null);

  const isCancelledRef = useRef(false);
  const itemsRef = useRef<ImageItem[]>(items);
  itemsRef.current = items;

  // Restore settings from localStorage after mount (SSR safe)
  useEffect(() => {
    const savedQuality = getStoredToolValue(TOOL_SLUG, 'quality', 75);
    setQualityState(clampQuality(savedQuality, 75));

    const savedMaxDim = getStoredToolValue(TOOL_SLUG, 'maxDimension', null);
    setMaxDimensionState(parseMaxDimension(savedMaxDim));
  }, []);

  // Update quality and persist
  const setQuality = useCallback((val: number) => {
    const clamped = clampQuality(val, 75);
    setQualityState(clamped);
    setStoredToolValue(TOOL_SLUG, 'quality', clamped);
  }, []);

  // Update max dimension and persist
  const setMaxDimension = useCallback((val: AllowedMaxDimension | null) => {
    const parsed = parseMaxDimension(val);
    setMaxDimensionState(parsed);
    setStoredToolValue(TOOL_SLUG, 'maxDimension', parsed);
  }, []);

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      isCancelledRef.current = true;
      for (const item of itemsRef.current) {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      }
    };
  }, []);

  // Add files
  const addFiles = useCallback(async (files: File[]) => {
    if (isProcessing) return;

    const newItems: ImageItem[] = [];
    const newRejections: FileRejection[] = [];

    for (const file of files) {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      if (file.size === 0) {
        newRejections.push({ id, name: file.name, reason: 'empty' });
        continue;
      }

      try {
        // Read first 64KB for header sniffing & chunk inspection
        const slice = await file.slice(0, Math.min(file.size, 65536)).arrayBuffer();
        const bytes = new Uint8Array(slice);
        const sniffed = detectFormat(bytes);

        if (!sniffed) {
          newRejections.push({ id, name: file.name, reason: 'unsupported' });
          continue;
        }

        const animated = isAnimated(sniffed, bytes);
        const validation = validateFile(
          { name: file.name, type: file.type, size: file.size },
          sniffed,
          animated,
        );

        if (!validation.ok) {
          newRejections.push({ id, name: file.name, reason: validation.reason });
          continue;
        }

        const previewUrl = URL.createObjectURL(file);
        newItems.push({
          id,
          file,
          format: validation.format,
          originalSize: file.size,
          status: 'queued',
          previewUrl,
        });
      } catch {
        newRejections.push({ id, name: file.name, reason: 'DECODE_FAILED' });
      }
    }

    if (newRejections.length > 0) {
      setRejections((prev) => [...prev, ...newRejections]);
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
    }
  }, [isProcessing]);

  // Remove single item
  const removeItem = useCallback((id: string) => {
    if (isProcessing) return;
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  }, [isProcessing]);

  // Clear all items
  const clearAll = useCallback(() => {
    if (isProcessing) return;
    for (const item of items) {
      if (item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
    }
    setItems([]);
  }, [items, isProcessing]);

  // Dismiss a rejection notice
  const dismissRejection = useCallback((id: string) => {
    setRejections((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Clear all rejections
  const clearRejections = useCallback(() => {
    setRejections([]);
  }, []);

  // Sequential compression queue
  const compressAll = useCallback(async () => {
    if (isProcessing || items.length === 0) return;

    setIsProcessing(true);
    setProcessedCount(0);
    isCancelledRef.current = false;

    const currentItems = [...items];
    const outputNames = makeOutputNames(currentItems.map((i) => i.file.name));

    // Reset status to queued before running
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        status: 'queued',
        error: undefined,
        warning: undefined,
      })),
    );

    for (let index = 0; index < currentItems.length; index++) {
      if (isCancelledRef.current) break;

      const item = currentItems[index];
      const outputName = outputNames[index];

      // Mark current item as processing
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: 'processing' } : i)),
      );

      // Yield to let UI render the processing state
      await new Promise((r) => setTimeout(r, 0));
      if (isCancelledRef.current) break;

      try {
        let compressedBlob: Blob;

        if (item.format === 'png') {
          compressedBlob = await encodePng({
            file: item.file,
            maxDimension,
          });
        } else {
          const decoded = await decodeImage(item.file);
          try {
            compressedBlob = await encodeCanvas({
              decoded,
              format: item.format,
              quality,
              maxDimension,
            });
          } finally {
            decoded.close();
          }
        }

        if (isCancelledRef.current) break;

        const compressedSize = compressedBlob.size;
        const isLarger = compressedSize > item.originalSize;

        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: 'done',
                  result: {
                    blob: compressedBlob,
                    size: compressedSize,
                    outputName,
                  },
                  warning: isLarger ? 'LARGER_THAN_ORIGINAL' : undefined,
                  error: undefined,
                }
              : i,
          ),
        );
      } catch (err: unknown) {
        if (isCancelledRef.current) break;

        let errorCode: ErrorCode = 'CANVAS_FAILED';
        if (err instanceof Error) {
          const msg = err.message as ErrorCode;
          if (
            msg === 'DECODE_FAILED' ||
            msg === 'CANVAS_FAILED' ||
            msg === 'FORMAT_NOT_PRESERVED' ||
            msg === 'ENGINE_LOAD_FAILED'
          ) {
            errorCode = msg;
          }
        }

        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: 'error',
                  error: errorCode,
                }
              : i,
          ),
        );
      }

      setProcessedCount(index + 1);
      // Yield to the event loop so progress updates
      await new Promise((r) => setTimeout(r, 0));
    }

    setIsProcessing(false);
  }, [items, isProcessing, quality, maxDimension]);

  // Download single item
  const downloadOne = useCallback((id: string) => {
    const item = items.find((i) => i.id === id);
    if (item?.status === 'done' && item.result) {
      downloadBlob(item.result.blob, item.result.outputName);
    }
  }, [items]);

  // Download all as ZIP
  const downloadAll = useCallback(async () => {
    if (isZipping) return;
    const doneItems = items.filter(
      (i): i is ImageItem & { result: NonNullable<ImageItem['result']> } =>
        i.status === 'done' && Boolean(i.result),
    );

    if (doneItems.length === 0) return;

    setIsZipping(true);
    try {
      const entries = doneItems.map((i) => ({
        name: i.result.outputName,
        blob: i.result.blob,
      }));
      const zipBlob = await buildZip(entries);
      downloadBlob(zipBlob, 'compressed-images.zip');
    } catch (err) {
      console.error('ZIP creation failed:', err);
    } finally {
      setIsZipping(false);
    }
  }, [items, isZipping]);

  return {
    items,
    rejections,
    isProcessing,
    processedCount,
    isZipping,
    quality,
    maxDimension,
    setQuality,
    setMaxDimension,
    addFiles,
    removeItem,
    clearAll,
    dismissRejection,
    clearRejections,
    compressAll,
    downloadOne,
    downloadAll,
  };
}
