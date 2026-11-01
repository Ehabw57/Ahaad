import { CATEGORIES_LIST } from "../../data/categories";

interface CategoryPillsProps {
  totalFound: number;
  chosen: string;
  setChosen: (value: string) => void;
}

export default function CategoryPills({
  totalFound,
  chosen,
  setChosen,
}: CategoryPillsProps) {
  return (
    <section id="categories" >
      {/* Scrollable pills row */}

      <div
        class="flex items-center gap-2 overflow-x-auto no-scrollbar"
        role="group"
        aria-label="تصفية الأدوات حسب التصنيف"
      >
        {/* All pill — active by default */}
        <button
          type="button"
          class={`shrink-0 rounded-md px-4 py-2 text-xs sm:text-sm font-medium transition-colors  cursor-pointer ${
            chosen === "all"
              ? "bg-text-primary text-canvas border-text-primary font-semibold"
              : "bg-surface text-text-secondary hover:text-text-primary hover:bg-surface border border-border"
          } `}
          onClick={() => setChosen("all")}
          data-category="all"
          aria-pressed="true"
        >
          الكل
        </button>

        {/* Category pills */}
        {CATEGORIES_LIST.map((cat) => {
          const isActive = chosen === cat.catId;
          return (
            <button
              key={cat.catId}
              onClick={() => setChosen(cat.catId)}
              type="button"
              class={`shrink-0 rounded-md px-4 py-2 text-xs sm:text-sm font-medium transition-colors  cursor-pointer ${
                isActive
                  ? "bg-text-primary text-canvas border-text-primary font-semibold"
                  : "bg-surface text-text-secondary hover:text-text-primary hover:bg-surface border border-border"
              } `}
              aria-pressed="false"
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Results counter */}
      <div class="flex items-center justify-between text-xs text-text-secondary px-4 pt-3 pb-1">
        <span id="resultsCount">عرض {totalFound} أداة</span>
      </div>
    </section>
  );
}
