import { useEffect, useState } from 'preact/hooks';
import { parseNames } from '../../../utils/randomSpinner';

const STORAGE_KEY = 'ahaad:random-spinner:names';

/** حالة الأسماء + حفظها واستعادتها من LocalStorage */
export function useNames() {
  const [names, setNames] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // استعادة بعد التحميل فقط (الصفحة ساكنة ولا يوجد localStorage وقت البناء)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      if (Array.isArray(saved)) {
        const strings = saved.filter((item) => typeof item === 'string');
        setNames(parseNames([], strings.join('\n')));
      }
    } catch {
      // بيانات تالفة أو التخزين معطّل: نبدأ بقائمة فارغة
    }
    setLoaded(true);
  }, []);

  // حفظ عند كل تغيير (بعد الاستعادة حتى لا نمسح المحفوظ بقائمة فارغة)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
    } catch {
      // تجاهل: الأداة تعمل بدون حفظ
    }
  }, [names, loaded]);

  return {
    names,
    add: (text: string) => setNames((current) => parseNames(current, text)),
    remove: (name: string) => setNames((current) => current.filter((n) => n !== name)),
    clear: () => setNames([]),
  };
}