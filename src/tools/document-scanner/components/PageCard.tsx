import { LoaderCircle, X } from 'lucide-preact';
import { pageName, t } from '../messages.ts';
import type { ScanPage } from '../types.ts';
import ImageCanvas from './ImageCanvas.tsx';

type Props = {
  page: ScanPage;
  number: number;
  active: boolean;
  disabled: boolean;
  onSelect: () => void;
  onRemove: () => void;
};

/** Name, 1:1 thumbnail (whole page visible) and a remove button. Nothing else. */
export default function PageCard({ page, number, active, disabled, onSelect, onRemove }: Props) {
  const name = pageName(number);
  return (
    <div
      class={`relative w-28 shrink-0 snap-start rounded-md border border-border bg-surface p-2 lg:w-auto ${
        active ? 'outline outline-2 outline-accent' : ''
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        disabled={disabled}
        aria-pressed={active}
        aria-label={name}
        class="block w-full text-start disabled:cursor-not-allowed"
      >
        <span class="flex aspect-square w-full items-center justify-center overflow-hidden rounded-sm bg-surface-subtle">
          {page.thumb ? (
            <ImageCanvas raster={page.thumb} label="" class="h-full w-full object-contain" />
          ) : (
            <LoaderCircle size={20} class="animate-spin text-text-secondary" aria-label={t.processing} />
          )}
        </span>
        <span class="mt-2 block truncate text-sm font-medium text-text-primary">{name}</span>
      </button>
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`${t.remove} ${name}`}
        class="absolute end-3 top-3 flex size-7 items-center justify-center rounded-sm border border-border bg-surface text-text-secondary hover:text-error disabled:cursor-not-allowed disabled:opacity-40"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
