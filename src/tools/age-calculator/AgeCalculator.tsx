/** @jsxImportSource preact */
import DateInputCard from "./components/DateInputCard";
import ErrorAlert from "./components/ErrorAlert";
import AgeResults from "./components/AgeResults";
import { useAgeCalculator } from "./hooks/useAgeCalculator";
import type { CalculatorDate, DateFieldValues } from "./types";

export default function AgeCalculator() {
  const age = useAgeCalculator();
  console.log("rerenderd");

  const handleFieldChange = (
    kind: CalculatorDate,
    field: keyof DateFieldValues,
    value: string,
  ) => age.updateDate(kind, { [field]: value });

  return (
    <div class="flex flex-col gap-6 w-full">
      {!age.errorDismissed && age.validation.generalError && (
        <ErrorAlert
          message={age.validation.generalError}
          onDismiss={age.dismissError}
        />
      )}

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
        <DateInputCard
          kind="calculation"
          value={age.calculationDate}
          nativeValue={age.calculationNativeValue}
          error={age.validation.calcError}
          preview={age.result?.calcDateFormatted}
          onFieldChange={handleFieldChange}
          onNativeChange={age.setNativeDate}
          onSetToday={age.setToday}
        />
        <DateInputCard
          kind="birth"
          value={age.birthDate}
          nativeValue={age.birthNativeValue}
          error={age.validation.birthError}
          preview={age.result?.birthDateFormatted}
          onFieldChange={handleFieldChange}
          onNativeChange={age.setNativeDate}
          onReset={age.reset}
        />
      </div>

      <AgeResults
        result={age.result}
        summaryCopied={age.summaryCopied}
        linkCopied={age.linkCopied}
        onCopySummary={age.copySummary}
        onCopyLink={age.copyLink}
      />
    </div>
  );
}
