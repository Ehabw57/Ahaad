import type { QrSizeKey, QrSizeConfig, QrGenerationResult } from '../../utils/qrGenerator';

export type { QrSizeKey, QrSizeConfig, QrGenerationResult };

export type CopyState = 'idle' | 'copied' | 'error';

export interface UseQrGeneratorReturn {
  urlInput: string;
  normalizedUrl: string | null;
  isValid: boolean;
  selectedSize: QrSizeKey;
  sizeConfig: QrSizeConfig;
  qrResult: QrGenerationResult | null;
  isGenerating: boolean;
  copyState: CopyState;
  handleUrlChange: (value: string) => void;
  handleSizeChange: (size: QrSizeKey) => void;
  handleDownloadPng: () => void;
  handleDownloadSvg: () => void;
  handleCopyQr: () => Promise<void>;
}
