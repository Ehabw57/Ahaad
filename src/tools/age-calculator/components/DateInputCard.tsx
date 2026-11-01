/** @jsxImportSource preact */
import {
  CalendarDays,
  Cake,
  RotateCcw,
  CalendarClock,
  AlertCircle,
} from "lucide-preact";
import type { DateFieldValues, CalculatorDate } from "../types";

type Props = {
  kind: CalculatorDate;
  value: DateFieldValues;
  nativeValue: string;
  error?: string;
  preview?: string;
  onFieldChange: (
    kind: CalculatorDate,
    field: keyof DateFieldValues,
    value: string,
  ) => void;
  onNativeChange: (kind: CalculatorDate, value: string) => void;
  onSetToday?: () => void;
  onReset?: () => void;
};

const FIELD_CONFIG = [
  { key: "day", label: "اليوم", min: 1, max: 31, placeholder: "15" },
  { key: "month", label: "الشهر", min: 1, max: 12, placeholder: "10" },
  { key: "year", label: "السنة", min: 1, max: 2999, placeholder: "1999" },
] as const;

export default function DateInputCard({
  kind,
  value,
  nativeValue,
  error,
  preview,
  onFieldChange,
  onNativeChange,
  onSetToday,
  onReset,
}: Props) {
  const isBirth = kind === "birth";
  const heading = isBirth ? "تاريخ الميلاد" : "تاريخ الحساب المقارن";
  const description = isBirth
    ? "اليوم، الشهر وسنة الولادة"
    : "تاريخ اليوم الحالي أو نقطة مرجعية";
  const Icon = isBirth ? Cake : CalendarClock;
  const prefix = isBirth ? "birth" : "calc";

  return (
    <section class="bg-surface rounded-sm p-5 sm:p-6 border border-border flex flex-col gap-4">
      <header class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-md bg-surface-subtle border border-border flex items-center justify-center text-accent">
            <Icon size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 class="font-bold text-base text-text-primary">{heading}</h2>
            <p class="text-xs text-text-secondary">{description}</p>
          </div>
        </div>

        <label class="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface-subtle hover:bg-canvas text-text-primary border border-border text-xs font-medium transition-colors cursor-pointer shrink-0">
          <input
            onClick={(event) => {
              try {
                event.currentTarget?.showPicker();
              } catch {
                event.currentTarget?.focus();
              }
            }}
            type="date"
            value={nativeValue}
            onChange={(event) =>
              onNativeChange(
                kind,
                (event.currentTarget as HTMLInputElement).value,
              )
            }
            aria-label={`اختيار ${heading} من التقويم`}
            class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <CalendarDays size={16} class="text-accent" aria-hidden="true" />
          <span>التقويم</span>
        </label>
      </header>

      <div class="grid grid-cols-3 gap-3">
        {FIELD_CONFIG.map((field) => {
          const id = `${prefix}-${field.key}`;
          return (
            <div class="flex flex-col gap-1.5" key={field.key}>
              <label for={id} class="text-xs font-medium text-text-secondary">
                {field.label}
              </label>
              <input
                id={id}
                type="number"
                min={field.min}
                max={field.max}
                placeholder={
                  isBirth && field.key === "year" ? "1999" : field.placeholder
                }
                value={value[field.key]}
                onClick={(e) => e.currentTarget.select()}
                onInput={(event) =>
                  onFieldChange(
                    kind,
                    field.key,
                    (event.currentTarget as HTMLInputElement).value,
                  )
                }
                aria-invalid={Boolean(error)}
                class={`w-full bg-canvas text-text-primary text-sm rounded-sm p-2.5 text-center border transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                  error ? "border-error" : "border-border focus:border-accent"
                }`}
              />
            </div>
          );
        })}
      </div>

      <footer class="pt-1 flex items-center justify-between gap-3 text-xs">
        {error ? (
          <span
            role="alert"
            class="text-error font-medium flex items-center gap-1"
          >
            <AlertCircle size={14} class="shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </span>
        ) : preview ? (
          <span class="text-text-secondary flex items-center gap-1.5">
            <span class="size-2 rounded-full bg-accent inline-block" />
            <span>{preview}</span>
          </span>
        ) : (
          <span class="hidden"></span>
        )}
        {!isBirth ? (
          <button
            type="button"
            onClick={onSetToday}
            class="text-accent hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <RotateCcw size={14} aria-hidden="true" />
            <span>تعيين إلى اليوم الحالي</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onReset}
            class="text-text-secondary hover:text-error flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <RotateCcw size={14} aria-hidden="true" />
            <span>إعادة التعيين</span>
          </button>
        )}
      </footer>
    </section>
  );
}
