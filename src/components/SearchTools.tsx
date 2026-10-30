import { useMemo, useState } from "preact/hooks";
import { X, SearchX } from "lucide-preact";

import SearchFilter from "./SearchFilter";
import CategoryPills from "./ui/CategoryPills";
import ToolCard from "./ToolCard";

import { TOOLS } from "../data/tools";
("all");

export default function SearchTools() {
  const [query, setQuery] = useState("");
  const [chosenCat, setChosenCat] = useState("all");

  // Filter tools based on search query and selected category
  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return TOOLS.filter((tool) => {
      const matchesCategory = chosenCat === "all" || tool.catId === chosenCat;

      const searchableText =
        `${tool.title} ${tool.shortDescription}`.toLowerCase();

      const matchesQuery =
        normalizedQuery === "" || searchableText.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [query, chosenCat]);

  const totalFound = filteredTools.length;

  return (
    <>
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
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 px-4">
            {filteredTools.map((tool, index) => (
              <ToolCard key={tool.slug} {...tool} icon={X} index={index} />
            ))}
          </div>
        ) : (
          <div
            class="flex flex-col items-center justify-center text-center py-8 px-4"
            role="status"
            aria-live="polite"
          >
            <div class="w-12 h-12 flex items-center justify-center rounded-2xl bg-surface text-text-secondary border border-border mb-4">
              <SearchX size={40} />
            </div>
            <h3 class="text-base font-semibold text-text-primary mb-1">
              لم نجد أي أداة مطابقة
            </h3>
            <p class="text-xs sm:text-sm text-text-secondary max-w-sm mb-5 leading-normal">
              جرّب البحث بكلمات أخرى أو تصفح كافة التصنيفات المتاحة.
            </p>
            <button
              type="button"
              class="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-canvas hover:bg-surface text-text-primary border border-border transition-colors cursor-pointer"
              onClick={()=>setQuery('')}
            >
              إعادة ضبط البحث والتصنيفات
            </button>
          </div>
        )}
      </section>
    </>
  );
}
