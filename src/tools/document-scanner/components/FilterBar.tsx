import { t } from '../messages.ts';
import type { FilterId, Raster } from '../types.ts';
import ImageCanvas from './ImageCanvas.tsx';

type Props = {
  tiles: Record<FilterId, Raster> | null;
  value: FilterId;
  canApplyAll: boolean;
  onSelect: (filter: FilterId) => void;
  onApplyAll: () => void;
};

const IDS: FilterId[] = ['original', 'auto', 'bw', 'gray'];

export default function FilterBar({ tiles, value, canApplyAll, onSelect, onApplyAll }: Props) {
  return (
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between gap-2">
        <span class="text-sm font-semibold text-text-primary">{t.filters}</span>
        <button
          type="button"
          disabled={!canApplyAll}
          onClick={onApplyAll}
          class="h-9 rounded-md border border-border bg-surface px-3 text-sm text-text-primary hover:border-border-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t.applyToAll}
        </button>
      </div>

      <div class="no-scrollbar flex gap-2 overflow-x-auto" role="radiogroup" aria-label={t.filters}>
        {IDS.map((id) => {
          const selected = id === value;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(id)}
              class={`flex w-24 shrink-0 flex-col items-center gap-2 rounded-md border p-2 text-xs ${
                selected ? 'border-accent bg-accent-container text-text-primary' : 'border-border bg-surface text-text-secondary hover:border-border-hover'
              }`}
            >
              <span class="flex aspect-square w-full items-center justify-center overflow-hidden rounded-sm bg-surface-subtle">
                {tiles && <ImageCanvas raster={tiles[id]} label="" class="h-full w-full object-contain" />}
              </span>
              {t.filterNames[id]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
