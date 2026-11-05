// Shared types for Ahaad — all shared models live here per constitution.md §2
// No 'any' — all types are strict.
import type { ComponentType } from "preact";
import type { LucideProps } from "lucide-preact";


export interface Tool {
  slug: string;
  catId: string;
  title: string;
  shortDescription: string;
  metaDescription: string;
  icon?: ComponentType<LucideProps>;
  iconName: string;
  component?: ComponentType,
  published: boolean;
  keywords: string[];
}

export interface Category {
  catId: string;
  name: string;
  description: string;
  icon: string;
}

export interface SeoMetaProps {
  title: string;
  description: string;
  canonicalURL?: string;
  ogImage?: string;
}
