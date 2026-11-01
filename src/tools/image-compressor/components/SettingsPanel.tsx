/** @jsxImportSource preact */
import { Sliders, Info } from 'lucide-preact';
import { UI_MESSAGES } from '../messages.ts';
import {
  ALLOWED_MAX_DIMENSIONS,
  type AllowedMaxDimension,
} from '../../../utils/imageCompressor.ts';

export interface SettingsPanelProps {
  quality: number;
  maxDimension: AllowedMaxDimension | null;
  hasPng: boolean;
  disabled?: boolean;
  onQualityChange: (quality: number) => void;
  onMaxDimensionChange: (dim: AllowedMaxDimension | null) => void;
}

export default function SettingsPanel({
  quality,
  maxDimension,
  hasPng,
  disabled = false,
  onQualityChange,
  onMaxDimensionChange,
}: SettingsPanelProps) {
  const presets = [
    { value: 50, label: UI_MESSAGES.presetLow, desc: UI_MESSAGES.presetLowDesc },
    { value: 75, label: UI_MESSAGES.presetMed, desc: UI_MESSAGES.presetMedDesc },
    { value: 90, label: UI_MESSAGES.presetHigh, desc: UI_MESSAGES.presetHighDesc },
  ];

  return (
    <section class="bg-surface rounded-md p-5 sm:p-6 border border-border shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div class="flex items-center justify-between pb-3.5 border-b border-border">
        <div class="flex items-center gap-2 text-text-primary">
          <Sliders class="w-5 h-5 text-accent" />
          <h2 class="font-bold text-base sm:text-lg">{UI_MESSAGES.settingsTitle}</h2>
        </div>
        <div class="text-text-secondary text-xs flex items-center gap-1.5">
          <span>{UI_MESSAGES.settingsSubtitle}</span>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Quality Presets */}
        <div class="md:col-span-7 flex flex-col gap-2.5">
          <label class="text-xs sm:text-sm font-semibold text-text-primary">
            {UI_MESSAGES.targetQuality}
          </label>
          <div class="grid grid-cols-3 gap-2">
            {presets.map((p) => {
              const isSelected = quality === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => onQualityChange(p.value)}
                  class={`p-3 text-right rounded-md transition-all flex flex-col gap-0.5 border ${
                    isSelected
                      ? 'bg-accent text-accent-foreground border-accent shadow-xs'
                      : 'bg-surface-subtle hover:bg-surface-container text-text-primary border-border'
                  } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span class="font-bold text-xs sm:text-sm">{p.label}</span>
                  <span
                    class={`text-[11px] ${
                      isSelected ? 'text-accent-foreground/80' : 'text-text-secondary'
                    }`}
                  >
                    {p.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* PNG note */}
          {hasPng && (
            <div class="flex items-center gap-1.5 text-text-secondary text-xs mt-1 bg-surface-subtle p-2 rounded-md border border-border">
              <Info class="w-4 h-4 text-accent shrink-0" />
              <span>{UI_MESSAGES.pngNotice}</span>
            </div>
          )}
        </div>

        {/* Quality Slider & Max Dimension */}
        <div class="md:col-span-5 flex flex-col gap-4">
          {/* Custom Slider */}
          <div class="flex flex-col gap-2 bg-surface-subtle p-4 rounded-md border border-border">
            <div class="flex items-center justify-between text-xs sm:text-sm">
              <span class="font-medium text-text-primary">
                {UI_MESSAGES.customQuality}
              </span>
              <span class="font-bold text-accent text-base">
                {quality}%
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="95"
              step="1"
              value={quality}
              disabled={disabled}
              onInput={(e) =>
                onQualityChange(parseInt((e.target as HTMLInputElement).value, 10))
              }
              aria-label={UI_MESSAGES.customQuality}
              aria-valuemin={15}
              aria-valuemax={95}
              aria-valuenow={quality}
              aria-valuetext={`${quality}%`}
              class="w-full accent-accent h-2 bg-border rounded-md cursor-pointer disabled:cursor-not-allowed"
            />
            <div class="flex justify-between text-text-secondary text-[11px] px-0.5">
              <span>{UI_MESSAGES.minSize}</span>
              <span>{UI_MESSAGES.maxQuality}</span>
            </div>
          </div>

          {/* Max Dimension Dropdown */}
          <div class="flex flex-col gap-1.5">
            <label
              htmlFor="max-dimension-select"
              class="text-xs sm:text-sm font-semibold text-text-primary"
            >
              {UI_MESSAGES.maxDimensionLabel}
            </label>
            <div class="relative">
              <select
                id="max-dimension-select"
                disabled={disabled}
                value={maxDimension !== null ? String(maxDimension) : ''}
                onChange={(e) => {
                  const val = (e.target as HTMLSelectElement).value;
                  onMaxDimensionChange(val ? (parseInt(val, 10) as AllowedMaxDimension) : null);
                }}
                class="w-full p-2.5 rounded-md border border-border bg-surface text-text-primary text-xs sm:text-sm appearance-none outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="">{UI_MESSAGES.maxDimensionOriginal}</option>
                {ALLOWED_MAX_DIMENSIONS.map((dim) => (
                  <option key={dim} value={String(dim)}>
                    {dim} بكسل
                  </option>
                ))}
              </select>
            </div>
            <p class="text-[11px] text-text-secondary">
              {UI_MESSAGES.maxDimensionHelper}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
