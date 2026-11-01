/** @jsxImportSource preact */
import { Check, Copy, Share2 } from "lucide-preact";

type Props = {
  summaryCopied: boolean;
  linkCopied: boolean;
  onCopySummary: () => void;
  onCopyLink: () => void;
};

export default function CopyActions({ summaryCopied, linkCopied, onCopySummary, onCopyLink }: Props) {
  return (
    <div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
      <button
        type="button"
        onClick={onCopySummary}
        class="w-full sm:w-auto px-5 py-2.5 rounded-sm bg-accent hover:bg-accent-hover text-accent-foreground text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
      >
        {summaryCopied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        <span>{summaryCopied ? "تم نسخ النتيجة" : "نسخ النتيجة التفصيلية"}</span>
      </button>

      <button
        type="button"
        onClick={onCopyLink}
        class="w-full sm:w-auto px-5 py-2.5 rounded-sm bg-canvas hover:bg-surface-subtle text-text-primary border border-border text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
      >
        {linkCopied ? <Check size={16} class="text-accent" aria-hidden="true" /> : <Share2 size={16} class="text-text-secondary" aria-hidden="true" />}
        <span>{linkCopied ? "تم نسخ الرابط" : "نسخ رابط النتيجة"}</span>
      </button>
    </div>
  );
}
