/** @jsxImportSource preact */
import UrlInputSection from './components/UrlInputSection';
import QrPreviewSection from './components/QrPreviewSection';
import { useQrGenerator } from './hooks/useQrGenerator';

export default function QrGenerator() {
  const qr = useQrGenerator();

  return (
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full">
      <div class="lg:col-span-7 w-full">
        <UrlInputSection
          urlInput={qr.urlInput}
          isValid={qr.isValid}
          selectedSize={qr.selectedSize}
          sizeConfig={qr.sizeConfig}
          onUrlChange={qr.handleUrlChange}
          onSizeChange={qr.handleSizeChange}
        />
      </div>

      <div class="lg:col-span-5 w-full">
        <QrPreviewSection
          qrResult={qr.qrResult}
          sizeConfig={qr.sizeConfig}
          copyState={qr.copyState}
          onDownloadPng={qr.handleDownloadPng}
          onDownloadSvg={qr.handleDownloadSvg}
          onCopyQr={qr.handleCopyQr}
        />
      </div>
    </div>
  );
}
