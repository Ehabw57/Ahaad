/** @jsxImportSource preact */
import { Image as ImageIcon, Trash2, Zap } from 'lucide-preact';
import { formatBytes } from '../../../utils/imageCompressor.ts';
import { UI_MESSAGES } from '../messages.ts';

export interface SummaryBarProps {
  count: number;
  totalOriginalSize: number;
  hasDoneItems: boolean;
  isProcessing: boolean;
  onClear: () => void;
  onCompress: () => void;
}

export default function SummaryBar({
  count,
  totalOriginalSize,
  hasDoneItems,
  isProcessing,
  onClear,
  onCompress,
}: SummaryBarProps) {
  if (count === 0) return null;

  return (
    <div class="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-md bg-surface border border-border shadow-xs">
      {/* Left / Info */}
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-accent shrink-0">
          <ImageIcon class="w-5 h-5" />
        </div>
        <div>
          <p class="font-bold text-sm sm:text-base text-text-primary">
            {count} {count === 1 ? 'صورة' : count === 2 ? 'صورتان' : count <= 10 ? 'صور' : 'صورة'} · {formatBytes(totalOriginalSize)}
          </p>
          <p class="text-xs text-text-secondary">
            {UI_MESSAGES.summaryReady}
          </p>
        </div>
      </div>

      {/* Right / Actions */}
      <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end">
        <button
          type="button"
          disabled={isProcessing}
          onClick={onClear}
          class="px-4 py-2.5 rounded-md border border-border bg-surface-subtle hover:bg-surface-container text-text-secondary hover:text-text-primary text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
        >
          <Trash2 class="w-4 h-4" />
          <span>{UI_MESSAGES.clearList}</span>
        </button>

        <button
          type="button"
          disabled={isProcessing}
          onClick={onCompress}
          class="px-6 py-2.5 rounded-md bg-accent hover:bg-accent-hover text-accent-foreground text-xs sm:text-sm font-bold transition-all shadow-xs inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap class="w-4 h-4" />
          <span>{hasDoneItems ? UI_MESSAGES.recompress : UI_MESSAGES.startCompress}</span>
        </button>
      </div>
    </div>
  );
}
