import { Check, LoaderCircle, ScanSearch, X } from 'lucide-preact';
import { t } from '../messages.ts';

type Props = {
  detecting: boolean;
  onConfirm: () => void;
  onRedetect: () => void;
  onCancel: () => void;
};

const secondary =
  'flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-medium text-text-primary hover:border-border-hover disabled:cursor-not-allowed disabled:opacity-40';

export default function CropActions({ detecting, onConfirm, onRedetect, onCancel }: Props) {
  return (
    <div class="flex flex-col gap-3">
      <p class="text-sm text-text-secondary">{t.cropInstruction}</p>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onConfirm}
          class="flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground hover:bg-accent-hover"
        >
          <Check size={18} aria-hidden="true" />
          {t.confirm}
        </button>
        <button type="button" onClick={onRedetect} disabled={detecting} class={`${secondary} flex-1`}>
          {detecting ? <LoaderCircle size={18} class="animate-spin" aria-hidden="true" /> : <ScanSearch size={18} aria-hidden="true" />}
          {t.redetect}
        </button>
        <button type="button" onClick={onCancel} class={secondary}>
          <X size={18} aria-hidden="true" />
          {t.cancel}
        </button>
      </div>
    </div>
  );
}
