/** @jsxImportSource preact */
import { Loader2, CheckCircle2, Archive } from 'lucide-preact';
import { summarize, formatBytes } from '../../../utils/imageCompressor.ts';
import { UI_MESSAGES } from '../messages.ts';
import type { ImageItem } from '../types.ts';

export interface StatusBarProps {
  items: ImageItem[];
  isProcessing: boolean;
  processedCount: number;
  isZipping: boolean;
  onDownloadAll: () => void;
}

export default function StatusBar({
  items,
  isProcessing,
  processedCount,
  isZipping,
  onDownloadAll,
}: StatusBarProps) {
  const total = items.length;

  if (isProcessing) {
    const percent = total > 0 ? Math.round((processedCount / total) * 100) : 0;

    return (
      <div
        aria-live="polite"
        class="bg-surface rounded-md p-5 border border-border shadow-xs flex flex-col gap-3"
      >
        <div class="flex items-center justify-between text-xs sm:text-sm font-semibold">
          <div class="flex items-center gap-2.5 text-accent">
            <Loader2 class="w-5 h-5 motion-safe:animate-spin" />
            <span>{UI_MESSAGES.processingCount(processedCount, total)}</span>
          </div>
          <span class="text-accent">{percent}%</span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${percent}%`}
          class="w-full bg-surface-subtle rounded-full h-2.5 overflow-hidden border border-border"
        >
          <div
            class="bg-accent h-full rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        <p class="text-xs text-text-secondary">
          {UI_MESSAGES.processingNotice}
        </p>
      </div>
    );
  }

  const { count: doneCount, totalOriginal, totalCompressed, savings } = summarize(items);

  if (doneCount > 0) {
    const isSaved = savings.bytes > 0;

    return (
      <div
        aria-live="polite"
        class="bg-surface rounded-md p-5 border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <CheckCircle2 class="w-6 h-6" />
          </div>
          <div class="flex flex-col gap-0.5">
            <p class="font-bold text-sm sm:text-base text-text-primary">
              {isSaved
                ? UI_MESSAGES.completedSuccess(savings.percent)
                : UI_MESSAGES.completedNeutral}
            </p>
            <p class="text-xs text-text-secondary">
              {isSaved
                ? UI_MESSAGES.completedDetail(
                    formatBytes(totalCompressed),
                    formatBytes(savings.bytes),
                  )
                : `الحجم الكلي: ${formatBytes(totalCompressed)}`}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isZipping || doneCount === 0}
          onClick={onDownloadAll}
          class="px-5 py-2.5 rounded-md bg-accent hover:bg-accent-hover text-accent-foreground text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isZipping ? (
            <Loader2 class="w-4 h-4 motion-safe:animate-spin" />
          ) : (
            <Archive class="w-4 h-4" />
          )}
          <span>{UI_MESSAGES.downloadZip}</span>
        </button>
      </div>
    );
  }

  return null;
}
