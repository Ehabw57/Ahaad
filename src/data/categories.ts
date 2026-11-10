import type { Category } from "../types/index.ts";

export const CATEGORIES_LIST: Category[] = [
  {
    catId: "calculators",
    name: "الحاسبات",
    description: "حسابات دقيقة للعمر، النسب المئوية، والتواريخ.",
    icon: "calculator",
  },
  {
    catId: "text",
    name: "أدوات النصوص",
    description: "معالجة النصوص، إحصاء الكلمات، وتنسيق المحتوى العربي.",
    icon: "file-text",
  },
  {
    catId: "images",
    name: "الصور والملفات",
    description: "ضغط وتحويل الصور محلياً داخل المتصفح بأمان تام.",
    icon: "image",
  },
  {
    catId: "converters",
    name: "محولات القياس",
    description: "تحويل وحدات القياس، الأوزان، والأطوال بدقة متناهية.",
    icon: "arrow-left-right",
  },
  {
    catId: "daily",
    name: "أدوات يومية",
    description: "أدوات رقمية مساعدة لتسهيل مهامك اليومية السريعة.",
    icon: "sparkles",
  },
];

export const CATEGORIES: Category[] & Record<string, Category> = Object.assign(
  [...CATEGORIES_LIST],
  Object.fromEntries(CATEGORIES_LIST.map((c) => [c.catId, c]))
);

