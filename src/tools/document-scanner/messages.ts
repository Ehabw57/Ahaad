// All user-facing strings (Arabic). Digits are Western (0-9).

export const t = {
  title: 'الماسح الضوئي',

  dropTitle: 'اسحب الصور هنا أو اضغط للاختيار',
  dropButton: 'اختيار صور',
  camera: 'التقاط صورة',
  gallery: 'اختيار من المعرض',
  privacy: 'تتم المعالجة على جهازك ولا يتم رفع أي صورة',

  pages: 'الصفحات',
  addImage: 'إضافة صورة',
  remove: 'إزالة',
  processing: 'جارٍ المعالجة…',

  rotateRight: 'تدوير يمينًا',
  rotateLeft: 'تدوير يسارًا',
  crop: 'قص',
  cropHint: 'الحواف غير دقيقة؟ اضغط قص لتعديلها',
  dismiss: 'إغلاق',

  cropInstruction: 'اسحب الزوايا الأربع لتطابق حواف المستند',
  confirm: 'موافق',
  redetect: 'إعادة المسح',
  cancel: 'إلغاء',
  corner: ['الزاوية العلوية اليسرى', 'الزاوية العلوية اليمنى', 'الزاوية السفلية اليمنى', 'الزاوية السفلية اليسرى'],

  filters: 'الفلتر',
  filterNames: { original: 'أصلي', auto: 'تلقائي', bw: 'أبيض وأسود', gray: 'رمادي' },
  applyToAll: 'تطبيق على الكل',

  downloadCurrent: 'تنزيل الصورة الحالية',
  downloadAll: 'تنزيل الكل',
  exporting: 'جارٍ التجهيز…',
  exportFailed: 'تعذّر تجهيز الملف. حاول مرة أخرى.',
} as const;

export const pageName = (n: number): string => `صفحة ${n}`;

/** "تعذّر فتح N ..." with Arabic number agreement. */
export function failedFilesMessage(n: number): string {
  if (n === 1) return 'تعذّر فتح ملف واحد';
  if (n === 2) return 'تعذّر فتح ملفين';
  if (n >= 3 && n <= 10) return `تعذّر فتح ${n} ملفات`;
  return `تعذّر فتح ${n} ملفًا`;
}

export function pageLimitMessage(max: number): string {
  return `الحد الأقصى ${max} صفحة`;
}

export const exportFileName = (index: number): string => `scan-${index + 1}.jpg`;
export const ZIP_FILE_NAME = 'scans.zip';
