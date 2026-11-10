import type { RefObject } from "preact";
import { sliceColor, slicePath } from "../../utils/randomSpinner";

const RADIUS = 190;
const BORDER = 3;

// ألوان الشرائح من متغيرات التصميم (تعمل في الوضعين الفاتح والداكن)
const COLORS = {
  a: { slice: "fill-accent", text: "fill-accent-foreground" },
  b: { slice: "fill-canvas", text: "fill-text-primary" },
  c: { slice: "fill-text-secondary", text: "fill-accent-foreground" }, // الشريحة الأخيرة عند العدد الفردي
} as const;

const shorten = (name: string) =>
  name.length > 12 ? `${name.slice(0, 11)}…` : name;

interface Props {
  names: string[];
  wheelRef: RefObject<SVGGElement> | null;
}

/** رسم فقط: لا حالة ولا منطق. الدوران يُطبَّق من الخارج على <g ref> */
export default function Wheel({ names, wheelRef }: Props) {
  const count = names.length;
  const step = 360 / count;
  const fontSize = count > 15 ? "text-[11px]" : "text-sm";

  return (
    <svg
      viewBox="-210 -210 420 420"
      role="img"
      aria-label={`عجلة الأسماء، عدد الأسماء: ${count}`}
      class="mx-auto w-full max-w-105"
    >
      {count === 0 && (
        <>
          <circle r={RADIUS} class="fill-surface-subtle stroke-border " />
          <text
            text-anchor="middle"
            dominant-baseline="central"
            class="fill-text-secondary text-sm"
          >
            أضف اسماً واحداً على الأقل
          </text>
        </>
      )}

      {/* هذا العنصر يدور؛ يبقى موجوداً دائماً حتى لا تضيع الزاوية */}
      <g ref={wheelRef} class="shadow-2xl">
        {names.map((name, i) => {
          const color = COLORS[sliceColor(i, count)];
          const middle = (i + 0.5) * step;
          return (
            <g key={name}>
              {count === 1 ? (
                <circle r={RADIUS} class={color.slice} />
              ) : (
                <path
                  d={slicePath(i, count, RADIUS)}
                  class={`${color.slice} `}
                />
              )}
              <text
                transform={`rotate(${middle - 90}) translate(${RADIUS * 0.62} 0)`}
                text-anchor="middle"
                dominant-baseline="central"
                class={`${color.text} ${fontSize} font-medium`}
              >
                {shorten(name)}
              </text>
            </g>
          );
        })}
      </g>

      {/* إطار العجلة: ثابت (لا يدور) ويقع بالكامل خارج الشرائح */}
      {count > 0 && (
        <circle
          r={RADIUS + BORDER / 2}
          fill="none"
          stroke-width={BORDER}
          class="stroke-border shadow-2xl"
        />
      )}

      {count > 0 && <circle r="18" class="fill-surface stroke-border" />}

      {/* المؤشر الثابت أعلى العجلة */}
      <polygon points="-12,-208 12,-208 0,-178" class="fill-text-primary" />
    </svg>
  );
}
