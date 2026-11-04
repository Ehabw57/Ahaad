import { Download, FileArchive, LoaderCircle, Plus } from 'lucide-preact';
import { t } from '../messages.ts';
import type { ScanPage } from '../types.ts';
import PageCard from './PageCard.tsx';

type Props = {
  pages: ScanPage[];
  activeId: string | null;
  /** True while cropping: everything here is inert. */
  locked: boolean;
  busy: boolean;
  canExport: boolean;
  canExportAll: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onAddFiles: (files: File[]) => void;
  onDownloadCurrent: () => void;
  onDownloadAll: () => void;
};

const downloadButton =
  'flex h-11 flex-1 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40';

export default function PagesPanel(p: Props) {
  return (
    <aside
      inert={p.locked || undefined}
      aria-label={t.pages}
      class="flex min-h-0 flex-col gap-3 rounded-md border border-border bg-surface p-3 lg:max-h-[calc(100svh-8rem)]"
    >
      <h2 class="text-sm font-semibold text-text-primary">{t.pages}</h2>

      <div class="no-scrollbar flex snap-x gap-2 overflow-x-auto lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-2 lg:content-start lg:overflow-y-auto lg:overflow-x-hidden">
        {p.pages.map((page, i) => (
          <PageCard
            key={page.id}
            page={page}
            number={i + 1}
            active={page.id === p.activeId}
            disabled={p.locked}
            onSelect={() => p.onSelect(page.id)}
            onRemove={() => p.onRemove(page.id)}
          />
        ))}

        <label
          class={`flex w-28 shrink-0 cursor-pointer snap-start flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border p-2 text-xs text-text-secondary hover:border-border-hover focus-within:outline focus-within:outline-2 focus-within:outline-accent lg:w-auto lg:aspect-auto lg:min-h-32 ${
            p.locked ? 'pointer-events-none opacity-40' : ''
          }`}
        >
          <Plus size={22} aria-hidden="true" />
          {t.addImage}
          <input
            type="file"
            accept="image/*"
            multiple
            class="sr-only"
            onChange={(e: Event) => {
              const input = e.currentTarget as HTMLInputElement;
              p.onAddFiles(Array.from(input.files ?? []));
              input.value = '';
            }}
          />
        </label>
      </div>

      <div class="flex gap-2">
        <button
          type="button"
          disabled={!p.canExport}
          onClick={p.onDownloadCurrent}
          class={`${downloadButton} bg-accent text-accent-foreground hover:bg-accent-hover`}
        >
          {p.busy ? <LoaderCircle size={18} class="animate-spin" aria-hidden="true" /> : <Download size={18} aria-hidden="true" />}
          <span class="truncate">{p.busy ? t.exporting : t.downloadCurrent}</span>
        </button>
        <button
          type="button"
          disabled={!p.canExportAll}
          onClick={p.onDownloadAll}
          class={`${downloadButton} border border-border bg-surface text-text-primary hover:border-border-hover`}
        >
          <FileArchive size={18} aria-hidden="true" />
          <span class="truncate">{t.downloadAll}</span>
        </button>
      </div>
    </aside>
  );
}
