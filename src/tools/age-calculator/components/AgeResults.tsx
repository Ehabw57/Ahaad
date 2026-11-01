/** @jsxImportSource preact */
import { CalendarDays } from "lucide-preact";
import type { AgeCalculationResult } from "../../../utils/ageCalculator";
import ExactAgeCard from "./ExactAgeCard";
import StatsGrid from "./StatsGrid";

type Props = {
  result: AgeCalculationResult | null;
  summaryCopied: boolean;
  linkCopied: boolean;
  onCopySummary: () => void;
  onCopyLink: () => void;
};

export default function AgeResults(props: Props) {
  if (!props.result) {
    return (
      <div class="w-full p-8 rounded-sm border border-dashed border-border text-center flex flex-col items-center justify-center gap-2 text-text-secondary">
        <CalendarDays size={32} class="text-text-secondary/60 mb-1" aria-hidden="true" />
        <span class="text-sm font-medium">أدخل تاريخ ميلاد وتاريخ حساب صالحين لعرض النتائج الدقيقة</span>
      </div>
    );
  }

  return (
    <section class="flex flex-col gap-5 w-full" aria-label="نتيجة حساب العمر">
      <ExactAgeCard
        result={props.result}
        summaryCopied={props.summaryCopied}
        linkCopied={props.linkCopied}
        onCopySummary={props.onCopySummary}
        onCopyLink={props.onCopyLink}
      />
      <StatsGrid result={props.result} />
    </section>
  );
}
