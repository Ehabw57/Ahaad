import { useEffect, useRef } from 'preact/hooks';

const SIZE = 112;
const ZOOM = 3;

type Props = {
  /** Canvas that already shows the full-resolution proxy. */
  source: { current: HTMLCanvasElement | null };
  /** Handle position, normalized 0..1. */
  x: number;
  y: number;
  /** Displayed stage size in CSS pixels. */
  boxW: number;
  boxH: number;
};

/**
 * Zoomed view of the area under a dragged handle. The circle is a canvas clip,
 * not a CSS radius, so it follows the design system's radius rule.
 */
export default function Magnifier({ source, x, y, boxW, boxH }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const src = source.current;
    if (!canvas || !src) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const css = getComputedStyle(canvas);
    const surface = css.getPropertyValue('--surface').trim() || 'Canvas';
    const accent = css.getPropertyValue('--accent').trim() || 'Highlight';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = surface;
    ctx.fillRect(0, 0, SIZE, SIZE);
    // Source pixels per displayed pixel, so the zoom is relative to what the user sees.
    const region = (SIZE / ZOOM) * (src.width / boxW);
    ctx.drawImage(src, x * src.width - region / 2, y * src.height - region / 2, region, region, 0, 0, SIZE, SIZE);
    ctx.restore();

    ctx.lineWidth = 2;
    ctx.strokeStyle = accent;
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(SIZE / 2 - 10, SIZE / 2);
    ctx.lineTo(SIZE / 2 + 10, SIZE / 2);
    ctx.moveTo(SIZE / 2, SIZE / 2 - 10);
    ctx.lineTo(SIZE / 2, SIZE / 2 + 10);
    ctx.stroke();
  }, [source, x, y, boxW]);

  // Above the handle; below it when too close to the top edge. Kept inside the stage horizontally.
  const px = x * boxW;
  const py = y * boxH;
  const left = Math.min(Math.max(px - SIZE / 2, 0), Math.max(0, boxW - SIZE));
  const top = py - SIZE - 28 >= 0 ? py - SIZE - 28 : py + 28;

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      class="pointer-events-none absolute"
      style={{ left: `${left}px`, top: `${top}px`, width: `${SIZE}px`, height: `${SIZE}px` }}
    />
  );
}
