/** @jsxImportSource preact */
import { useState, useEffect, useMemo } from "preact/hooks";
import {
  calculateAge,
  validateDatePair,
  getDefaultDates,
  formatAgeSummary,
  formatDateString,
  formatNumber,
  daysInMonth,
  type DateParts,
  type AgeCalculationResult,
} from "../utils/ageCalculator.ts";
import {
  restoreDateState,
  syncDateState,
  copyToClipboard,
} from "../utils/stateSync.ts";

const TOOL_SLUG = "age-calculator";

export default function AgeCalculator() {
  // Initialize with deterministic defaults
  const defaults = useMemo(() => getDefaultDates(), []);

  // Raw input string states to support partial typing without immediate validation errors
  const [birthDay, setBirthDay] = useState<string>(String(defaults.birth.day));
  const [birthMonth, setBirthMonth] = useState<string>(
    String(defaults.birth.month),
  );
  const [birthYear, setBirthYear] = useState<string>(
    String(defaults.birth.year),
  );

  const [calcDay, setCalcDay] = useState<string>(String(defaults.calc.day));
  const [calcMonth, setCalcMonth] = useState<string>(
    String(defaults.calc.month),
  );
  const [calcYear, setCalcYear] = useState<string>(String(defaults.calc.year));

  // Dismissable general error state
  const [errorDismissed, setErrorDismissed] = useState<boolean>(false);

  // Copy toast feedback state
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Restore state on mount: URL query -> LocalStorage -> defaults
  useEffect(() => {
    const { state } = restoreDateState(TOOL_SLUG, defaults);
    setBirthDay(String(state.birth.day));
    setBirthMonth(String(state.birth.month));
    setBirthYear(String(state.birth.year));
    setCalcDay(String(state.calc.day));
    setCalcMonth(String(state.calc.month));
    setCalcYear(String(state.calc.year));
  }, []);

  // Parse current inputs into DateParts
  const birthParts: Partial<DateParts> = useMemo(() => {
    const d = parseInt(birthDay, 10);
    const m = parseInt(birthMonth, 10);
    const y = parseInt(birthYear, 10);
    return {
      day: isNaN(d) ? undefined : d,
      month: isNaN(m) ? undefined : m,
      year: isNaN(y) ? undefined : y,
    };
  }, [birthDay, birthMonth, birthYear]);

  const calcParts: Partial<DateParts> = useMemo(() => {
    const d = parseInt(calcDay, 10);
    const m = parseInt(calcMonth, 10);
    const y = parseInt(calcYear, 10);
    return {
      day: isNaN(d) ? undefined : d,
      month: isNaN(m) ? undefined : m,
      year: isNaN(y) ? undefined : y,
    };
  }, [calcDay, calcMonth, calcYear]);

  // Validate dates and ordering
  const validation = useMemo(() => {
    return validateDatePair(birthParts, calcParts);
  }, [birthParts, calcParts]);

  // Compute results only when both dates are fully valid
  const calculationResult: AgeCalculationResult | null = useMemo(() => {
    if (
      validation.isValid &&
      birthParts.day &&
      birthParts.month &&
      birthParts.year &&
      calcParts.day &&
      calcParts.month &&
      calcParts.year
    ) {
      return calculateAge(birthParts as DateParts, calcParts as DateParts);
    }
    return null;
  }, [validation.isValid, birthParts, calcParts]);

  // Automatically sync valid state to URL and LocalStorage
  useEffect(() => {
    if (validation.isValid && calculationResult) {
      syncDateState(TOOL_SLUG, birthParts as DateParts, calcParts as DateParts);
    }
  }, [validation.isValid, calculationResult, birthParts, calcParts]);

  // Reset error dismissed flag when inputs change
  useEffect(() => {
    setErrorDismissed(false);
  }, [birthDay, birthMonth, birthYear, calcDay, calcMonth, calcYear]);

  // Native HTML date picker strings (YYYY-MM-DD)
  const birthNativeValue = useMemo(() => {
    if (
      birthParts.day &&
      birthParts.month &&
      birthParts.year &&
      birthParts.year >= 1000
    ) {
      return formatDateString(birthParts as DateParts);
    }
    return "";
  }, [birthParts]);

  const calcNativeValue = useMemo(() => {
    if (
      calcParts.day &&
      calcParts.month &&
      calcParts.year &&
      calcParts.year >= 1000
    ) {
      return formatDateString(calcParts as DateParts);
    }
    return "";
  }, [calcParts]);

  // Handler for native birth date picker
  const handleNativeBirthChange = (e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    if (!val) return;
    const [y, m, d] = val.split("-").map(Number);
    setBirthYear(String(y));
    setBirthMonth(String(m));
    setBirthDay(String(d));
  };

  // Handler for native calculation date picker
  const handleNativeCalcChange = (e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    if (!val) return;
    const [y, m, d] = val.split("-").map(Number);
    setCalcYear(String(y));
    setCalcMonth(String(m));
    setCalcDay(String(d));
  };

  // Handler for "تعيين إلى اليوم الحالي"
  const handleSetToday = () => {
    const now = new Date();
    setCalcYear(String(now.getFullYear()));
    setCalcMonth(String(now.getMonth() + 1));
    setCalcDay(String(now.getDate()));
  };

  // Handler for "إعادة التعيين"
  const handleReset = () => {
    const { birth, calc } = getDefaultDates();
    setBirthYear(String(birth.year));
    setBirthMonth(String(birth.month));
    setBirthDay(String(birth.day));
    setCalcYear(String(calc.year));
    setCalcMonth(String(calc.month));
    setCalcDay(String(calc.day));
    setErrorDismissed(false);
    syncDateState(TOOL_SLUG, birth, calc);
  };

  // Handler for "نسخ النتيجة التفصيلية"
  const handleCopySummary = async () => {
    if (!calculationResult) return;
    const summary = formatAgeSummary(calculationResult);
    const success = await copyToClipboard(summary);
    if (success) {
      setCopyFeedback("تم نسخ ملخص النتيجة إلى الحافظة ✓");
      setTimeout(() => setCopyFeedback(null), 3000);
    }
  };

  // Handler for "نسخ رابط النتيجة"
  const handleCopyLink = async () => {
    if (typeof window === "undefined") return;
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopyFeedback("تم نسخ رابط النتيجة إلى الحافظة ✓");
      setTimeout(() => setCopyFeedback(null), 3000);
    }
  };

  return (
    <div class="flex flex-col gap-6 w-full">
      {/* Form-level Error Alert Banner */}
      {!errorDismissed && validation.generalError && (
        <div
          role="alert"
          class="w-full p-4 rounded-xl bg-error-container text-text-primary border border-error/30 flex items-center justify-between gap-4 transition-all"
        >
          <div class="flex items-center gap-3">
            <svg
              class="size-6 text-error shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div class="flex flex-col text-sm">
              <span class="font-bold text-error">تنبيه في التسلسل الزمني</span>
              <span class="text-text-secondary">{validation.generalError}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setErrorDismissed(true)}
            aria-label="إغلاق التنبيه"
            class="text-text-secondary hover:text-text-primary p-1 rounded-lg transition-colors cursor-pointer"
          >
            <svg
              class="size-4.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Parallel Date Input Cards */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
        {/* Date of Birth Card */}
        <div class="bg-surface rounded-2xl p-5 sm:p-6 border border-border flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-surface-subtle border border-border flex items-center justify-center text-accent">
                <svg
                  class="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
                  <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
                  <path d="M2 21h20" />
                  <path d="M7 8v3" />
                  <path d="M12 5v6" />
                  <path d="M17 8v3" />
                </svg>
              </div>
              <div>
                <h2 class="font-bold text-base text-text-primary">
                  تاريخ الميلاد
                </h2>
                <span class="text-xs text-text-secondary">
                  اليوم، الشهر وسنة الولادة
                </span>
              </div>
            </div>

            {/* Native Date Picker trigger */}
            <label class="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-canvas text-text-primary border border-border text-xs font-medium transition-colors cursor-pointer">
              <input
                type="date"
                value={birthNativeValue}
                onChange={handleNativeBirthChange}
                aria-label="اختيار تاريخ الميلاد من التقويم"
                class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <svg
                class="size-4 text-accent"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>التقويم</span>
            </label>
          </div>

          {/* Direct Numerical Inputs */}
          <div class="grid grid-cols-3 gap-3">
            <div class="flex flex-col gap-1.5">
              <label
                for="birth-day"
                class="text-xs font-medium text-text-secondary"
              >
                اليوم
              </label>
              <input
                id="birth-day"
                type="number"
                min="1"
                max="31"
                placeholder="15"
                value={birthDay}
                onInput={(e) =>
                  setBirthDay((e.target as HTMLInputElement).value)
                }
                class={`w-full bg-canvas text-text-primary text-sm rounded-xl p-2.5 text-center border transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                  validation.birthError
                    ? "border-error"
                    : "border-border focus:border-accent"
                }`}
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label
                for="birth-month"
                class="text-xs font-medium text-text-secondary"
              >
                الشهر
              </label>
              <input
                id="birth-month"
                type="number"
                min="1"
                max="12"
                placeholder="10"
                value={birthMonth}
                onInput={(e) =>
                  setBirthMonth((e.target as HTMLInputElement).value)
                }
                class={`w-full bg-canvas text-text-primary text-sm rounded-xl p-2.5 text-center border transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                  validation.birthError
                    ? "border-error"
                    : "border-border focus:border-accent"
                }`}
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label
                for="birth-year"
                class="text-xs font-medium text-text-secondary"
              >
                السنة
              </label>
              <input
                id="birth-year"
                type="number"
                min="1900"
                max="2100"
                placeholder="1999"
                value={birthYear}
                onInput={(e) =>
                  setBirthYear((e.target as HTMLInputElement).value)
                }
                class={`w-full bg-canvas text-text-primary text-sm rounded-xl p-2.5 text-center border transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                  validation.birthError
                    ? "border-error"
                    : "border-border focus:border-accent"
                }`}
              />
            </div>
          </div>

          {/* Validation Feedback & Preview */}
          <div class="pt-1 text-xs min-h-[1.5rem] flex items-center justify-between">
            {validation.birthError ? (
              <span
                role="alert"
                class="text-error font-medium flex items-center gap-1"
              >
                <svg
                  class="size-3.5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{validation.birthError}</span>
              </span>
            ) : calculationResult ? (
              <span class="text-text-secondary flex items-center gap-1.5">
                <span class="size-2 rounded-full bg-accent inline-block"></span>
                <span>تاريخ محدد: {calculationResult.birthDateFormatted}</span>
              </span>
            ) : (
              <span class="text-text-secondary">
                يرجى إدخال تاريخ ميلاد صحيح
              </span>
            )}
          </div>
        </div>

        {/* Calculation Date Card */}
        <div class="bg-surface rounded-2xl p-5 sm:p-6 border border-border flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-surface-subtle border border-border flex items-center justify-center text-accent">
                <svg
                  class="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <h2 class="font-bold text-base text-text-primary">
                  تاريخ الحساب المقارن
                </h2>
                <span class="text-xs text-text-secondary">
                  تاريخ اليوم الحالي أو نقطة مرجعية
                </span>
              </div>
            </div>

            {/* Native Date Picker trigger */}
            <label class="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-canvas text-text-primary border border-border text-xs font-medium transition-colors cursor-pointer">
              <input
                type="date"
                value={calcNativeValue}
                onChange={handleNativeCalcChange}
                aria-label="اختيار تاريخ الحساب من التقويم"
                class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <svg
                class="size-4 text-accent"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>التقويم</span>
            </label>
          </div>

          {/* Direct Numerical Inputs */}
          <div class="grid grid-cols-3 gap-3">
            <div class="flex flex-col gap-1.5">
              <label
                for="calc-day"
                class="text-xs font-medium text-text-secondary"
              >
                اليوم
              </label>
              <input
                id="calc-day"
                type="number"
                min="1"
                max="31"
                placeholder="15"
                value={calcDay}
                onInput={(e) =>
                  setCalcDay((e.target as HTMLInputElement).value)
                }
                class={`w-full bg-canvas text-text-primary text-sm rounded-xl p-2.5 text-center border transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                  validation.calcError
                    ? "border-error"
                    : "border-border focus:border-accent"
                }`}
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label
                for="calc-month"
                class="text-xs font-medium text-text-secondary"
              >
                الشهر
              </label>
              <input
                id="calc-month"
                type="number"
                min="1"
                max="12"
                placeholder="10"
                value={calcMonth}
                onInput={(e) =>
                  setCalcMonth((e.target as HTMLInputElement).value)
                }
                class={`w-full bg-canvas text-text-primary text-sm rounded-xl p-2.5 text-center border transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                  validation.calcError
                    ? "border-error"
                    : "border-border focus:border-accent"
                }`}
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label
                for="calc-year"
                class="text-xs font-medium text-text-secondary"
              >
                السنة
              </label>
              <input
                id="calc-year"
                type="number"
                min="1900"
                max="2100"
                placeholder="2024"
                value={calcYear}
                onInput={(e) =>
                  setCalcYear((e.target as HTMLInputElement).value)
                }
                class={`w-full bg-canvas text-text-primary text-sm rounded-xl p-2.5 text-center border transition-all focus:outline-none focus:ring-1 focus:ring-accent ${
                  validation.calcError
                    ? "border-error"
                    : "border-border focus:border-accent"
                }`}
              />
            </div>
          </div>

          {/* Footer Actions: Set Today & Reset */}
          <div class="pt-1 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleSetToday}
              class="text-accent hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <svg
                class="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              <span>تعيين إلى اليوم الحالي</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              class="text-text-secondary hover:text-error flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <svg
                class="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>إعادة التعيين</span>
            </button>
          </div>
        </div>
      </div>

      {/* Centerpiece Results Section (Rendered only on valid input) */}
      {calculationResult ? (
        <div class="flex flex-col gap-5 w-full">
          {/* Exact Age Core Card */}
          <div class="w-full bg-surface rounded-2xl p-6 sm:p-8 border border-border flex flex-col gap-6 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
                  <svg
                    class="size-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <span class="text-xs font-bold text-accent uppercase tracking-wider">
                    النتيجة الدقيقة
                  </span>
                  <h3 class="text-lg sm:text-xl font-bold text-text-primary">
                    العمر المحسوب حالياً
                  </h3>
                </div>
              </div>
            </div>

            {/* Big Metric Pillars: Years, Months, Days */}
            <div class="grid grid-cols-3 gap-3 sm:gap-6 text-center py-2">
              {/* Years */}
              <div class="bg-canvas rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center border border-border/60">
                <span class="text-3xl sm:text-5xl font-bold text-accent tracking-tight font-mono">
                  {calculationResult.exactAge.years}
                </span>
                <span class="text-sm sm:text-base font-bold text-text-primary mt-1">
                  سنة
                </span>
              </div>

              {/* Months */}
              <div class="bg-canvas rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center border border-border/60">
                <span class="text-3xl sm:text-5xl font-bold text-accent tracking-tight font-mono">
                  {calculationResult.exactAge.months}
                </span>
                <span class="text-sm sm:text-base font-bold text-text-primary mt-1">
                  أشهر
                </span>
              </div>

              {/* Days */}
              <div class="bg-canvas rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center border border-border/60">
                <span class="text-3xl sm:text-5xl font-bold text-accent tracking-tight font-mono">
                  {calculationResult.exactAge.days}
                </span>
                <span class="text-sm sm:text-base font-bold text-text-primary mt-1">
                  أيام
                </span>
              </div>
            </div>

            {/* Action Buttons & Feedback Toast */}
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
              <div class="flex flex-col md:flex-row items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-accent-foreground text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                >
                  <svg
                    class="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>نسخ النتيجة التفصيلية</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-canvas hover:bg-surface-subtle text-text-primary border border-border text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
                >
                  <svg
                    class="size-4 text-text-secondary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  <span>نسخ رابط النتيجة</span>
                </button>
              </div>

              {copyFeedback && (
                <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-text-primary text-xs font-semibold animate-fade">
                  <svg
                    class="size-4 text-accent"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>{copyFeedback}</span>
                </div>
              )}
            </div>
          </div>

          {/* 4 Supporting Analytical Cards */}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Total Days */}
            <div class="bg-surface rounded-2xl p-5 border border-border flex flex-col justify-between gap-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-text-secondary">
                  إجمالي الأيام
                </span>
                <div class="size-7 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-accent">
                  <svg
                    class="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
              </div>
              <div>
                <div class="text-2xl font-bold text-text-primary font-mono tracking-tight">
                  {formatNumber(calculationResult.totalDays)}
                </div>
                <div class="text-xs text-text-secondary mt-1">
                  يوماً منقضياً بالتمام
                </div>
              </div>
            </div>

            {/* 2. Total Weeks */}
            <div class="bg-surface rounded-2xl p-5 border border-border flex flex-col justify-between gap-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-text-secondary">
                  إجمالي الأسابيع
                </span>
                <div class="size-7 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-accent">
                  <svg
                    class="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
              </div>
              <div>
                <div class="text-2xl font-bold text-text-primary font-mono tracking-tight">
                  {formatNumber(calculationResult.totalWeeks.weeks)}
                </div>
                <div class="text-xs text-text-secondary mt-1">
                  أسبوعاً و {calculationResult.totalWeeks.remainingDays} أيام
                  متبقية
                </div>
              </div>
            </div>

            {/* 3. Total Hours */}
            <div class="bg-surface rounded-2xl p-5 border border-border flex flex-col justify-between gap-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-text-secondary">
                  إجمالي الساعات
                </span>
                <div class="size-7 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-accent">
                  <svg
                    class="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
              </div>
              <div>
                <div class="text-2xl font-bold text-text-primary font-mono tracking-tight">
                  {formatNumber(calculationResult.totalHours)}
                </div>
                <div class="text-xs text-text-secondary mt-1">
                  ساعة عشتها حتى اللحظة
                </div>
              </div>
            </div>

            {/* 4. Upcoming Birthday */}
            <div class="bg-surface rounded-2xl p-5 border border-border flex flex-col justify-between gap-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-text-secondary">
                  عيد ميلادك القادم
                </span>
                <div class="size-7 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-accent">
                  <svg
                    class="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
              <div>
                {calculationResult.nextBirthday.isToday ? (
                  <>
                    <div class="text-xl font-bold text-accent tracking-tight">
                      اليوم بالضبط 🎉
                    </div>
                    <div class="text-xs text-text-secondary mt-1">
                      عيد ميلاد سعيد! تطابق سنوي كامل.
                    </div>
                  </>
                ) : (
                  <>
                    <div class="text-2xl font-bold text-accent font-mono tracking-tight">
                      {formatNumber(
                        calculationResult.nextBirthday.daysRemaining,
                      )}
                    </div>
                    <div class="text-xs text-text-secondary mt-1">
                      يوم متبقٍ حتى موعد ميلادك القادم
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div class="w-full p-8 rounded-2xl border border-dashed border-border text-center flex flex-col items-center justify-center gap-2 text-text-secondary">
          <svg
            class="size-8 text-text-secondary/60 mb-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span class="text-sm font-medium">
            أدخل تاريخ ميلاد وتاريخ حساب صالحين لعرض النتائج الدقيقة
          </span>
        </div>
      )}
    </div>
  );
}
