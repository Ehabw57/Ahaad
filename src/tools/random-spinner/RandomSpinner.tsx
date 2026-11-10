import { useState } from "preact/hooks";
import { X } from "lucide-preact";
import { MAX_NAMES, MIN_NAMES } from "../../utils/randomSpinner";
import { useNames } from "./hooks/useNames";
import { useSpinner } from "./hooks/useSpinner";
import Wheel from "./Wheel";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const DISABLED = "disabled:opacity-50 disabled:cursor-not-allowed";
const BTN_PRIMARY = `rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground hover:bg-accent-hover ${FOCUS} ${DISABLED}`;
const BTN_SECONDARY = `rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-border-hover ${FOCUS} ${DISABLED}`;

export default function RandomSpinner() {
  const { names, add, remove, clear } = useNames();
  const { wheelRef, spin, spinning, winner } = useSpinner(names);
  const [text, setText] = useState("");

  const isFull = names.length >= MAX_NAMES;
  const canSpin = names.length >= MIN_NAMES;

  const handleAdd = () => {
    text.trim();
    add(text);
    setText("");
  };

  // النص الظاهر فوق الزر
  const statusText = !canSpin
    ? "أضف اسماً واحداً على الأقل"
    : spinning
      ? "جارٍ الدوران…"
      : (winner ?? "اضغط الزر لإدارة العجلة");
  const showWinner = winner !== null && !spinning;

  return (
    <div class="grid gap-8 lg:grid-cols-2  lg:items-stretch">
      {/* العجلة والنتيجة والزر */}
      <section class="bg-surface rounded-md shadow-md p-5 flex flex-col items-center gap-4">
        <Wheel names={names} wheelRef={wheelRef} />

        <p
          role="status"
          aria-live="polite"
          class={`min-h-10 wrap-break-word text-center ${
            showWinner
              ? "text-2xl font-semibold text-text-primary"
              : "text-text-secondary"
          }`}
        >
          {statusText}
        </p>

        {/* يبقى الزر مفعّلاً أثناء الدوران لأن الضغط المتكرر يزيد السرعة */}
        <button
          type="button"
          onClick={spin}
          disabled={!canSpin}
          class={`${BTN_PRIMARY} w-full sm:w-auto`}
        >
          أدِر العجلة
        </button>
      </section>

      {/* الإدخال والقائمة */}
      <section class="bg-surface rounded-md shadow-sm p-10  flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="names-input" class="text-sm font-medium">
            أضف أسماء
          </label>
          <textarea
            id="names-input"
            maxLength={1500}
            rows={3}
            value={text}
            onInput={(e) => setText(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAdd();
              }
            }}
            disabled={spinning || isFull}
            placeholder="اكتب اسماً أو إلصق أسماء، كل اسم في سطر"
            class={`rounded-md border border-border bg-canvas p-3 ${FOCUS} ${DISABLED}`}
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={spinning || isFull || !text.trim()}
            class={`${BTN_SECONDARY} self-start`}
          >
            إضافة
          </button>
          {isFull && (
            <p class="text-sm text-text-secondary">
              وصلت للحد الأقصى ({MAX_NAMES} اسماً)
            </p>
          )}
        </div>

        <div class="flex items-center justify-between">
          <h2 class="text-sm font-medium">
            الأسماء ({names.length}/{MAX_NAMES})
          </h2>
          <button
            type="button"
            onClick={clear}
            disabled={spinning || names.length === 0}
            class={BTN_SECONDARY}
          >
            مسح الكل
          </button>
        </div>

        {names.length === 0 ? (
          <p class="text-sm text-text-secondary">لم تضف أي أسماء بعد</p>
        ) : (
          <ul class="max-h-80 divide-y divide-border overflow-y-auto rounded-lg border border-border bg-canvas ">
            {names.map((name) => (
              <li
                key={name}
                class="flex items-center justify-between gap-2 px-3 py-2"
              >
                <span class="wrap-break-word">{name}</span>
                <button
                  type="button"
                  onClick={() => remove(name)}
                  disabled={spinning}
                  aria-label={`حذف ${name}`}
                  class={`rounded-sm p-1 text-text-secondary hover:text-error ${FOCUS} ${DISABLED}`}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
