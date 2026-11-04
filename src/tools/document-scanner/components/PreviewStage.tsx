import { LoaderCircle } from 'lucide-preact';
import { pageName, t } from '../messages.ts';
import type { Corners, Mode, Point, Raster, ScanPage } from '../types.ts';
import CropEditor from './CropEditor.tsx';
import ImageCanvas from './ImageCanvas.tsx';

type Props = {
  page: ScanPage | null;
  index: number;
  mode: Mode;
  preview: Raster | null;
  draft: Corners | null;
  onMoveCorner: (index: number, point: Point) => void;
};

export default function PreviewStage({ page, index, mode, preview, draft, onMoveCorner }: Props) {
  const cropping = mode === 'crop' && page?.proxy && draft;
  return (
    <div class="flex h-[55svh] min-h-80 items-center justify-center overflow-hidden rounded-md border border-border bg-surface-subtle p-3 lg:h-[calc(100svh-20rem)]">
      {cropping ? (
        <CropEditor proxy={page.proxy!} corners={draft!} onMove={onMoveCorner} />
      ) : preview ? (
        <ImageCanvas raster={preview} label={pageName(index + 1)} class="h-full w-full object-contain" />
      ) : (
        <div class="flex items-center gap-2 text-sm text-text-secondary" role="status">
          <LoaderCircle size={18} class="animate-spin" aria-hidden="true" />
          {t.processing}
        </div>
      )}
    </div>
  );
}
