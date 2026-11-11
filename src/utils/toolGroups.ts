import type { Tool, Category } from "../types";
interface Result {
  category: Category;
  tools: Tool[];
}

/**
 * Groups tools by category in categories order, skipping empty categories.
 */
export function groupByCategory(
  tools: Tool[],
  categories: Category[],
): Result[] {
  let result: Result[] = [];

  for (const category of categories) {
    const categoryTools = tools.filter((tool) => tool.catId === category.catId);
    // skip categorys with zero tools
    if (categoryTools.length > 0) {
      result.push({
        category,
        tools: categoryTools,
      });
    }
  }

  return result;
}

/**
 * Splits tools into visible (up to limit) and extra.
 */
export function splitCollapsed(
  tools: Tool[],
  limit: number,
): { visible: Tool[]; extra: Tool[] } {
  const visible = tools.slice(0, limit);
  const extra = tools.slice(limit);

  return { visible, extra };
}
