import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Download, Loader2, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { KOKORO_MODEL_SIZE_MB } from '../../hooks/useKokoroTTS';
import { useSpeech } from '../../hooks/useSpeech';
import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';
import { Tooltip } from '../ui/Tooltip';

interface DownloadModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  progress: number;
}

function DownloadModal({ isOpen, onConfirm, onCancel, isLoading, progress }: DownloadModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div
          className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading ? (
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">Downloading Better Voice</h3>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">{progress}% complete</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <Download className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                <h3 className="text-lg font-bold text-gray-800">Download Better Voice?</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4 text-center">
                Get a friendlier, more natural voice for the clock! This download is about{' '}
                <strong>{KOKORO_MODEL_SIZE_MB}MB</strong> and only needs to happen once.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  onClick={onCancel}
                >
                  Not Now
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  onClick={onConfirm}
                >
                  Download
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function VoiceQualityToggle() {
  const {
    kokoroAvailable,
    kokoroDownloaded,
    kokoroLoading,
    kokoroProgress,
    kokoroError,
    loadKokoro,
  } = useSpeech();
  const [showModal, setShowModal] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;

  // One-shot guard to prevent infinite auto-load retry loop
  const autoLoadAttemptedRef = useRef(false);

  // Auto-load Kokoro if already downloaded (one-shot, stops on error)
  useEffect(() => {
    if (
      kokoroDownloaded &&
      !kokoroAvailable &&
      !kokoroLoading &&
      !kokoroError &&
      !autoLoadAttemptedRef.current
    ) {
      autoLoadAttemptedRef.current = true;
      loadKokoro();
    }
  }, [kokoroDownloaded, kokoroAvailable, kokoroLoading, kokoroError, loadKokoro]);

  const handleClick = () => {
    if (kokoroError) {
      // Allow retry on error - reset the one-shot guard
      autoLoadAttemptedRef.current = false;
      loadKokoro();
    } else if (!kokoroDownloaded && !kokoroLoading) {
      // Not downloaded - show confirmation modal
      setShowModal(true);
    }
    // If already downloaded/available, do nothing - it auto-loads
  };

  const handleConfirmDownload = async () => {
    setShowModal(false);
    await loadKokoro();
  };

  const handleCancelDownload = () => {
    setShowModal(false);
  };

  // Determine icon and tooltip based on state
  let Icon = Download;
  let tooltip = 'Download better voice';
  let isSpinning = false;

  if (kokoroLoading) {
    Icon = Loader2;
    tooltip = 'Downloading better voice...';
    isSpinning = true;
  } else if (kokoroError) {
    Icon = AlertCircle;
    tooltip = `Error: ${kokoroError}. Click to retry.`;
  } else if (kokoroAvailable) {
    Icon = Sparkles;
    tooltip = 'Better voice active';
  } else if (kokoroDownloaded) {
    Icon = Loader2;
    tooltip = 'Loading better voice...';
    isSpinning = true;
  }

  // Show sparkles when active (non-interactive)
  if (kokoroAvailable) {
    return (
      <Tooltip content={tooltip}>
        <motion.div
          className="p-2 rounded-full text-white"
          style={{ background: `${colors.accent}50` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Sparkles size={24} style={{ color: colors.accent }} />
        </motion.div>
      </Tooltip>
    );
  }

  // Button is disabled only while actively loading (not on error or when downloaded but failed)
  const isDisabled = kokoroLoading || (kokoroDownloaded && !kokoroError && !kokoroAvailable);

  return (
    <>
      <Tooltip content={tooltip}>
        <motion.button
          className="p-2 rounded-full text-white bg-white/20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClick}
          disabled={isDisabled}
        >
          <Icon size={24} className={isSpinning ? 'animate-spin' : ''} />
        </motion.button>
      </Tooltip>

      <DownloadModal
        isOpen={showModal || kokoroLoading}
        onConfirm={handleConfirmDownload}
        onCancel={handleCancelDownload}
        isLoading={kokoroLoading}
        progress={kokoroProgress}
      />
    </>
  );
}
