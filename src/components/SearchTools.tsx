import { useMemo, useState } from "preact/hooks";
import { ArrowLeft } from "lucide-preact";
import { TOOLS } from "../data/tools";

import SearchFilter from "./SearchFilter";
import CategoryPills from "./ui/CategoryPills";
import ToolCard from "./ToolCard";

import { matchTool } from "../utils/toolSearch";
import EmptyTools from "./ui/EmptyTools";

export default function SearchTools() {
  const [query, setQuery] = useState("");
  const [chosenCat, setChosenCat] = useState("all");

  // Filter tools based on search query and selected category
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory = chosenCat === "all" || tool.catId === chosenCat;
      const matchesQuery = matchTool(tool, query);

      return matchesCategory && matchesQuery;
    });
  }, [query, chosenCat]);

  const totalFound = filteredTools.length;

  return (
    <div class="flex flex-col gap-5">
      {/* Search */}
      <SearchFilter query={query} setQuery={setQuery} />

      {/* Categories */}
      <CategoryPills
        totalFound={totalFound}
        chosen={chosenCat}
        setChosen={setChosenCat}
      />

      {/* Tools Grid */}
      <section>
        {filteredTools.length > 0 ? (
          <>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 px-4">
              {filteredTools.slice(0, 6).map((tool, index) => (
                <ToolCard
                  key={tool.slug}
                  {...tool}
                  icon={tool.icon}
                  index={index}
                />
              ))}
            </div>
            {filteredTools.length > 6 && (
              <a
                href="/tools"
                class="flex items-center mx-auto my-6 w-50 gap-2 px-6 py-3 bg-surface text-text-primary font-semibold text-sm border border-border hover:border-border-hover transition-colors"
              >
                <span>عرض جميع الأدوات</span> <ArrowLeft size={19} />
              </a>
            )}
          </>
        ) : (
          <EmptyTools setQuery={setQuery} />
        )}
      </section>
    </div>
  );
}
