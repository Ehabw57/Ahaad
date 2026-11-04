import type { Ref } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { toImageData } from '../engine/imageData.ts';
import type { Raster } from '../types.ts';

type Props = {
  raster: Raster | null;
  label: string;
  class?: string;
  /** Pass a ref to read the drawn pixels elsewhere (the magnifier does). */
  canvasRef?: Ref<HTMLCanvasElement>;
};

/** Draws a raster into a canvas. Used for the preview, thumbnails, filter tiles and the crop base. */
export default function ImageCanvas({ raster, label, class: className, canvasRef }: Props) {
  const own = useRef<HTMLCanvasElement>(null);
  const ref = (canvasRef ?? own) as { current: HTMLCanvasElement | null };

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !raster) return;
    canvas.width = raster.width;
    canvas.height = raster.height;
    canvas.getContext('2d')?.putImageData(toImageData(raster), 0, 0);
  }, [raster]);

  return <canvas ref={ref} class={className} role="img" aria-label={label} />;
}
