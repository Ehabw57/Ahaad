import { useEffect, useRef, useState } from 'preact/hooks';
import { t } from '../messages.ts';
import type { Corners, Point, Raster } from '../types.ts';
import ImageCanvas from './ImageCanvas.tsx';
import Magnifier from './Magnifier.tsx';

type Props = {
  proxy: Raster;
  corners: Corners;
  onMove: (index: number, point: Point) => void;
};

const KEYS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

const stroke = (color: string, width: number) => ({ fill: 'none', stroke: color, strokeWidth: width, strokeLinejoin: 'round' as const });

/**
 * Image with a draggable quad. The stage is forced to dir="ltr" and uses physical
 * coordinates: image coordinates must not be mirrored by the page's RTL direction.
 */
export default function CropEditor({ proxy, corners, onMove }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const baseCanvas = useRef<HTMLCanvasElement>(null);
  const dragging = useRef<number | null>(null);
  const grab = useRef({ dx: 0, dy: 0 });
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [active, setActive] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const scale = Math.min(width / proxy.width, height / proxy.height);
      setBox({ w: Math.max(1, Math.floor(proxy.width * scale)), h: Math.max(1, Math.floor(proxy.height * scale)) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [proxy]);

  const rel = (e: PointerEvent): Point => {
    const r = stage.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  };

  const onDown = (i: number) => (e: PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    const p = rel(e);
    grab.current = { dx: corners[i].x - p.x, dy: corners[i].y - p.y }; // keep the handle under the grab point
    dragging.current = i;
    setActive(i);
  };

  const onPointerMove = (i: number) => (e: PointerEvent) => {
    if (dragging.current !== i) return;
    const p = rel(e);
    onMove(i, { x: p.x + grab.current.dx, y: p.y + grab.current.dy });
  };

  const onUp = () => {
    dragging.current = null;
    setActive(null);
  };

  const onKey = (i: number) => (e: KeyboardEvent) => {
    const dir = KEYS[e.key];
    if (!dir) return;
    e.preventDefault();
    const step = e.shiftKey ? 0.05 : 0.01;
    onMove(i, { x: corners[i].x + dir[0] * step, y: corners[i].y + dir[1] * step });
  };

  const pts = corners.map((c) => ({ x: c.x * box.w, y: c.y * box.h }));
  const polygon = pts.map((p) => `${p.x},${p.y}`).join(' ');
  const mask = `M0 0H${box.w}V${box.h}H0Z M${pts.map((p) => `${p.x} ${p.y}`).join(' L')} Z`;

  return (
    <div ref={wrap} dir="ltr" class="flex h-full w-full items-center justify-center">
      <div ref={stage} class="relative touch-none select-none" style={{ width: `${box.w}px`, height: `${box.h}px` }}>
        <ImageCanvas raster={proxy} canvasRef={baseCanvas} label="" class="absolute inset-0 h-full w-full" />
        {box.w > 0 && (
          <svg class="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${box.w} ${box.h}`}>
            <path d={mask} fillRule="evenodd" style={{ fill: 'var(--text-primary)', fillOpacity: 0.45 }} />
            <polygon points={polygon} style={stroke('var(--surface)', 3)} />
            <polygon points={polygon} style={stroke('var(--accent)', 1.5)} />
            {pts.map((p, i) => (
              <g
                key={i}
                tabIndex={0}
                role="slider"
                aria-label={t.corner[i]}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(corners[i].x * 100)}
                aria-valuetext={`${Math.round(corners[i].x * 100)}%، ${Math.round(corners[i].y * 100)}%`}
                class="cursor-grab outline-none"
                onPointerDown={onDown(i)}
                onPointerMove={onPointerMove(i)}
                onPointerUp={onUp}
                onPointerCancel={onUp}
                onKeyDown={onKey(i)}
                onFocus={() => setFocused(i)}
                onBlur={() => setFocused(null)}
              >
                <circle cx={p.x} cy={p.y} r={22} fill="transparent" />
                {focused === i && <circle cx={p.x} cy={p.y} r={15} style={stroke('var(--accent)', 2)} />}
                <circle cx={p.x} cy={p.y} r={9} style={{ fill: 'var(--surface)', stroke: 'var(--accent)', strokeWidth: 2 }} />
              </g>
            ))}
          </svg>
        )}
        {active !== null && box.w > 0 && (
          <Magnifier source={baseCanvas} x={corners[active].x} y={corners[active].y} boxW={box.w} boxH={box.h} />
        )}
      </div>
    </div>
  );
}
