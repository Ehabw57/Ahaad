import type { ComponentType } from "preact";
import type { LucideProps } from "lucide-preact";
import { BadgeQuestionMark as Unknown } from "lucide-preact";

interface ToolCardProps {
  slug: string;
  title: string;
  shortDescription: string;
  icon?: ComponentType<LucideProps>;
  catId: string;
  /** Even = filled, odd = outlined */
  index?: number;
  headingLevel?: "h2" | "h3";
  rounded?: "sm" | "md" | "2xl";
  dataCollapsed?: boolean;
}

export default function ToolCard({
  slug,
  title,
  shortDescription,
  icon: Icon = Unknown,
  catId,
  index = 0,
  headingLevel = "h3",
  rounded = "sm",
  dataCollapsed,
}: ToolCardProps) {
  const isFilledIcon = index % 2 === 0;

  const iconBadgeClass = isFilledIcon
    ? "bg-text-primary text-canvas"
    : "bg-surface text-text-primary border border-border";

  const HeadingTag = headingLevel;

  return (
    <article
      class="group h-full"
      data-category={catId}
      data-name={`${title} ${shortDescription}`}
      data-collapsed={dataCollapsed ? "true" : undefined}
    >
      <a
        href={`/tools/${slug}`}
        class={`flex flex-col p-5 sm:p-6 rounded-${rounded} bg-surface border border-border hover:border-border-hover transition-colors duration-200 min-h-44 h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
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
        <HeadingTag class="text-text-primary font-bold text-base mb-1.5 group-hover:text-accent transition-colors leading-snug">
          {title}
        </HeadingTag>

        <p class="text-text-secondary text-xs sm:text-sm leading-relaxed line-clamp-2">
          {shortDescription}
        </p>
      </a>
    </article>
  );
}
