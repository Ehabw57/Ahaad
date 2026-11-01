/** @jsxImportSource preact */
import { useState, useRef } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { UploadCloud, FolderOpen } from 'lucide-preact';

export interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  compact?: boolean;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  hintText?: string;
  onFiles: (files: File[]) => void;
  children?: ComponentChildren;
}

export default function FileDropzone({
  accept = 'image/jpeg,image/png,image/webp',
  multiple = true,
  disabled = false,
  compact = false,
  title = 'اسحب الملفات وأفلتها هنا',
  subtitle = 'أو اختر الملفات من جهازك',
  buttonText = 'اختيار الملفات',
  hintText,
  onFiles,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled || !e.dataTransfer?.files) return;

    const filesArray = Array.from(e.dataTransfer.files);
    if (filesArray.length > 0) {
      onFiles(filesArray);
    }
  };

  const handleFileInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const filesArray = Array.from(target.files);
      onFiles(filesArray);
      // Reset input value so re-selecting the same file fires change
      target.value = '';
    }
  };

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      class={`w-full rounded-md text-center transition-all cursor-pointer relative group border-2 border-dashed outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-10'
      } ${
        disabled
          ? 'opacity-60 cursor-not-allowed border-border bg-surface-subtle'
          : isDragOver
            ? 'border-accent bg-accent/5'
            : 'border-border hover:border-text-secondary bg-surface hover:bg-surface-subtle'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleFileInputChange}
        class="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      <div class="flex flex-col items-center justify-center max-w-md mx-auto pointer-events-none">
        <div
          class={`rounded-full flex items-center justify-center transition-colors ${
            compact ? 'w-10 h-10 mb-2' : 'w-14 h-14 mb-3.5'
          } ${
            isDragOver
              ? 'bg-accent text-accent-foreground'
              : 'bg-surface-container text-accent group-hover:bg-accent group-hover:text-accent-foreground'
          }`}
        >
          <UploadCloud class={compact ? 'w-5 h-5' : 'w-7 h-7'} />
        </div>

        <p class={`font-bold text-text-primary ${compact ? 'text-sm' : 'text-base sm:text-lg'}`}>
          {title}
        </p>

        {subtitle && (
          <p class={`text-text-secondary ${compact ? 'text-xs mt-0.5' : 'text-xs sm:text-sm mt-1'}`}>
            {subtitle}
          </p>
        )}

        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          class={`mt-3.5 px-5 py-2 rounded-md bg-surface-container hover:bg-accent/15 text-accent font-semibold text-xs sm:text-sm transition-colors inline-flex items-center gap-1.5 shadow-xs`}
        >
          <FolderOpen class="w-4 h-4" />
          <span>{buttonText}</span>
        </button>

        {hintText && (
          <p class="text-[11px] sm:text-xs text-text-secondary mt-3">
            {hintText}
          </p>
        )}
      </div>
    </div>
  );
}
