/** @jsxImportSource preact */
import { Clock3 } from "lucide-preact";
import type { AgeCalculationResult } from "../../../utils/ageCalculator";
import CopyActions from "./CopyActions";

type Props = {
  result: AgeCalculationResult;
  summaryCopied: boolean;
  linkCopied: boolean;
  onCopySummary: () => void;
  onCopyLink: () => void;
};

const AGE_UNITS = [
  { key: "years", label: "سنة" },
  { key: "months", label: "أشهر" },
  { key: "days", label: "أيام" },
] as const;

export default function ExactAgeCard(props: Props) {
  const { result } = props;
  const ageValues = result.exactAge;

  return (
    <section class="w-full bg-surface rounded-sm p-6 sm:p-8 border border-border flex flex-col gap-6 relative overflow-hidden">
      <header class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-md bg-accent text-accent-foreground flex items-center justify-center">
          <Clock3 size={20} aria-hidden="true" />
        </div>
        <div>
          <span class="text-xs font-bold text-accent uppercase tracking-wider">النتيجة الدقيقة</span>
          <h2 class="text-lg sm:text-xl font-bold text-text-primary">العمر المحسوب حالياً</h2>
        </div>
      </header>

      <div class="grid grid-cols-3 gap-3 sm:gap-6 text-center py-2">
        {AGE_UNITS.map(({ key, label }) => (
          <div key={key} class="bg-canvas rounded-sm p-4 sm:p-6 flex flex-col items-center justify-center border border-border/60">
            <span class="text-3xl sm:text-5xl font-bold text-accent tracking-tight font-mono">{ageValues[key]}</span>
            <span class="text-sm sm:text-base font-bold text-text-primary mt-1">{label}</span>
          </div>
        ))}
      </div>

      <footer class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
        <CopyActions {...props} />
      </footer>
    </section>
  );
}
