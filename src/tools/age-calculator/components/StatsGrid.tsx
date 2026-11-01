/** @jsxImportSource preact */
import { CalendarDays, Clock3, Star, Timer } from "lucide-preact";
import { formatNumber, type AgeCalculationResult } from "../../../utils/ageCalculator";

type Props = { result: AgeCalculationResult };

const cardClass = "bg-surface rounded-sm p-5 border border-border flex flex-col justify-between gap-3";

export default function StatsGrid({ result }: Props) {
  const stats = [
    { label: "إجمالي الأيام", value: formatNumber(result.totalDays), caption: "يوماً منقضياً بالتمام", Icon: CalendarDays },
    { label: "إجمالي الأسابيع", value: formatNumber(result.totalWeeks.weeks), caption: `أسبوعاً و ${result.totalWeeks.remainingDays} أيام متبقية`, Icon: Timer },
    { label: "إجمالي الساعات", value: formatNumber(result.totalHours), caption: "ساعة عشتها حتى اللحظة", Icon: Clock3 },
  ];

  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, caption, Icon }) => (
        <article class={cardClass} key={label}>
          <header class="flex items-center justify-between">
            <span class="text-xs font-semibold text-text-secondary">{label}</span>
            <span class="size-7 rounded-sm bg-surface-subtle border border-border flex items-center justify-center text-accent">
              <Icon size={16} aria-hidden="true" />
            </span>
          </header>
          <div>
            <p class="text-2xl font-bold text-text-primary font-mono tracking-tight">{value}</p>
            <p class="text-xs text-text-secondary mt-1">{caption}</p>
          </div>
        </article>
      ))}

      <article class={cardClass}>
        <header class="flex items-center justify-between">
          <span class="text-xs font-semibold text-text-secondary">عيد ميلادك القادم</span>
          <span class="size-7 rounded-sm bg-surface-subtle border border-border flex items-center justify-center text-accent">
            <Star size={16} aria-hidden="true" />
          </span>
        </header>
        <div>
          {result.nextBirthday.isToday ? (
            <>
              <p class="text-xl font-bold text-accent tracking-tight">اليوم بالضبط !!!</p>
              <p class="text-xs text-text-secondary mt-1">عيد ميلاد سعيد!</p>
            </>
          ) : (
            <>
              <p class="text-2xl font-bold text-accent font-mono tracking-tight">{formatNumber(result.nextBirthday.daysRemaining)}</p>
              <p class="text-xs text-text-secondary mt-1">يوم متبقٍ حتى موعد ميلادك القادم</p>
            </>
          )}
        </div>
      </article>
    </div>
  );
}
