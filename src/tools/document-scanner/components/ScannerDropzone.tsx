import { Camera, Images, ShieldCheck, Upload } from 'lucide-preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { t } from '../messages.ts';

type Props = { onFiles: (files: File[]) => void };

/** Empty state. Touch devices get explicit camera and gallery buttons. */
export default function ScannerDropzone({ onFiles }: Props) {
  const gallery = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [touch, setTouch] = useState(false);

  // Read after mount so server HTML and the first client render match.
  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)');
    setTouch(query.matches);
    const update = (e: MediaQueryListEvent) => setTouch(e.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const pick = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    onFiles(Array.from(input.files ?? []));
    input.value = '';
  };

  const primary = 'flex h-12 w-full items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-medium text-accent-foreground hover:bg-accent-hover sm:w-auto';
  const secondary = 'flex h-12 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-6 text-sm font-medium text-text-primary hover:border-border-hover';

  return (
    <div
      onDragOver={(e: DragEvent) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e: DragEvent) => {
        e.preventDefault();
        setOver(false);
        onFiles(Array.from(e.dataTransfer?.files ?? []));
      }}
      class={`mx-auto flex w-full max-w-2xl flex-col items-center gap-6 rounded-md border border-dashed p-8 text-center sm:p-12 ${
        over ? 'border-accent bg-accent-container' : 'border-border bg-surface'
      }`}
    >
      <Upload size={36} class="text-text-secondary" aria-hidden="true" />
      <h2 class="text-lg font-semibold text-text-primary">{t.dropTitle}</h2>

      <input ref={gallery} type="file" accept="image/*" multiple class="sr-only" tabIndex={-1} onChange={pick} />
      <input ref={camera} type="file" accept="image/*" capture="environment" class="sr-only" tabIndex={-1} onChange={pick} />

      {touch ? (
        <div class="flex w-full flex-col gap-3">
          <button type="button" class={primary} onClick={() => camera.current?.click()}>
            <Camera size={20} aria-hidden="true" />
            {t.camera}
          </button>
          <button type="button" class={secondary} onClick={() => gallery.current?.click()}>
            <Images size={20} aria-hidden="true" />
            {t.gallery}
          </button>
        </div>
      ) : (
        <button type="button" class={primary} onClick={() => gallery.current?.click()}>
          <Images size={20} aria-hidden="true" />
          {t.dropButton}
        </button>
      )}

      <p class="flex items-center gap-2 text-sm text-text-secondary">
        <ShieldCheck size={18} aria-hidden="true" />
        {t.privacy}
      </p>
    </div>
  );
}
