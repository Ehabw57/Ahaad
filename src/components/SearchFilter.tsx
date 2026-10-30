import { Search } from "lucide-preact";

interface SearchFilterProps {
  query: string;
  setQuery: (value: string) => void;
}

export default function SearchFilter({ query, setQuery }: SearchFilterProps) {
  return (
    <section class="relative w-full px-4">
      <label class="sr-only" for="toolSearchInput">
        ابحث عن أداة
      </label>

      <div class="relative mx-auto flex items-center mb-10 lg:max-w-2xl h-14 rounded-lg border border-border bg-surface shadow-xs focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 transition-all">
        {/* Search icon */}
        <div
          class="flex items-center justify-center ps-4 pe-2 text-text-secondary pointer-events-none shrink-0"
          aria-hidden="true"
        >
          <Search size={18} />
        </div>

        {/* Input field */}
        <input
          id="toolSearchInput"
          type="text"
          autocomplete="off"
          placeholder="ابحث عن أداة... (مثلاً: حساب العمر، ضغط الصور، نسبة مئوية)"
          value={query}
          onInput={(event) => setQuery(event.currentTarget.value)}
          class="w-full h-full bg-transparent border-0 text-text-primary placeholder:text-text-unactive text-sm sm:text-base font-normal focus:ring-0 focus:outline-none pe-5"
          aria-label="ابحث عن أداة"
        />

        <div class="absolute inset-e-3 flex items-center gap-2">
          <kbd class="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] text-text-secondary font-medium bg-surface border border-border rounded-lg">
            ESC
          </kbd>
        </div>
      </div>
    </section>
  );
}
