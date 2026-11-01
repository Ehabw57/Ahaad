import type { DateParts, AgeCalculationResult } from "../../utils/ageCalculator";

export type DateFieldValues = {
  day: string;
  month: string;
  year: string;
};

export type CalculatorDate = "birth" | "calculation";

export type AgeCalculatorViewModel = {
  birthDate: DateFieldValues;
  calculationDate: DateFieldValues;
  birthError?: string;
  calculationError?: string;
  generalError?: string;
  isValid: boolean;
  result: AgeCalculationResult | null;
  birthParts: Partial<DateParts>;
  calculationParts: Partial<DateParts>;
};
