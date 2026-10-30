import type { ComponentType } from "preact";
import type { LucideProps } from "lucide-preact";
import { X } from "lucide-preact";

interface ToolCardProps {
  slug: string;
  title: string;
  shortDescription: string;
  icon: ComponentType<LucideProps>;
  catId: string;
  /** Even = filled, odd = outlined */
  index: number;
}

export default function ToolCard({
  slug,
  title,
  shortDescription,
  icon: Icon = X,
  catId,
  index,
}: ToolCardProps) {
  const isFilledIcon = index % 2 === 0;

  const iconBadgeClass = isFilledIcon
    ? "bg-text-primary text-canvas"
    : "bg-surface text-text-primary border border-border";

  return (
    <article
      class="group"
      data-category={catId}
      data-name={`${title} ${shortDescription}`}
    >
      <a
        href={`/tools/${slug}`}
        class="flex flex-col p-5 sm:p-6 rounded-md bg-surface border border-border hover:border-border-hover transition-colors duration-200 min-h-44 h-full"
      >
        {/* Icon Badge */}
        <div class="mb-4">
          <div
            class={`w-12 h-12 flex items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${iconBadgeClass}`}
          >
            <Icon size={25} />
          </div>
        </div>

        {/* Content */}
        <h3 class="text-text-primary font-bold text-base mb-1.5 group-hover:text-accent transition-colors leading-snug">
          {title}
        </h3>

        <p class="text-text-secondary text-xs leading-relaxed line-clamp-2">
          {shortDescription}
        </p>
      </a>
    </article>
  );
}
