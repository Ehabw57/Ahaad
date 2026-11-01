/** @jsxImportSource preact */
import ImageCard from './ImageCard.tsx';
import { UI_MESSAGES } from '../messages.ts';
import type { ImageItem } from '../types.ts';

export interface ImageGridProps {
  items: ImageItem[];
  isProcessing: boolean;
  onRemove: (id: string) => void;
  onDownload: (id: string) => void;
}

export default function ImageGrid({
  items,
  isProcessing,
  onRemove,
  onDownload,
}: ImageGridProps) {
  if (items.length === 0) return null;

  return (
    <section class="flex flex-col gap-3">
      {/* Header */}
      <div class="flex items-center justify-between text-xs sm:text-sm text-text-secondary px-1">
        <span class="font-bold text-text-primary">
          {UI_MESSAGES.itemsCount(items.length)}
        </span>
        <span class="text-xs">
          {UI_MESSAGES.downloadAvailable}
        </span>
      </div>

      {/* 2 cols on mobile, 3 on sm, 5 on lg */}
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {items.map((item) => (
          <ImageCard
            key={item.id}
            item={item}
            isProcessing={isProcessing}
            onRemove={onRemove}
            onDownload={onDownload}
          />
        ))}
      </div>
    </section>
  );
}
