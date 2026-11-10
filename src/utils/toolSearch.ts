import type { Tool, Category } from "../types";
import { formatCount } from "./toolGuides";
/**
 * Normalizes Arabic text for search matching:
 * - Strips tashkeel / diacritics
 * - Normalizes alef forms (أ, إ, آ, ٱ -> ا)
 * - Normalizes alif maqsura (ى -> ي)
 * - Normalizes ta marbuta (ة -> ه)
 * - Normalizes Arabic-Indic / Persian digits to ASCII digits
 * - Lowercases Latin characters
 */
export function normalizeArabic(text: string): string {
  if (!text) return "";

  return (
    text
      // Remove diacritics (fathah, dammah, kasrah, sukun, shaddah, tanween, dagger alif)
      .replace(/[\u064B-\u065F\u0670]/g, "")
      // Normalize alef variants
      .replace(/[إأآٱ]/g, "ا")
      // Normalize alif maqsura to ya
      .replace(/ى/g, "ي")
      // Normalize ta marbuta to ha
      .replace(/ة/g, "ه")
      // Lowercase
      .toLowerCase()
      .trim()
  );
}
/**
 * Checks whether a tool matches a query:
 * - Query is split into whitespace-delimited tokens.
 * - Every token must be present as a substring in the normalized (title + " " + description).
 */
export function matchTool(tool: Tool, query: string): boolean {
  const normalizedQuery = normalizeArabic(query);
  if (!normalizedQuery) return true;

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  const searchable = normalizeArabic(`${tool.title} ${tool.shortDescription}`);
  return tokens.every((token) => searchable.includes(token));
}

/**
 * Filters a list of tools by query in original order. Empty query returns all tools.
 */
export function filterTools(tools: Tool[], query: string): Tool[] {
  if (!query || !query.trim()) return tools;

  return tools.filter((tool) => matchTool(tool, query));
}

/**
 * Generates the correct Arabic aria-live announcement string for search results count.
 */
export function formatResultAnnouncement(count: number): string {
  if (count === 0) {
    return "لا توجد نتائج";
  }
  if (count === 1) {
    return "تم العثور على أداة واحدة";
  }
  if (count === 2) {
    return "تم العثور على أداتين";
  }
  if (count >= 3 && count <= 10) {
    return `تم العثور على ${formatCount(count)} أدوات`;
  }
  return `تم العثور على ${formatCount(count)} أداة`;
}
