import type { ComponentChildren } from 'preact';
import { X } from 'lucide-preact';

type Props = {
  tone?: 'error' | 'info';
  children: ComponentChildren;
  onDismiss?: () => void;
  dismissLabel?: string;
};

/** Inline status line. Knows nothing about any specific tool. */
export default function StatusMessage({ tone = 'info', children, onDismiss, dismissLabel = 'إغلاق' }: Props) {
  const colors =
    tone === 'error'
      ? 'border-error bg-error-container text-error'
      : 'border-border bg-surface-subtle text-text-primary';
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      class={`flex items-start justify-between gap-3 rounded-md border px-4 py-3 text-sm ${colors}`}
    >
      <div class="min-w-0 flex-1">{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          class="flex size-6 shrink-0 items-center justify-center rounded-sm hover:bg-surface-container"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
