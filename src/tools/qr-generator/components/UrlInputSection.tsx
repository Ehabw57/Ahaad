/** @jsxImportSource preact */
import { Link2, ShieldCheck } from 'lucide-preact';
import { QR_SIZES, type QrSizeKey, type QrSizeConfig } from '../../../utils/qrGenerator';

interface Props {
  urlInput: string;
  isValid: boolean;
  selectedSize: QrSizeKey;
  sizeConfig: QrSizeConfig;
  onUrlChange: (value: string) => void;
  onSizeChange: (size: QrSizeKey) => void;
}

const SIZE_KEYS: QrSizeKey[] = ['small', 'medium', 'large'];

export default function UrlInputSection({
  urlInput,
  isValid,
  selectedSize,
  sizeConfig,
  onUrlChange,
  onSizeChange,
}: Props) {
  const isDirty = urlInput.trim().length > 0;
  const isInvalid = isDirty && !isValid;

  return (
    <section class="bg-surface border border-border rounded-sm p-6 sm:p-8 space-y-6 sm:space-y-7 shadow-xs">
      <div class="border-b border-border pb-4">
        <h2 class="text-base font-bold text-text-primary">إعدادات الرابط</h2>
        <p class="text-xs text-text-secondary mt-0.5">
          خصص رابط الوجهة والأبعاد المطلوبة للتصدير
        </p>
      </div>

      {/* URL Input */}
      <div class="space-y-2">
        <div class="flex items-center ">
          <label class="block text-sm font-semibold text-text-primary" for="url-input">
            رابط الموقع
          </label>
          <span class="text-[19px] text-error">*</span>
        </div>

        <div class="relative rounded-md shadow-none">
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-secondary">
            <Link2 class="size-4" aria-hidden="true" />
          </div>
          <input
            id="url-input"
            type="url"
            dir="ltr"
            value={urlInput}
            onInput={(e) => onUrlChange((e.target as HTMLInputElement).value)}
            placeholder="https://example.com"
            aria-invalid={isInvalid ? 'true' : 'false'}
            aria-describedby="url-hint"
            class={`block w-full rounded-md border bg-surface pr-11 pl-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 transition-all font-mono outline-hidden ${
              isInvalid
                ? 'border-error ring-1 ring-error/20 focus:border-error focus:ring-2 focus:ring-error/20'
                : 'border-border focus:border-accent focus:ring-2 focus:ring-accent/20'
            }`}
          />
        </div>

        {isInvalid ? (
          <p id="url-hint" class="text-xs text-error leading-normal font-medium">
            يرجى إدخال رابط موقع صالح (مثال: example.com أو https://example.com)
          </p>
        ) : (
          <p id="url-hint" class="text-xs text-text-secondary leading-normal">
            أدخل الرابط الكامل مع البروتوكول (https://) لضمان المسح المباشر دون أخطاء.
          </p>
        )}
      </div>

      {/* Size Selection */}
      <div class="space-y-2.5">
        <label class="block text-sm font-semibold text-text-primary" id="size-label">
          حجم رمز QR
        </label>
        <div
          role="radiogroup"
          aria-labelledby="size-label"
          class="grid grid-cols-3 gap-2 p-1.5 bg-surface-subtle rounded-md border border-border"
        >
          {SIZE_KEYS.map((key) => {
            const config = QR_SIZES[key];
            const isSelected = selectedSize === key;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSizeChange(key)}
                class={`flex flex-col items-center justify-center py-2.5 px-3 rounded-md text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-accent text-accent-foreground shadow-xs font-semibold'
                    : 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
              >
                <span class="text-xs font-semibold">{config.label}</span>
                <span
                  class={`text-[11px] font-mono mt-0.5 ${
                    isSelected ? 'opacity-90' : 'opacity-75'
                  }`}
                >
                  {config.spec}
                </span>
              </button>
            );
          })}
        </div>
        <p class="text-[11px] text-text-secondary">
          يُنصح بـ 512×512 للعروض الرقمية والطباعة المكتبية القياسية.
        </p>
      </div>

      {/* Micro Specs Notice */}
      <div class="pt-4 border-t border-border flex items-center justify-between text-xs text-text-secondary">
        <span class="flex items-center gap-1.5">
          <ShieldCheck class="size-4 text-accent shrink-0" aria-hidden="true" />
          <span>تصميم قياسي أبيض وأسود مع تصحيح أخطاء فئة M</span>
        </span>
        <span class="font-mono text-[11px] text-text-secondary bg-surface-subtle px-2 py-0.5 rounded-md border border-border">
          {sizeConfig.pixelLabel}
        </span>
      </div>
    </section>
  );
}
