import type { Category } from '../types/index.ts';

export const CATEGORIES: Record<string, Category> = {
  calculators: {
    catId: 'calculators',
    name: 'الحاسبات',
    description: 'حسابات دقيقة للعمر، النسب المئوية، والتواريخ.',
    icon: 'calculator',
  },
  text: {
    catId: 'text',
    name: 'أدوات النصوص',
    description: 'معالجة النصوص، إحصاء الكلمات، وتنسيق المحتوى العربي.',
    icon: 'file-text',
  },
  images: {
    catId: 'images',
    name: 'الصور والملفات',
    description: 'ضغط وتحويل الصور محلياً داخل المتصفح بأمان تام.',
    icon: 'image',
  },
  converters: {
    catId: 'converters',
    name: 'محولات القياس',
    description: 'تحويل وحدات القياس، الأوزان، والأطوال بدقة متناهية.',
    icon: 'arrow-left-right',
  },
  daily: {
    catId: 'daily',
    name: 'أدوات يومية',
    description: 'أدوات رقمية مساعدة لتسهيل مهامك اليومية السريعة.',
    icon: 'sparkles',
  },
};

export const CATEGORIES_LIST: Category[] = Object.values(CATEGORIES);
