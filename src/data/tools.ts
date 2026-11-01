import type { Tool } from '../types/index.ts';

export const TOOLS: Tool[] = [
  {
    slug: "age-calculator",
    catId: "calculators",
    title: "حاسبة العمر الدقيقة",
    shortDescription:
      "احسب عمرك بدقة بالسنوات والأشهر والأيام بالتاريخين الهجري والميلادي.",
    metaDescription:
      "حاسبة عمر مجانية وسريعة تحسب عمرك بدقة بالغة بالهجري والميلادي مع موعد ميلادك القادم.",
    icon: "cake",
    published: true,
    keywords: [
      "حساب العمر",
      "احسب عمري",
      "حاسبة العمر هجري وميلادي",
      "كم عمري باليوم",
    ],
  },
  {
    slug: "image-compressor",
    catId: "images",
    title: "ضاغط الصور",
    shortDescription:
      "اضغط صور JPG وPNG وWebP مباشرة في متصفحك دون رفعها إلى أي خادم، وحمّل كل صورة على حدة أو الكل في ملف ZIP.",
    metaDescription:
      "أداة ضغط صور مجانية وسريعة تعمل داخل المتصفح بأمان وخصوصية تامة، تدعم JPG وPNG وWebP مع خيار التنزيل المجمع ZIP.",
    icon: "image-down",
    published: true,
    keywords: ["ضغط الصور", "تصغير حجم الصورة", "ضغط png", "ضغط jpg", "ضغط webp"],
  },
  {
    slug: "qr-generator",
    catId: "daily",
    title: "مولد رموز QR",
    shortDescription:
      "إنشاء رموز استجابة سريعة فورية للروابط، النصوص، وشبكات الواي فاي مجاناً.",
    metaDescription:
      "أداة مجانية لتوليد باركود QR Code عالي الدقة دون أي اتصال بخوادم خارجية.",
    icon: "qr-code",
    published: true,
    keywords: ["صانع qr code", "توليد باركود", "مولد رمز الاستجابة السريعة"],
  },
  {
    slug: "word-counter",
    catId: "text",
    title: "عداد الكلمات والحروف",
    shortDescription:
      "إحصاء دقيق لعدد الكلمات، الحروف، الفقرات وزمن القراءة للنصوص العربية.",
    metaDescription:
      "أداة مجانية لعد الكلمات والحروف والأسطر في النصوص العربية مع خيارات تنظيف وتجريد التشكيل.",
    icon: "cake",
    published: true,
    keywords: [
      "عداد الكلمات",
      "احصاء النصوص",
      "حساب عدد الحروف",
      "عداد المقالات",
    ],
  },
  {
    slug: "percentage-calculator",
    catId: "calculators",
    title: "حاسبة النسبة المئوية",
    shortDescription:
      "احسب الخصومات، الضرائب، وزيادة أو نقصان النسب بسهولة وبشكل فوري.",
    metaDescription:
      "حاسبة سريعة لحساب النسب المئوية، الخصم، وضريبة القيمة المضافة مباشرة.",
    icon: "cake",
    published: true,
    keywords: ["حساب النسبة المئوية", "حاسبة الخصم", "حساب الضريبة"],
  },
  {
    slug: "date-difference",
    catId: "calculators",
    title: "حساب الفرق بين تاريخين",
    shortDescription:
      "معرفة عدد الأيام، الأسابيع، والشهور الفاصلة بين أي تاريخين بدقة.",
    metaDescription:
      "أداة لحساب الفرق الزمني بين تاريخين بالسنوات والأشهر والأيام والأسابيع.",
    icon: "cake",
    published: true,
    keywords: ["فرق التاريخين", "كم باقي يوم", "حساب المدة بين تاريخين"],
  },
  {
    slug: "text-cleaner",
    catId: "text",
    title: "منظف ومنسق النصوص",
    shortDescription:
      "حذف التشكيل، توحيد الهمزات والياءات، وإزالة المسافات الزائدة من النص.",
    metaDescription:
      "أداة لتنظيف ومعالجة النصوص العربية وتوحيد حروف الألف والياء وإزالة الحركات الزائدة.",
    icon: "cake",
    published: true,
    keywords: ["إزالة التشكيل", "تنظيف النص", "تنسيق اللغة العربية"],
  },
  {
    slug: "unit-converter",
    catId: "converters",
    title: "محول وحدات القياس",
    shortDescription:
      "تحويل فوري وشامل لوحدات الطول، الوزن، المساحة، والحرارة.",
    metaDescription:
      "محول وحدات مجاني وسريع للتحويل بين المتر والبوصة، الكيلوجرام والباوند، وغيرها.",
    icon: "cake",
    published: true,
    keywords: ["تحويل وحدات", "محول الطول", "محول الوزن"],
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug && t.published);
}

export function getToolsByCategory(catId: string): Tool[] {
  return TOOLS.filter((t) => t.catId === catId && t.published);
}
