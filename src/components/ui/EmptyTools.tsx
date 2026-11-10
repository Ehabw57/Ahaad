import { SearchX } from "lucide-preact";
interface EmptyToolsProps {
  setQuery: (value: string) => void;
}
export default function EmptyTools({ setQuery }: EmptyToolsProps) {
  return (
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
        onClick={() => setQuery("")}
      >
        إعادة ضبط البحث والتصنيفات
      </button>
    </div>
  );
}
