import { useEffect, useRef, useState } from 'preact/hooks';
import { randomFloat, sliceIndexAtAngle } from '../../../utils/randomSpinner';

// ── ثوابت الحركة (عدّلها من هنا) ──────────────
const BOOST = 500;      // الزيادة في السرعة لكل ضغطة (درجة/ثانية)
const MAX_SPEED = 2500; // أقصى سرعة (درجة/ثانية)
const FRICTION = 0.6;   // قوة الاحتكاك: أكبر = تقف أسرع
const STOP_BELOW = 18;   // تحت هذه السرعة نعتبر العجلة واقفة

/**
 * فيزياء العجلة: كل ضغطة تزيد السرعة حتى حد أقصى، ثم يبطئها الاحتكاك حتى الوقوف.
 * الزاوية والسرعة في refs (لا تُعيد رسم Preact)، ونكتب الزاوية مباشرة على عنصر SVG.
 */
export function useSpinner(names: string[]) {
  const wheelRef = useRef<SVGGElement>(null);
  const namesRef = useRef(names);
  const angle = useRef(0);
  const speed = useRef(0);
  const lastTime = useRef(0);
  const frame = useRef(0); // 0 = الحلقة متوقفة

  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  namesRef.current = names;

  const draw = () => {
    wheelRef.current?.setAttribute('transform', `rotate(${angle.current})`);
  };

  const finish = () => {
    const list = namesRef.current;
    setSpinning(false);
    setWinner(list[sliceIndexAtAngle(angle.current, list.length)] ?? null);
  };

  const tick = (now: number) => {
    // نحدّ الفاصل الزمني حتى لا تقفز العجلة بعد عودة التبويب من الخلفية
    const dt = Math.min((now - lastTime.current) / 1000, 0.05);
    lastTime.current = now;

    speed.current *= Math.exp(-FRICTION * dt);
    if (speed.current < STOP_BELOW) {
      speed.current = 0;
      frame.current = 0;
      finish();
      return;
    }

    angle.current = (angle.current + speed.current * dt) % 360;
    draw();
    frame.current = requestAnimationFrame(tick);
  };

  const spin = () => {
    if (namesRef.current.length < 1) return;

    // مع تفضيل تقليل الحركة: لا دوران، نتيجة عشوائية فورية
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      angle.current = randomFloat() * 360;
      draw();
      finish();
      return;
    }

    // تباين عشوائي صغير لكل ضغطة حتى لا يمكن التنبؤ بالفائز من موضع العجلة
    const boost = BOOST * (0.8 + 0.4 * randomFloat());
    speed.current = Math.min(speed.current + boost, MAX_SPEED);

    setWinner(null);
    setSpinning(true);
    if (!frame.current) {
      lastTime.current = performance.now();
      frame.current = requestAnimationFrame(tick);
    }
  };

  // تغيّر القائمة يمسح النتيجة السابقة
  useEffect(() => setWinner(null), [names]);

  // تنظيف الحلقة عند إزالة المكوّن
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return { wheelRef, spin, spinning, winner };
}