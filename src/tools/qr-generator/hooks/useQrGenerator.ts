import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "preact/hooks";
import {
  normalizeUrl,
  generateQrCode,
  downloadPng,
  downloadSvg,
  dataUrlToBlob,
  QR_SIZES,
  DEFAULT_QR_SIZE,
  type QrSizeKey,
  type QrGenerationResult,
} from "../../../utils/qrGenerator";
import {
  restoreTextParam,
  syncTextParam,
  copyImageToClipboard,
} from "../../../utils/stateSync";
import type { UseQrGeneratorReturn, CopyState } from "../types";

const TOOL_SLUG = "qr-generator";
const PARAM_KEY = "url";
const COPY_FEEDBACK_DURATION_MS = 2000;

export function useQrGenerator(): UseQrGeneratorReturn {
  const [urlInput, setUrlInput] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<QrSizeKey>(DEFAULT_QR_SIZE);
  const [qrResult, setQrResult] = useState<QrGenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derive validation and normalized URL
  const normalizedUrl = useMemo(() => normalizeUrl(urlInput), [urlInput]);
  const isValid = Boolean(normalizedUrl);
  const sizeConfig = QR_SIZES[selectedSize];

  // 1. Initial State Restoration: URL search param -> LocalStorage -> empty default
  useEffect(() => {
    const { value: restoredUrl } = restoreTextParam(TOOL_SLUG, PARAM_KEY, "");
    if (restoredUrl) {
      setUrlInput(restoredUrl);
    }

    // Also check for saved size preference in localStorage
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const saved = window.localStorage.getItem(`ahaad_tool_${TOOL_SLUG}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.size && parsed.size in QR_SIZES) {
            setSelectedSize(parsed.size as QrSizeKey);
          }
        }
      } catch {
        // Ignore JSON or localStorage errors
      }
    }

    setIsInitialized(true);
  }, []);

  // 2. Synchronize URL and LocalStorage whenever input changes
  useEffect(() => {
    if (!isInitialized) return;

    syncTextParam(TOOL_SLUG, PARAM_KEY, urlInput, {
      size: selectedSize,
    });
  }, [urlInput, selectedSize, isInitialized]);

  // 3. Generate QR code automatically when normalizedUrl or size changes
  useEffect(() => {
    if (!normalizedUrl) {
      setQrResult(null);
      setIsGenerating(false);
      return;
    }

    let isCurrent = true;
    setIsGenerating(true);

    generateQrCode(normalizedUrl, sizeConfig.dimension)
      .then((res) => {
        if (isCurrent) {
          setQrResult(res);
          setIsGenerating(false);
        }
      })
      .catch((err) => {
        if (isCurrent) {
          console.error("Failed to generate QR code:", err);
          setQrResult(null);
          setIsGenerating(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [normalizedUrl, sizeConfig.dimension]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleUrlChange = useCallback((value: string) => {
    setUrlInput(value);
  }, []);

  const handleSizeChange = useCallback((size: QrSizeKey) => {
    setSelectedSize(size);
  }, []);

  const handleDownloadPng = useCallback(() => {
    if (!qrResult) return;
    const filename = `ahaad-qr-${sizeConfig.dimension}x${sizeConfig.dimension}.png`;
    downloadPng(qrResult.dataUrl, filename);
  }, [qrResult, sizeConfig.dimension]);

  const handleDownloadSvg = useCallback(() => {
    if (!qrResult) return;
    const filename = `ahaad-qr-${sizeConfig.dimension}x${sizeConfig.dimension}.svg`;
    downloadSvg(qrResult.svg, filename);
  }, [qrResult, sizeConfig.dimension]);

  const handleCopyQr = useCallback(async () => {
    if (!qrResult) return;

    try {
      const blob = await dataUrlToBlob(qrResult.dataUrl);
      const success = await copyImageToClipboard(blob);

      if (success) {
        console.log('fuck')
        setCopyState("copied");
        if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
        copyTimerRef.current = setTimeout(() => {
          setCopyState("idle");
        }, COPY_FEEDBACK_DURATION_MS);
      } else {
        setCopyState("error");
        if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
        copyTimerRef.current = setTimeout(() => {
          setCopyState("idle");
        }, COPY_FEEDBACK_DURATION_MS);
      }
    } catch {
      setCopyState("error");
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => {
        setCopyState("idle");
      }, COPY_FEEDBACK_DURATION_MS);
    }
  }, [qrResult]);

  return {
    urlInput,
    normalizedUrl,
    isValid,
    selectedSize,
    sizeConfig,
    qrResult,
    isGenerating,
    copyState,
    handleUrlChange,
    handleSizeChange,
    handleDownloadPng,
    handleDownloadSvg,
    handleCopyQr,
  };
}
