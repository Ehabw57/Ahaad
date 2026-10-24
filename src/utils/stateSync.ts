/**
 * stateSync.ts — Generic URL Query & LocalStorage state synchronization for Ahaad tools.
 * Implements constitution §4 & spec §11-12:
 * Priority: 1. Valid URL query -> 2. Valid LocalStorage -> 3. Defaults.
 */

import {
  parseDateString,
  formatDateString,
  validateDatePair,
  type DateParts,
} from './ageCalculator.ts';

export interface DatePairState {
  birth: DateParts;
  calc: DateParts;
}

/**
 * Reads and restores date state following the priority chain:
 * 1. URL search params (dob, date)
 * 2. LocalStorage (ahaad_tool_[toolSlug])
 * 3. Default fallback values
 */
export function restoreDateState(
  toolSlug: string,
  defaultValues: DatePairState
): { state: DatePairState; source: 'url' | 'storage' | 'default' } {
  // 1. Try URL parameters
  if (typeof window !== 'undefined' && window.location?.search) {
    try {
      const params = new URLSearchParams(window.location.search);
      const dobParam = params.get('dob');
      const dateParam = params.get('date');

      if (dobParam && dateParam) {
        const birth = parseDateString(dobParam);
        const calc = parseDateString(dateParam);
        if (birth && calc && validateDatePair(birth, calc).isValid) {
          return {
            state: { birth, calc },
            source: 'url',
          };
        }
      }
    } catch {
      // Ignore malformed URL exceptions
    }
  }

  // 2. Try LocalStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const storageKey = `ahaad_tool_${toolSlug}`;
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.dob === 'string' && typeof parsed.date === 'string') {
          const birth = parseDateString(parsed.dob);
          const calc = parseDateString(parsed.date);
          if (birth && calc && validateDatePair(birth, calc).isValid) {
            return {
              state: { birth, calc },
              source: 'storage',
            };
          }
        }
      }
    } catch {
      // Safe fallback if localStorage is disabled or throws
    }
  }

  // 3. Fall back to defaults
  return {
    state: defaultValues,
    source: 'default',
  };
}

/**
 * Synchronizes the valid date pair to the URL (via replaceState) and LocalStorage.
 * Only saves if both dates are valid and properly ordered.
 */
export function syncDateState(toolSlug: string, birth: DateParts, calc: DateParts): void {
  if (typeof window === 'undefined') return;

  const validation = validateDatePair(birth, calc);
  if (!validation.isValid) return;

  const dobStr = formatDateString(birth);
  const dateStr = formatDateString(calc);

  // Update URL via replaceState (no page reload, no history spam)
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('dob', dobStr);
    url.searchParams.set('date', dateStr);
    window.history.replaceState({}, '', url.toString());
  } catch {
    // Ignore URL update errors
  }

  // Save to LocalStorage
  try {
    const storageKey = `ahaad_tool_${toolSlug}`;
    window.localStorage.setItem(storageKey, JSON.stringify({ dob: dobStr, date: dateStr }));
  } catch {
    // Ignore storage quota or disabled exceptions
  }
}

/**
 * Copies text to the system clipboard with fallback for non-secure contexts.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to legacy method
    }
  }

  // Fallback for older browsers or non-secure contexts
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.start = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
