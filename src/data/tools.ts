import { Cake, ImageDown, Scan, QrCode, Braces, CircleDollarSign, LoaderPinwheel } from "lucide-preact";
import type { Tool } from "../types/index.ts";

export const TOOLS: Tool[] = [
  {
    slug: "age-calculator",
    catId: "calculators",
    title: "حاسبة العمر",
    shortDescription: "احسب العمر بالسنوات والأشهر والأيام بالتاريخ الميلادي.",
    metaDescription:
      "حاسبة عمر مجانية وسريعة تحسب عمرك الميلادي مع موعد ميلادك القادم.",
    iconName: "cake",
    icon: Cake,
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
      "اضغط صور JPG وPNG وWebP مباشرة وحمّل كل صورة على حدة أو الكل في ملف ZIP.",
    metaDescription:
      "أداة ضغط صور مجانية وسريعة تعمل داخل المتصفح بأمان وخصوصية تامة، تدعم JPG وPNG وWebP مع خيار التنزيل المجمع ZIP.",
    icon: ImageDown,
    iconName: "image-down",
    published: true,
    keywords: [
      "ضغط الصور",
      "تصغير حجم الصورة",
      "ضغط png",
      "ضغط jpg",
      "ضغط webp",
    ],
  },
  {
    slug: "document-scanner",
    catId: "images",
    title: "ماسح المستندات",
    shortDescription: "مسح المستندات وتحديد حوافها وتصحيح انحرافها وفلترتها.",
    metaDescription:
      "أداة ماسح ضوئي مجانية تعمل داخل المتصفح لاقتصاص وتعديل وفلترة المستندات والأوراق بأمان وسرية تامة دون رفعها لأي خادم.",
    icon: Scan,
    iconName: "scan",
    published: true,
    keywords: [
      "ماسح ضوئي",
      "سكانر مستندات",
      "مسح الأوراق",
      "اقتصاص المستندات",
      "تصحيح انحراف الصور",
    ],
  },
  {
    slug: "qr-generator",
    catId: "daily",
    title: "مولد رموز QR",
    shortDescription: "إنشاء رموز استجابة سريعة فورية للروابط الانترنت",
    metaDescription:
      "أداة مجانية لتوليد باركود QR Code عالي الدقة دون أي اتصال بخوادم خارجية.",
    icon: QrCode,
    iconName: "qr-code",
    published: true,
    keywords: ["صانع qr code", "توليد باركود", "مولد رمز الاستجابة السريعة"],
  },
  {
    slug: "coin-flip",
    catId: "daily",
    title: "رمي العملة",
    shortDescription:
      "ارمِ عملة افتراضية واحصل على ملك أو كتابة بنتيجة عشوائية عادلة.",
    metaDescription:
      "ارمِ عملة افتراضية واحصل على ملك أو كتابة بنتيجة عشوائية عادلة، مباشرة من المتصفح وبدون تحميل أي شيء.",
    icon: CircleDollarSign,
    iconName: "coins",
    published: true,
    keywords: [
      "رمي العملة",
      "قرعة",
      "ملك أو كتابة",
      "coin flip",
      "flip a coin",
      "قرعة عملة",
    ],
  },
  {
    slug: "random-spinner",
    catId: "daily",
    title: "عجلة الأسماء العشوائية",
    shortDescription: "أضف أسماءك وأدِر العجلة لاختيار اسم عشوائي بعدالة.",
    metaDescription:
      "أضف أسماءك وأدِر العجلة لاختيار اسم عشوائي بعدالة، مباشرة من المتصفح.",
    icon: LoaderPinwheel,
    iconName: "disc-3",
    published: true,
    keywords: [
      "عجلة الأسماء",
      "قرعة إلكترونية",
      "عجلة الحظ",
      "اختيار عشوائي",
      "random spinner",
      "wheel spinner",
      "قرعة أسماء",
    ],
  },
  {
    slug: "json-formatter",
    catId: "text",
    title: "منسّق JSON",
    shortDescription:
      "نسّق ملفات JSON وأظهرها كنص أو شجرة قابلة للطي مع تحديد مكان الخطأ بدقة.",
    metaDescription:
      "أداة مجانية لتنسيق والتحقق من صحة JSON وعرضه كنص أو شجرة تفاعلية داخل المتصفح بأمان وخصوصية تامة.",
    icon: Braces,
    iconName: "braces",
    published: true,
    keywords: [
      "json",
      "تنسيق json",
      "منسق جيسون",
      "json formatter",
      "json beautify",
      "json viewer",
      "مصحح json",
      "فاحص json",
    ],
  },
  {
    slug: "word-counter",
    catId: "text",
    title: "عداد الكلمات والحروف",
    shortDescription:
      "إحصاء دقيق لعدد الكلمات، الحروف، الفقرات وزمن القراءة للنصوص العربية.",
    metaDescription:
      "أداة مجانية لعد الكلمات والحروف والأسطر في النصوص العربية مع خيارات تنظيف وتجريد التشكيل.",
    iconName: "cake",

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
    iconName: "cake",
    published: true,
    keywords: ["حساب النسبة المئوية", "حاسبة الخصم", "حساب الضريبة"],
  },
  {
    slug: "text-cleaner",
    catId: "text",
    title: "منظف ومنسق النصوص",
    shortDescription:
      "حذف التشكيل، توحيد الهمزات والياءات، وإزالة المسافات الزائدة من النص.",
    metaDescription:
      "أداة لتنظيف ومعالجة النصوص العربية وتوحيد حروف الألف والياء وإزالة الحركات الزائدة.",
    iconName: "cake",
    published: true,
    keywords: ["إزالة التشكيل", "تنظيف النص", "تنسيق اللغة العربية"],
  },
  {
    slug: "text-cleaner",
    catId: "text",
    title: "منظف ومنسق النصوص",
    shortDescription:
      "حذف التشكيل، توحيد الهمزات والياءات، وإزالة المسافات الزائدة من النص.",
    metaDescription:
      "أداة لتنظيف ومعالجة النصوص العربية وتوحيد حروف الألف والياء وإزالة الحركات الزائدة.",
    iconName: "cake",
    published: true,
    keywords: ["إزالة التشكيل", "تنظيف النص", "تنسيق اللغة العربية"],
  },
  {
    slug: "text-cleaner",
    catId: "text",
    title: "منظف ومنسق النصوص",
    shortDescription:
      "حذف التشكيل، توحيد الهمزات والياءات، وإزالة المسافات الزائدة من النص.",
    metaDescription:
      "أداة لتنظيف ومعالجة النصوص العربية وتوحيد حروف الألف والياء وإزالة الحركات الزائدة.",
    iconName: "cake",
    published: true,
    keywords: ["إزالة التشكيل", "تنظيف النص", "تنسيق اللغة العربية"],
  },
  {
    slug: "text-cleaner",
    catId: "text",
    title: "منظف ومنسق النصوص",
    shortDescription:
      "حذف التشكيل، توحيد الهمزات والياءات، وإزالة المسافات الزائدة من النص.",
    metaDescription:
      "أداة لتنظيف ومعالجة النصوص العربية وتوحيد حروف الألف والياء وإزالة الحركات الزائدة.",
    iconName: "cake",
    published: true,
    keywords: ["إزالة التشكيل", "تنظيف النص", "تنسيق اللغة العربية"],
  },
  {
    slug: "text-cleaner",
    catId: "text",
    title: "منظف ومنسق النصوص",
    shortDescription:
      "حذف التشكيل، توحيد الهمزات والياءات، وإزالة المسافات الزائدة من النص.",
    metaDescription:
      "أداة لتنظيف ومعالجة النصوص العربية وتوحيد حروف الألف والياء وإزالة الحركات الزائدة.",
    iconName: "cake",
    published: true,
    keywords: ["إزالة التشكيل", "تنظيف النص", "تنسيق اللغة العربية"],
  },
  {
    slug: "text-cleaner",
    catId: "text",
    title: "منظف ومنسق النصوص",
    shortDescription:
      "حذف التشكيل، توحيد الهمزات والياءات، وإزالة المسافات الزائدة من النص.",
    metaDescription:
      "أداة لتنظيف ومعالجة النصوص العربية وتوحيد حروف الألف والياء وإزالة الحركات الزائدة.",
    iconName: "cake",
    published: true,
    keywords: ["إزالة التشكيل", "تنظيف النص", "تنسيق اللغة العربية"],
  },
  {
    slug: "text-cleaner",
    catId: "text",
    title: "منظف ومنسق النصوص",
    shortDescription:
      "حذف التشكيل، توحيد الهمزات والياءات، وإزالة المسافات الزائدة من النص.",
    metaDescription:
      "أداة لتنظيف ومعالجة النصوص العربية وتوحيد حروف الألف والياء وإزالة الحركات الزائدة.",
    iconName: "cake",
    published: true,
    keywords: ["إزالة التشكيل", "تنظيف النص", "تنسيق اللغة العربية"],
  },
  {
    slug: "text-cleaner",
    catId: "text",
    title: "منظف ومنسق النصوص",
    shortDescription:
      "حذف التشكيل، توحيد الهمزات والياءات، وإزالة المسافات الزائدة من النص.",
    metaDescription:
      "أداة لتنظيف ومعالجة النصوص العربية وتوحيد حروف الألف والياء وإزالة الحركات الزائدة.",
    iconName: "cake",
    published: true,
    keywords: ["إزالة التشكيل", "تنظيف النص", "تنسيق اللغة العربية"],
  },
  {
    slug: "text-cleaner",
    catId: "text",
    title: "منظف ومنسق النصوص",
    shortDescription:
      "حذف التشكيل، توحيد الهمزات والياءات، وإزالة المسافات الزائدة من النص.",
    metaDescription:
      "أداة لتنظيف ومعالجة النصوص العربية وتوحيد حروف الألف والياء وإزالة الحركات الزائدة.",
    iconName: "cake",
    published: true,
    keywords: ["إزالة التشكيل", "تنظيف النص", "تنسيق اللغة العربية"],
  },
  {
    slug: "text-cleaner",
    catId: "text",
    title: "منظف ومنسق النصوص",
    shortDescription:
      "حذف التشكيل، توحيد الهمزات والياءات، وإزالة المسافات الزائدة من النص.",
    metaDescription:
      "أداة لتنظيف ومعالجة النصوص العربية وتوحيد حروف الألف والياء وإزالة الحركات الزائدة.",
    iconName: "cake",
    published: true,
    keywords: ["إزالة التشكيل", "تنظيف النص", "تنسيق اللغة العربية"],
  },
  {
    slug: "text-cleaner",
    catId: "text",
    title: "منظف ومنسق النصوص",
    shortDescription:
      "حذف التشكيل، توحيد الهمزات والياءات، وإزالة المسافات الزائدة من النص.",
    metaDescription:
      "أداة لتنظيف ومعالجة النصوص العربية وتوحيد حروف الألف والياء وإزالة الحركات الزائدة.",
    iconName: "cake",
    published: true,
    keywords: ["إزالة التشكيل", "تنظيف النص", "تنسيق اللغة العربية"],
  },
  {
    slug: "text-cleaner",
    catId: "text",
    title: "منظف ومنسق النصوص",
    shortDescription:
      "حذف التشكيل، توحيد الهمزات والياءات، وإزالة المسافات الزائدة من النص.",
    metaDescription:
      "أداة لتنظيف ومعالجة النصوص العربية وتوحيد حروف الألف والياء وإزالة الحركات الزائدة.",
    iconName: "cake",
    published: true,
    keywords: ["إزالة التشكيل", "تنظيف النص", "تنسيق اللغة العربية"],
  },
  {
    slug: "text-cleaner",
    catId: "text",
    title: "منظف ومنسق النصوص",
    shortDescription:
      "حذف التشكيل، توحيد الهمزات والياءات، وإزالة المسافات الزائدة من النص.",
    metaDescription:
      "أداة لتنظيف ومعالجة النصوص العربية وتوحيد حروف الألف والياء وإزالة الحركات الزائدة.",
    iconName: "cake",
    published: true,
    keywords: ["إزالة التشكيل", "تنظيف النص", "تنسيق اللغة العربية"],
  },
  {
    slug: "text-cleaner",
    catId: "text",
    title: "منظف ومنسق النصوص",
    shortDescription:
      "حذف التشكيل، توحيد الهمزات والياءات، وإزالة المسافات الزائدة من النص.",
    metaDescription:
      "أداة لتنظيف ومعالجة النصوص العربية وتوحيد حروف الألف والياء وإزالة الحركات الزائدة.",
    iconName: "cake",
    published: true,
    keywords: ["إزالة التشكيل", "تنظيف النص", "تنسيق اللغة العربية"],
  },
];

// export function getToolBySlug(slug: string): Tool | undefined {
//   return TOOLS.find((t) => t.slug === slug && t.published);
// }

// export function getToolsByCategory(catId: string): Tool[] {
//   return TOOLS.filter((t) => t.catId === catId && t.published);
// }
