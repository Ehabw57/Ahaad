/** @jsxImportSource preact */
import { AlertCircle, X } from "lucide-preact";

type Props = { message: string; onDismiss: () => void };

export default function ErrorAlert({ message, onDismiss }: Props) {
  return (
    <div role="alert" class="w-full p-4 rounded-sm bg-error-container text-text-primary border border-error/30 flex items-center justify-between gap-4 transition-all">
      <div class="flex items-center gap-3">
        <AlertCircle size={24} class="text-error shrink-0" aria-hidden="true" />
        <div class="flex flex-col text-sm">
          <strong class="font-bold text-error">تنبيه في التسلسل الزمني</strong>
          <span class="text-text-secondary">{message}</span>
        </div>
      </div>
    </div>
  );
}
