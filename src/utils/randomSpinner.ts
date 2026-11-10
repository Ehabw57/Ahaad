export const MIN_NAMES = 1;
export const MAX_NAMES = 16;
export const MAX_NAME_LENGTH = 30;

/** رقم عشوائي بين 0 و1 (أقوى من Math.random) */
export function randomFloat(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
}

/**
 * يحوّل نصاً متعدد الأسطر إلى قائمة أسماء مضافة إلى الحالية:
 * كل سطر اسم، تُقصّ المسافات، ويُتخطى الفارغ والمكرر، ولا يتجاوز MAX_NAMES.
 */
export function parseNames(current: string[], rawText: string): string[] {
  const result = [...current];
  const seen = new Set(result.map((name) => name.toLowerCase()));

  for (const line of rawText.split(/\r?\n/)) {
    if (result.length >= MAX_NAMES) break;
    const name = line.replace(/\s+/g, " ").slice(0, MAX_NAME_LENGTH).trim();
    const key = name.toLowerCase();
    if (!name || seen.has(key)) continue;
    seen.add(key);
    result.push(name);
  }
  return result;
}

/**
 * رقم الشريحة الواقفة تحت المؤشر (أعلى العجلة).
 * الشرائح مرقّمة من 0 مع عقارب الساعة بدءاً من أعلى الدائرة،
 * و angle هو دوران العجلة الحالي مع عقارب الساعة بالدرجات.
 */
export function sliceIndexAtAngle(angle: number, count: number): number {
  const local = ((-angle % 360) + 360) % 360; // موضع المؤشر داخل العجلة
  return Math.min(Math.floor(local / (360 / count)), count - 1);
}

/** لون الشريحة: a و b بالتناوب، و c للأخيرة إذا كان العدد فردياً (3 فأكثر) */
export type SliceColor = "a" | "b" | "c";

export function sliceColor(index: number, count: number): SliceColor {
  if (count > 1 && count % 2 === 1 && index === count - 1) return "c";
  return index % 2 === 0 ? "a" : "b";
}

function pointOnCircle(degrees: number, radius: number): string {
  const rad = (degrees * Math.PI) / 180;
  return `${(radius * Math.sin(rad)).toFixed(2)} ${(-radius * Math.cos(rad)).toFixed(2)}`;
}

/** مسار SVG لشريحة واحدة (لا يصلح لـ count = 1، فهذه الحالة دائرة كاملة) */
export function slicePath(
  index: number,
  count: number,
  radius: number,
): string {
  const step = 360 / count;
  const start = index * step;
  const end = start + step;
  const largeArc = step > 180 ? 1 : 0;
  return `M 0 0 L ${pointOnCircle(start, radius)} A ${radius} ${radius} 0 ${largeArc} 1 ${pointOnCircle(end, radius)} Z`;
}
