/** @jsxImportSource preact */
import { Download, Code2, Copy, Check, QrCode } from "lucide-preact";
import type { QrGenerationResult, QrSizeConfig, CopyState } from "../types";

interface Props {
  qrResult: QrGenerationResult | null;
  sizeConfig: QrSizeConfig;
  copyState: CopyState;
  onDownloadPng: () => void;
  onDownloadSvg: () => void;
  onCopyQr: () => void;
}

export default function QrPreviewSection({
  qrResult,
  sizeConfig,
  copyState,
  onDownloadPng,
  onDownloadSvg,
  onCopyQr,
}: Props) {
  const isReady = Boolean(qrResult);
  const isCopied = copyState === "copied";

  return (
    <section class="bg-surface border border-border rounded-sm p-6 flex flex-col items-center shadow-xs">
      {/* Preview Box Container */}
      <div
        class="w-full aspect-square max-w-85 bg-surface-subtle border border-dashed border-border rounded-sm flex items-center justify-center p-6 transition-all duration-200"
        aria-live="polite"
      >
        {isReady && qrResult ? (
          <div
            class="bg-white p-4 rounded-md shadow-xs border border-border/80 flex items-center justify-center w-full h-full max-w-65 max-h-65 [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
            role="img"
            aria-label="معاينة رمز الاستجابة السريعة QR المولد"
            dangerouslySetInnerHTML={{ __html: qrResult.svg }}
          />
        ) : (
          <div class="flex flex-col items-center justify-center text-center p-4">
            <div class="size-16 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-text-secondary mb-3 bg-surface shadow-2xs">
              <QrCode class="size-8" aria-hidden="true" />
            </div>
            <p class="text-sm font-semibold text-text-secondary max-w-[200px] leading-relaxed">
              أدخل رابط الموقع لإنشاء رمز QR
            </p>
            <span class="text-[11px] text-text-secondary/70 mt-1 font-mono">
              جاهز للإدخال
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div class="w-full flex justify-center gap-5 items-center mt-6 ">
        {/* Primary Download Button: PNG */}
        <button
          type="button"
          disabled={!isReady}
          onClick={onDownloadPng}
          class={`flex items-center justify-center gap-2 font-medium px-4 lg:px-8 py-3 rounded-sm text-sm transition-colors ${
            isReady
              ? "bg-accent hover:bg-accent-hover text-accent-foreground shadow-xs cursor-pointer"
              : "bg-surface-subtle text-text-secondary/50 border border-border cursor-not-allowed"
          }`}
          aria-label={`تنزيل رمز QR بصيغة PNG بحجم ${sizeConfig.spec}`}
        >
          <Download class="size-4 shrink-0" aria-hidden="true" />
          <span>تنزيل PNG</span>
        </button>

        {/* SVG Download */}
        <button
          type="button"
          disabled={!isReady}
          onClick={onDownloadSvg}
          class={`flex items-center justify-center gap-2 font-medium px-4 lg:px-8 py-3 rounded-sm text-sm transition-colors ${
            isReady
              ? "border border-border bg-surface text-text-primary hover:bg-surface-subtle shadow-2xs cursor-pointer"
              : "border border-border/50 bg-surface-subtle text-text-secondary/40 cursor-not-allowed"
          }`}
          aria-label="تنزيل رمز QR كملف متجهي SVG"
        >
          <Code2 class="size-3.5 shrink-0" aria-hidden="true" />
          <span>تنزيل SVG</span>
        </button>
      </div>
    </section>
  );
}
