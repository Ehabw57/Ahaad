import { useState } from "preact/hooks";
import ToolCard from "../ToolCard";
import type { Tool, Category } from "../../types/index.ts";
import { formatCount } from "../../utils/toolGuides.ts";
import { splitCollapsed } from "../../utils/toolGroups.ts";

interface CategorySectionProps {
  category: Category;
  tools: Tool[];
  isSearchActive: boolean;
}

export default function CategorySection({
  category,
  tools,
  isSearchActive,
}: CategorySectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const { visible, extra } = splitCollapsed(tools, 6);
  const hasExtra = extra.length > 0;
  const extraId = `cat-${category.catId}-extra`;

  return (
    <section
      aria-labelledby={`cat-${category.catId}`}
      class="flex flex-col gap-6 py-4"
    >
      <header class="flex items-center justify-between pb-2 border-b border-border">
        <h2
          id={`cat-${category.catId}`}
          class="scroll-mt-20 text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2.5"
        >
          <span>{category.name}</span>
          <span class="text-sm font-normal text-text-secondary">
            ({formatCount(tools.length)})
          </span>
        </h2>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {visible.map((tool, idx) => (
          <ToolCard
            key={tool.slug}
            slug={tool.slug}
            title={tool.title}
            shortDescription={tool.shortDescription}
            icon={tool.icon}
            catId={tool.catId}
            index={idx}
            headingLevel="h3"
          />
        ))}

        {hasExtra && (
          <div id={extraId} class="contents">
            {extra.map((tool, idx) => (
              <ToolCard
                key={tool.slug}
                slug={tool.slug}
                title={tool.title}
                shortDescription={tool.shortDescription}
                icon={tool.icon}
                catId={tool.catId}
                index={visible.length + idx}
                className={`${isCollapsed && !isSearchActive ? "hidden" : ""}`}
                headingLevel="h3"
              />
            ))}
          </div>
        )}
      </div>

      {!isSearchActive && hasExtra && (
        <div class="flex justify-center pt-2">
          <button
            type="button"
            aria-expanded={!isCollapsed}
            aria-controls={extraId}
            onClick={() => setIsCollapsed(!isCollapsed)}
            class="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-text-primary text-sm font-semibold transition-colors duration-200 cursor-pointer min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {isCollapsed
              ? `عرض كل الأدوات (${formatCount(tools.length)})`
              : "إخفاء الأدوات الإضافية"}
          </button>
        </div>
      )}
    </section>
  );
}
