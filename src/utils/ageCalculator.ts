/**
 * ageCalculator.ts — Pure date arithmetic and calendar calculations for Ahaad.
 * Zero external dependencies. Zero DOM / browser dependencies.
 * Gregorian calendar rules with stable calendar-borrowing and leap year handling.
 */

export interface DateParts {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
}

export interface ExactAge {
  years: number;
  months: number;
  days: number;
}

export interface NextBirthdayInfo {
  isToday: boolean;
  daysRemaining: number;
}

export interface AgeCalculationResult {
  exactAge: ExactAge;
  totalDays: number;
  totalWeeks: {
    weeks: number;
    remainingDays: number;
  };
  totalHours: number;
  nextBirthday: NextBirthdayInfo;
  birthDateFormatted: string;
  calcDateFormatted: string;
}

export interface DatePairValidation {
  isValid: boolean;
  birthError?: string;
  calcError?: string;
  generalError?: string;
}

/**
 * Checks if a Gregorian year is a leap year.
 */
export function isLeapYear(year: number): boolean {
  if (!Number.isInteger(year)) return false;
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Returns the exact number of days in a given Gregorian month and year.
 */
export function daysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12) return 0;
  const daysMap = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysMap[month - 1];
}

/**
 * Validates a DateParts object against the Gregorian calendar.
 * Rejects impossible dates like April 31 or Feb 29 in non-leap years.
 */
export function isValidDate(date: Partial<DateParts> | null | undefined): date is DateParts {
  if (!date) return false;
  const { year, month, day } = date;
  if (
    typeof year !== 'number' ||
    typeof month !== 'number' ||
    typeof day !== 'number' ||
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return false;
  }

  if (year < 1000 || year > 9999) return false;
  if (month < 1 || month > 12) return false;
  const maxDays = daysInMonth(year, month);
  if (day < 1 || day > maxDays) return false;

  return true;
}

/**
 * Converts DateParts to UTC milliseconds at midnight.
 * Guarantees zero daylight-saving or timezone shifts.
 */
export function toUtcMidnightMs(d: DateParts): number {
  return Date.UTC(d.year, d.month - 1, d.day);
}

/**
 * Calculates elapsed calendar days between two dates.
 */
export function calculateCalendarDaysDiff(earlier: DateParts, later: DateParts): number {
  const ms1 = toUtcMidnightMs(earlier);
  const ms2 = toUtcMidnightMs(later);
  return Math.round((ms2 - ms1) / 86400000);
}

/**
 * Validates the chronological relationship between birth date and calculation date.
 * - Both must be valid Gregorian dates.
 * - Calculation date must be strictly later than date of birth.
 */
export function validateDatePair(birth: Partial<DateParts>, calc: Partial<DateParts>): DatePairValidation {
  if (!isValidDate(birth)) {
    return {
      isValid: false,
      birthError: 'تاريخ الميلاد غير مكتمل أو غير صالح في التقويم الميلادي.',
    };
  }

  if (!isValidDate(calc)) {
    return {
      isValid: false,
      calcError: 'تاريخ الحساب غير مكتمل أو غير صالح في التقويم الميلادي.',
    };
  }

  const diff = calculateCalendarDaysDiff(birth, calc);

  if (diff === 0) {
    return {
      isValid: false,
      birthError: 'يجب أن يكون تاريخ الميلاد سابقاً لتاريخ الحساب ولا يمكن أن يتطابقا.',
      generalError: 'يجب أن يكون تاريخ الميلاد سابقاً لتاريخ الحساب لمواصلة العملية الدقيقة.',
    };
  }

  if (diff < 0) {
    return {
      isValid: false,
      birthError: 'لا يمكن أن يكون تاريخ الميلاد لاحقاً لتاريخ الحساب.',
      generalError: 'يجب أن يكون تاريخ الميلاد سابقاً لتاريخ الحساب لمواصلة العملية الدقيقة.',
    };
  }

  return { isValid: true };
}

/**
 * Calculates exact age in completed calendar years, remaining months, and remaining days.
 * Follows stable calendar-borrowing.
 * For users born on February 29: in non-leap years their birthday is treated as March 1.
 */
export function calculateExactAge(birth: DateParts, calc: DateParts): ExactAge {
  let effectiveBirthMonth = birth.month;
  let effectiveBirthDay = birth.day;

  // Rule: If born on Feb 29 and calculation year is not a leap year, effective birthday is March 1.
  if (birth.month === 2 && birth.day === 29 && !isLeapYear(calc.year)) {
    effectiveBirthMonth = 3;
    effectiveBirthDay = 1;
  }

  let years = calc.year - birth.year;
  let months = calc.month - effectiveBirthMonth;
  let days = calc.day - effectiveBirthDay;

  if (days < 0) {
    months -= 1;
    const prevMonth = calc.month === 1 ? 12 : calc.month - 1;
    const prevYear = calc.month === 1 ? calc.year - 1 : calc.year;
    days += daysInMonth(prevYear, prevMonth);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

/**
 * Calculates next birthday relative to calculation date.
 * If calc date is on the birthday, returns isToday = true, daysRemaining = 0.
 * In non-leap years, Feb 29 birthdays occur on March 1.
 */
export function calculateNextBirthday(birth: DateParts, calc: DateParts): NextBirthdayInfo {
  function getBirthdayInYear(targetYear: number): DateParts {
    if (birth.month === 2 && birth.day === 29) {
      return isLeapYear(targetYear)
        ? { year: targetYear, month: 2, day: 29 }
        : { year: targetYear, month: 3, day: 1 };
    }
    return { year: targetYear, month: birth.month, day: birth.day };
  }

  const bdayThisYear = getBirthdayInYear(calc.year);
  const diffDays = calculateCalendarDaysDiff(calc, bdayThisYear);

  if (diffDays === 0) {
    return { isToday: true, daysRemaining: 0 };
  }

  if (diffDays > 0) {
    return { isToday: false, daysRemaining: diffDays };
  }

  const bdayNextYear = getBirthdayInYear(calc.year + 1);
  const nextDiffDays = calculateCalendarDaysDiff(calc, bdayNextYear);
  return { isToday: false, daysRemaining: nextDiffDays };
}

/**
 * Formats integer with Western digits and thousands separators (e.g. 9,225).
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

/**
 * Formats a DateParts object into an Arabic string (e.g. "الجمعة، 15 أكتوبر 1999").
 */
export function formatArabicDate(date: DateParts): string {
  const d = new Date(Date.UTC(date.year, date.month - 1, date.day, 12, 0, 0));
  return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

/**
 * Generates the complete AgeCalculationResult for a valid birth and calculation date pair.
 */
export function calculateAge(birth: DateParts, calc: DateParts): AgeCalculationResult {
  const exactAge = calculateExactAge(birth, calc);
  const totalDays = calculateCalendarDaysDiff(birth, calc);
  const weeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;
  const totalHours = totalDays * 24;
  const nextBirthday = calculateNextBirthday(birth, calc);

  return {
    exactAge,
    totalDays,
    totalWeeks: { weeks, remainingDays },
    totalHours,
    nextBirthday,
    birthDateFormatted: formatArabicDate(birth),
    calcDateFormatted: formatArabicDate(calc),
  };
}

/**
 * Generates default dates for the first visit or reset:
 * - Calculation date is today's local date (or provided date for testing).
 * - Date of birth is exactly 25 years before calculation date.
 */
export function getDefaultDates(referenceDate?: Date): { birth: DateParts; calc: DateParts } {
  const now = referenceDate || new Date();
  const cYear = now.getFullYear();
  const cMonth = now.getMonth() + 1;
  const cDay = now.getDate();

  const calc: DateParts = { year: cYear, month: cMonth, day: cDay };

  let bYear = cYear - 25;
  let bMonth = cMonth;
  let bDay = cDay;

  // Handle Feb 29 on leap year when subtracting 25 years (target year won't be leap)
  if (bMonth === 2 && bDay === 29 && !isLeapYear(bYear)) {
    bDay = 28;
  }

  const birth: DateParts = { year: bYear, month: bMonth, day: bDay };

  return { birth, calc };
}

/**
 * Formats the multi-line Arabic summary string for the "نسخ النتيجة" action.
 * Structured per spec §14.
 */
export function formatAgeSummary(result: AgeCalculationResult): string {
  const { exactAge, totalDays, totalWeeks, totalHours, nextBirthday } = result;

  const exactAgeStr = `العمر الدقيق: ${exactAge.years} سنة و${exactAge.months} أشهر و${exactAge.days} يومًا`;
  const totalDaysStr = `إجمالي الأيام: ${formatNumber(totalDays)} يومًا`;
  const totalWeeksStr = `إجمالي الأسابيع: ${formatNumber(totalWeeks.weeks)} أسبوعًا و${totalWeeks.remainingDays} أيام`;
  const totalHoursStr = `إجمالي الساعات: ${formatNumber(totalHours)} ساعة`;

  const nextBirthdayStr = nextBirthday.isToday
    ? 'عيد ميلادك القادم: عيد ميلادك اليوم!'
    : `عيد ميلادك القادم: يتبقى ${formatNumber(nextBirthday.daysRemaining)} يومًا`;

  return [exactAgeStr, totalDaysStr, totalWeeksStr, totalHoursStr, nextBirthdayStr].join('\n');
}

/**
 * Parses a YYYY-MM-DD string into a validated DateParts object or null.
 */
export function parseDateString(str: string | null | undefined): DateParts | null {
  if (!str || typeof str !== 'string') return null;
  const match = str.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  const parts: DateParts = { year, month, day };
  return isValidDate(parts) ? parts : null;
}

/**
 * Formats DateParts into standard YYYY-MM-DD format (used in native inputs and URLs).
 */
export function formatDateString(date: DateParts): string {
  const y = String(date.year).padStart(4, '0');
  const m = String(date.month).padStart(2, '0');
  const d = String(date.day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
