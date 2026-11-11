import type { Tool} from "../types/index.ts";



/**
 * Matches tools against available guide IDs.
 * Returns tools with guide, tools without guide, and orphan guide IDs (guide IDs not matching any published tool).
 */
export function matchGuides(
  tools: Tool[],
  guideIds: string[] | Set<string>
): {
  withGuide: Tool[];
  withoutGuide: Tool[];
  orphanGuideIds: string[];
} {
  const guideIdSet = guideIds instanceof Set ? guideIds : new Set(guideIds);
  const publishedTools = tools.filter((t) => t.published);
  const toolSlugSet = new Set(publishedTools.map((t) => t.slug));

  const withGuide: Tool[] = [];
  const withoutGuide: Tool[] = [];

  for (const tool of publishedTools) {
    if (guideIdSet.has(tool.slug)) {
      withGuide.push(tool);
    } else {
      withoutGuide.push(tool);
    }
  }

  const orphanGuideIds: string[] = [];
  for (const id of guideIdSet) {
    if (!toolSlugSet.has(id)) {
      orphanGuideIds.push(id);
    }
  }

  return {
    withGuide,
    withoutGuide,
    orphanGuideIds,
  };
}

/**
 * Finds other tools in the same category that have a guide, excluding the current tool slug.
 */
export function relatedGuides(
  slug: string,
  tools: Tool[],
  guideIds: string[] | Set<string>,
  max = 3
): Tool[] {
  const guideIdSet = guideIds instanceof Set ? guideIds : new Set(guideIds);
  const currentTool = tools.find((t) => t.slug === slug);
  if (!currentTool) return [];

  return tools
    .filter(
      (t) =>
        t.published &&
        t.slug !== slug &&
        t.catId === currentTool.catId &&
        guideIdSet.has(t.slug)
    )
    .slice(0, max);
}

const arEgFormatter = new Intl.NumberFormat("ar-EG");

/**
 * Formats a number with Arabic-Indic digits.
 */
export function formatCount(n: number): string {
  return arEgFormatter.format(n);
}
