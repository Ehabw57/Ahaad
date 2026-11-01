/** @jsxImportSource preact */
import { useImageCompressor } from './hooks/useImageCompressor.ts';
import FileDropzone from '../../components/ui/FileDropzone.tsx';
import SettingsPanel from './components/SettingsPanel.tsx';
import SummaryBar from './components/SummaryBar.tsx';
import StatusBar from './components/StatusBar.tsx';
import ImageGrid from './components/ImageGrid.tsx';
import { ERROR_MESSAGES, UI_MESSAGES } from './messages.ts';
import { AlertCircle, X } from 'lucide-preact';

export default function ImageCompressor() {
  const {
    items,
    rejections,
    isProcessing,
    processedCount,
    isZipping,
    quality,
    maxDimension,
    setQuality,
    setMaxDimension,
    addFiles,
    removeItem,
    clearAll,
    dismissRejection,
    compressAll,
    downloadOne,
    downloadAll,
  } = useImageCompressor();

  const hasItems = items.length > 0;
  const hasPng = items.some((i) => i.format === 'png');
  const hasDoneItems = items.some((i) => i.status === 'done');
  const totalOriginalSize = items.reduce((acc, i) => acc + i.originalSize, 0);

  return (
    <div class="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Rejections Alert */}
      {rejections.length > 0 && (
        <div
          role="alert"
          aria-live="polite"
          class="bg-error/10 border border-error/30 rounded-md p-4 flex flex-col gap-2"
        >
          <div class="flex items-center gap-2 text-error font-bold text-xs sm:text-sm">
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{UI_MESSAGES.rejectionsHeader}</span>
          </div>
          <ul class="flex flex-col gap-1.5 mr-6 text-xs text-text-primary">
            {rejections.map((rej) => (
              <li
                key={rej.id}
                class="flex items-center justify-between gap-2 bg-surface/60 px-3 py-1.5 rounded-md border border-border"
              >
                <div class="flex items-center gap-2 truncate">
                  <span class="font-semibold truncate">{rej.name}</span>
                  <span class="text-text-secondary">—</span>
                  <span class="text-error">
                    {ERROR_MESSAGES[rej.reason] || rej.reason}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label={UI_MESSAGES.dismissRejection}
                  onClick={() => dismissRejection(rej.id)}
                  class="text-text-secondary hover:text-text-primary p-0.5 rounded transition-colors cursor-pointer"
                >
                  <X class="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Dropzone */}
      <FileDropzone
        compact={hasItems}
        disabled={isProcessing}
        title={UI_MESSAGES.dropzoneTitle}
        subtitle={UI_MESSAGES.dropzoneSubtitle}
        buttonText={UI_MESSAGES.dropzoneButton}
        hintText={UI_MESSAGES.dropzoneHint}
        onFiles={addFiles}
      />

      {/* Workspace (Settings + Summary + Status + Grid) */}
      {hasItems && (
        <div class="flex flex-col gap-6">
          {/* Settings Panel */}
          <SettingsPanel
            quality={quality}
            maxDimension={maxDimension}
            hasPng={hasPng}
            disabled={isProcessing}
            onQualityChange={setQuality}
            onMaxDimensionChange={setMaxDimension}
          />

          {/* Summary Bar */}
          <SummaryBar
            count={items.length}
            totalOriginalSize={totalOriginalSize}
            hasDoneItems={hasDoneItems}
            isProcessing={isProcessing}
            onClear={clearAll}
            onCompress={compressAll}
          />

          {/* Status Bar (Processing or Completed) */}
          <StatusBar
            items={items}
            isProcessing={isProcessing}
            processedCount={processedCount}
            isZipping={isZipping}
            onDownloadAll={downloadAll}
          />

          {/* Results Grid */}
          <ImageGrid
            items={items}
            isProcessing={isProcessing}
            onRemove={removeItem}
            onDownload={downloadOne}
          />
        </div>
      )}
    </div>
  );
}
