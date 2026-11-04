import { Crop, Info, RotateCcw, RotateCw, X } from 'lucide-preact';
import { t } from '../messages.ts';

type Props = {
  disabled: boolean;
  showHint: boolean;
  onRotate: (dir: 1 | -1) => void;
  onCrop: () => void;
  onDismissHint: () => void;
};

const button =
  'flex size-11 items-center justify-center rounded-md border border-border bg-surface text-text-primary hover:border-border-hover disabled:cursor-not-allowed disabled:opacity-40';

export default function EditToolbar({ disabled, showHint, onRotate, onCrop, onDismissHint }: Props) {
  return (
    <div class="flex items-center gap-2">
      <button type="button" class={button} disabled={disabled} onClick={() => onRotate(1)} aria-label={t.rotateRight} title={t.rotateRight}>
        <RotateCw size={20} aria-hidden="true" />
      </button>
      <button type="button" class={button} disabled={disabled} onClick={() => onRotate(-1)} aria-label={t.rotateLeft} title={t.rotateLeft}>
        <RotateCcw size={20} aria-hidden="true" />
      </button>

      <div class="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={onCrop}
          aria-describedby={showHint ? 'crop-hint' : undefined}
          class="flex h-11 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-medium text-text-primary hover:border-border-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Crop size={20} aria-hidden="true" />
          {t.crop}
        </button>
        {showHint && !disabled && (
          <div
            id="crop-hint"
            role="status"
            class="absolute start-0 top-full z-10 mt-2 flex w-64 items-start gap-2 rounded-md border border-accent bg-surface p-3 text-sm text-text-primary"
          >
            <Info size={18} class="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
            <span class="flex-1">{t.cropHint}</span>
            <button
              type="button"
              onClick={onDismissHint}
              aria-label={t.dismiss}
              class="flex size-6 shrink-0 items-center justify-center rounded-sm text-text-secondary hover:bg-surface-container"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
