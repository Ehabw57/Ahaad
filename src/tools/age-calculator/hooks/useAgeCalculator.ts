import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import {
  calculateAge,
  validateDatePair,
  getDefaultDates,
  formatAgeSummary,
  formatDateString,
  type DateParts,
  type AgeCalculationResult,
} from "../../../utils/ageCalculator";
import {
  restoreDateState,
  syncDateState,
  copyToClipboard,
} from "../../../utils/stateSync";
import type { DateFieldValues, CalculatorDate } from "../types";

const TOOL_SLUG = "age-calculator";

function toFieldValues(date: DateParts): DateFieldValues {
  return {
    day: String(date.day),
    month: String(date.month),
    year: String(date.year),
  };
}

function parseDateFields(fields: DateFieldValues): Partial<DateParts> {
  const parse = (value: string) => {
    if (!value.trim()) return undefined;
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  return {
    day: parse(fields.day),
    month: parse(fields.month),
    year: parse(fields.year),
  };
}

function toNativeDateValue(parts: Partial<DateParts>): string {
  if (!parts.day || !parts.month || !parts.year || parts.year < 1000) return "";
  return formatDateString(parts as DateParts);
}

export function useAgeCalculator() {
  const defaults = useMemo(() => getDefaultDates(), []);
  const [birthDate, setBirthDate] = useState(() =>
    toFieldValues(defaults.birth),
  );
  const [calculationDate, setCalculationDate] = useState(() =>
    toFieldValues(defaults.calc),
  );
  const [isRestored, setIsRestored] = useState(false);
  const [errorDismissed, setErrorDismissed] = useState(false);
  const [summaryCopied, setSummaryCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const summaryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const linkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const { state } = restoreDateState(TOOL_SLUG, defaults);
    setBirthDate(toFieldValues(state.birth));
    setCalculationDate(toFieldValues(state.calc));
    setIsRestored(true);
  }, [defaults]);

  const birthParts = useMemo(() => parseDateFields(birthDate), [birthDate]);
  const calculationParts = useMemo(
    () => parseDateFields(calculationDate),
    [calculationDate],
  );

  const validation = useMemo(
    () => validateDatePair(birthParts, calculationParts),
    [birthParts, calculationParts],
  );

  const result: AgeCalculationResult | null = useMemo(() => {
    if (
      !validation.isValid ||
      !birthParts.day ||
      !birthParts.month ||
      !birthParts.year ||
      !calculationParts.day ||
      !calculationParts.month ||
      !calculationParts.year
    )
      return null;

    return calculateAge(birthParts as DateParts, calculationParts as DateParts);
  }, [validation.isValid, birthParts, calculationParts]);

  useEffect(() => {
    if (!isRestored || !validation.isValid || !result) return;
    syncDateState(
      TOOL_SLUG,
      birthParts as DateParts,
      calculationParts as DateParts,
    );
  }, [isRestored, validation.isValid, result, birthParts, calculationParts]);

  useEffect(() => {
    setErrorDismissed(false);
  }, [birthDate, calculationDate]);

  useEffect(
    () => () => {
      if (summaryTimer.current) clearTimeout(summaryTimer.current);
      if (linkTimer.current) clearTimeout(linkTimer.current);
    },
    [],
  );

  const updateDate = useCallback(
    (which: CalculatorDate, patch: Partial<DateFieldValues>) => {
      const setter = which === "birth" ? setBirthDate : setCalculationDate;
      setter((current) => ({ ...current, ...patch }));
    },
    [],
  );

  const setNativeDate = useCallback(
    (which: CalculatorDate, value: string) => {
      if (!value) return;
      const [year, month, day] = value.split("-").map(Number);
      updateDate(which, {
        day: String(day),
        month: String(month),
        year: String(year),
      });
    },
    [updateDate],
  );

  const setToday = useCallback(() => {
    const now = new Date();
    setCalculationDate({
      day: String(now.getDate()),
      month: String(now.getMonth() + 1),
      year: String(now.getFullYear()),
    });
  }, []);

  const reset = useCallback(() => {
    const next = getDefaultDates();
    setBirthDate(toFieldValues(next.birth));
    setCalculationDate(toFieldValues(next.calc));
    setErrorDismissed(false);
    syncDateState(TOOL_SLUG, next.birth, next.calc);
  }, []);

  const copyWithFeedback = useCallback(
    async (value: string, kind: "summary" | "link") => {
      const success = await copyToClipboard(value);
      if (!success) return;

      if (kind === "summary") {
        if (summaryTimer.current) clearTimeout(summaryTimer.current);
        setSummaryCopied(true);
        summaryTimer.current = setTimeout(() => setSummaryCopied(false), 2500);
      } else {
        if (linkTimer.current) clearTimeout(linkTimer.current);
        setLinkCopied(true);
        linkTimer.current = setTimeout(() => setLinkCopied(false), 2500);
      }
    },
    [],
  );

  const copySummary = useCallback(async () => {
    if (!result) return;
    await copyWithFeedback(formatAgeSummary(result, 'www.ahaad.com/ageCalculator'), "summary");
  }, [result, copyWithFeedback]);

  const copyLink = useCallback(async () => {
    if (typeof window === "undefined") return;
    await copyWithFeedback(window.location.href, "link");
  }, [copyWithFeedback]);

  return {
    birthDate,
    calculationDate,
    birthParts,
    calculationParts,
    birthNativeValue: toNativeDateValue(birthParts),
    calculationNativeValue: toNativeDateValue(calculationParts),
    validation,
    result,
    errorDismissed,
    dismissError: () => setErrorDismissed(true),
    updateDate,
    setNativeDate,
    setToday,
    reset,
    copySummary,
    copyLink,
    summaryCopied,
    linkCopied,
  };
}
