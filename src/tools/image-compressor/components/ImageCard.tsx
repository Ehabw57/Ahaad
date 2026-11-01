/** @jsxImportSource preact */
import { X, Download, Loader2, AlertTriangle, AlertCircle } from 'lucide-preact';
import { formatBytes, computeSavings } from '../../../utils/imageCompressor.ts';
import { ERROR_MESSAGES, UI_MESSAGES } from '../messages.ts';
import type { ImageItem } from '../types.ts';

export interface ImageCardProps {
  item: ImageItem;
  isProcessing: boolean;
  onRemove: (id: string) => void;
  onDownload: (id: string) => void;
}

export default function ImageCard({
  item,
  isProcessing,
  onRemove,
  onDownload,
}: ImageCardProps) {
  const isDone = item.status === 'done' && Boolean(item.result);
  const isError = item.status === 'error';
  const isCardProcessing = item.status === 'processing';
  const isLarger = item.warning === 'LARGER_THAN_ORIGINAL';

  const savings = isDone && item.result
    ? computeSavings(item.originalSize, item.result.size)
    : null;

  return (
    <article
      class={`bg-surface rounded-md p-2.5 flex flex-col gap-2.5 shadow-xs border transition-all ${
        isError
          ? 'border-error/40 bg-error/5'
          : isLarger
            ? 'border-amber-500/40'
            : 'border-border'
      }`}
    >
      {/* Thumbnail area */}
      <div class="h-28 bg-surface-subtle rounded-md relative overflow-hidden flex items-center justify-center">
        {item.previewUrl ? (
          <img
            src={item.previewUrl}
            alt={item.file.name}
            class="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div class="w-full h-full flex items-center justify-center text-text-secondary">
            <span>{item.format.toUpperCase()}</span>
          </div>
        )}

        {/* Format Badge */}
        <span class="absolute top-1.5 right-1.5 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded backdrop-blur-xs select-none">
          {item.format === 'jpeg' ? 'JPG' : item.format.toUpperCase()}
        </span>

        {/* Remove Button */}
        {!isProcessing && (
          <button
            type="button"
            aria-label={UI_MESSAGES.removeImage}
            onClick={() => onRemove(item.id)}
            class="absolute top-1.5 left-1.5 w-6 h-6 rounded-md bg-black/60 hover:bg-error text-white flex items-center justify-center transition-colors backdrop-blur-xs cursor-pointer"
          >
            <X class="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}

        {/* Processing Spinner Overlay */}
        {isCardProcessing && (
          <div class="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center text-white">
            <Loader2 class="w-6 h-6 motion-safe:animate-spin" />
          </div>
        )}

        {/* Savings Badge */}
        {savings && (
          <div
            class={`absolute bottom-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs select-none ${
              savings.larger
                ? 'bg-amber-600 text-white'
                : 'bg-accent text-accent-foreground'
            }`}
          >
            {savings.larger ? `+${Math.abs(savings.percent)}%` : `-${savings.percent}%`}
          </div>
        )}
      </div>

      {/* Details area */}
      <div class="flex flex-col gap-1.5 px-0.5">
        <p
          class="text-xs font-semibold text-text-primary truncate"
          title={item.file.name}
        >
          {item.file.name}
        </p>

        {/* Status: Queued */}
        {item.status === 'queued' && (
          <div class="flex items-center justify-between text-[11px] text-text-secondary">
            <span>{formatBytes(item.originalSize)}</span>
            <span class="text-text-secondary/70">في الانتظار</span>
          </div>
        )}

        {/* Status: Processing */}
        {item.status === 'processing' && (
          <div class="flex items-center justify-between text-[11px] text-accent">
            <span>{formatBytes(item.originalSize)}</span>
            <span class="animate-pulse font-medium">جارٍ المعالجة...</span>
          </div>
        )}

        {/* Status: Done */}
        {isDone && item.result && (
          <>
            <div class="flex items-center justify-between text-[11px]">
              <span class="line-through text-text-secondary">
                {formatBytes(item.originalSize)}
              </span>
              <span class="text-accent font-bold">
                {formatBytes(item.result.size)}
              </span>
            </div>

            {isLarger && (
              <div class="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
                <AlertTriangle class="w-3 h-3 shrink-0" />
                <span>{UI_MESSAGES.largerThanOriginalWarning}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => onDownload(item.id)}
              class="mt-1 w-full py-1.5 rounded-md bg-surface-container hover:bg-accent/15 text-accent text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Download class="w-3.5 h-3.5" />
              <span>{UI_MESSAGES.downloadSingle}</span>
            </button>
          </>
        )}

        {/* Status: Error */}
        {isError && (
          <div class="flex items-start gap-1 text-[11px] text-error mt-0.5">
            <AlertCircle class="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span class="leading-tight">
              {item.error ? ERROR_MESSAGES[item.error] : 'تعذّرت معالجة الصورة.'}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
