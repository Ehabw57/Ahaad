import { useState, useMemo } from "preact/hooks";
import SearchFilter from "../SearchFilter.tsx";
import CategorySection from "./CategorySection.tsx";
import { TOOLS as tools } from "../../data/tools.ts";
import { CATEGORIES as categories } from "../../data/categories.ts";
import { groupByCategory } from "../../utils/toolGroups.ts";
import EmptyTools from "../ui/EmptyTools.tsx";
import {
  filterTools,
  formatResultAnnouncement,
} from "../../utils/toolSearch.ts";

export default function ToolsDirectory() {
  const [query, setQuery] = useState("");

  const isSearchActive = query.trim().length > 0;

  const filteredTools = useMemo(() => {
    if (!isSearchActive) return tools;
    return filterTools(tools, query);
  }, [tools, query, isSearchActive]);

  const groupedCategories = useMemo(() => {
    return groupByCategory(filteredTools, categories);
  }, [filteredTools, categories]);

  const liveAnnouncement = isSearchActive
    ? formatResultAnnouncement(filteredTools.length)
    : "";

  return (
    <div class="flex flex-col gap-8">
      {/* Search Input Container — min-height avoids layout shift when mounted */}
      <div class="h-16  flex items-center">
        <SearchFilter query={query} setQuery={setQuery} />
      </div>

      {/* Screen reader live region for search results */}
      <p aria-live="polite" class="sr-only">
        {liveAnnouncement}
      </p>

      {/* Grouped category sections or empty state */}
      {isSearchActive && filteredTools.length === 0 ? (
        <EmptyTools setQuery={setQuery} />
      ) : (
        <div class="flex flex-col gap-10">
          {groupedCategories.map(({ category, tools: catTools }) => (
            <CategorySection
              key={category.catId}
              category={category}
              tools={catTools}
              isSearchActive={isSearchActive}
            />
          ))}
        </div>
      )}
    </div>
  );
}
