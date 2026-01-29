import { useCallback, useEffect, useRef, useState } from 'react';

// Fixed voice - Sunny (warm & friendly)
const KOKORO_VOICE_ID = 'af_heart';

// Storage key
const STORAGE_KEY_DOWNLOADED = 'kokoro-tts-downloaded';

// Approximate model size for user information
export const KOKORO_MODEL_SIZE_MB = 87;

interface KokoroTTSState {
  isAvailable: boolean;
  isLoading: boolean;
  isDownloaded: boolean;
  loadProgress: number;
  error: string | null;
}

// Global TTS instance to avoid reloading
let kokoroInstance: unknown = null;
let kokoroLoadPromise: Promise<unknown> | null = null;

// Global speaking state to prevent overlapping audio across components
let globalIsSpeaking = false;
let globalAudioElement: HTMLAudioElement | null = null;

/**
 * Check if Kokoro TTS is currently loaded and ready to use.
 * This checks the global instance directly for cross-component consistency.
 */
export function isKokoroReady(): boolean {
  return kokoroInstance !== null;
}

/**
 * Check if Kokoro TTS model is marked as downloaded in localStorage
 */
function isKokoroDownloaded(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY_DOWNLOADED) === 'true';
}

/**
 * Mark Kokoro TTS as downloaded in localStorage
 */
function markKokoroDownloaded(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_DOWNLOADED, 'true');
  }
}

/**
 * Detect optimal device for Kokoro TTS (WebGPU or WASM fallback)
 */
async function detectOptimalDevice(): Promise<'webgpu' | 'wasm'> {
  if (typeof navigator === 'undefined' || !('gpu' in navigator)) {
    return 'wasm';
  }

  try {
    const gpu = navigator.gpu as GPU;
    const adapter = await gpu.requestAdapter();
    return adapter ? 'webgpu' : 'wasm';
  } catch {
    return 'wasm';
  }
}

/**
 * Create progress callback for model loading
 */
function createProgressCallback(
  setState: React.Dispatch<React.SetStateAction<KokoroTTSState>>,
): (progress: { status: string; loaded?: number; total?: number }) => void {
  return (progress) => {
    if (progress.status === 'progress' && progress.total) {
      const percent = Math.round((progress.loaded! / progress.total) * 80) + 10;
      setState((prev) => ({ ...prev, loadProgress: percent }));
    } else if (progress.status === 'done') {
      setState((prev) => ({ ...prev, loadProgress: 95 }));
    }
  };
}

export function useKokoroTTS() {
  const [state, setState] = useState<KokoroTTSState>({
    isAvailable: false,
    isLoading: false,
    isDownloaded: false,
    loadProgress: 0,
    error: null,
  });

  // Track the current blob URL for cleanup
  const currentBlobUrlRef = useRef<string | null>(null);

  // Initialize state from localStorage on mount
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isDownloaded: isKokoroDownloaded(),
      isAvailable: kokoroInstance !== null,
    }));
  }, []);

  /**
   * Load Kokoro TTS model from CDN
   */
  const loadKokoro = useCallback(async (): Promise<boolean> => {
    if (kokoroInstance) {
      setState((prev) => ({ ...prev, isAvailable: true, isDownloaded: true }));
      return true;
    }

    // If already loading, wait for that promise
    if (kokoroLoadPromise) {
      try {
        await kokoroLoadPromise;
        return kokoroInstance !== null;
      } catch {
        return false;
      }
    }

    setState((prev) => ({ ...prev, isLoading: true, loadProgress: 0, error: null }));

    kokoroLoadPromise = (async () => {
      try {
        // Dynamically import Kokoro from CDN
        const { KokoroTTS } = await import(
          /* @vite-ignore */
          'https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm'
        );

        setState((prev) => ({ ...prev, loadProgress: 10 }));

        const device = await detectOptimalDevice();

        // Load the model
        kokoroInstance = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
          dtype: device === 'webgpu' ? 'fp32' : 'q8',
          device,
          progress_callback: createProgressCallback(setState),
        });

        markKokoroDownloaded();
        setState((prev) => ({
          ...prev,
          isAvailable: true,
          isDownloaded: true,
          isLoading: false,
          loadProgress: 100,
        }));

        return kokoroInstance;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load Kokoro TTS';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
          loadProgress: 0,
        }));
        kokoroLoadPromise = null;
        throw error;
      }
    })();

    try {
      await kokoroLoadPromise;
      return true;
    } catch {
      return false;
    }
  }, []);

  /**
   * Generate and play speech using Kokoro TTS with Sunny voice.
   * Uses global speaking state to prevent overlapping audio across components.
   */
  const speak = useCallback(async (text: string): Promise<boolean> => {
    if (!kokoroInstance || globalIsSpeaking) {
      return false;
    }

    globalIsSpeaking = true;

    try {
      // Generate audio with Sunny voice
      const tts = kokoroInstance as {
        generate: (text: string, options: { voice: string }) => Promise<{ toBlob: () => Blob }>;
      };
      const audio = await tts.generate(text, { voice: KOKORO_VOICE_ID });

      // Create blob and play
      const blob = audio.toBlob();
      const url = URL.createObjectURL(blob);
      currentBlobUrlRef.current = url;

      // Clean up previous global audio
      if (globalAudioElement) {
        globalAudioElement.pause();
      }

      // Create new audio element
      globalAudioElement = new Audio(url);

      await new Promise<void>((resolve, reject) => {
        if (!globalAudioElement) {
          reject(new Error('Audio element not created'));
          return;
        }

        globalAudioElement.onended = () => {
          globalIsSpeaking = false;
          // Revoke blob URL to prevent memory leak
          if (currentBlobUrlRef.current) {
            URL.revokeObjectURL(currentBlobUrlRef.current);
            currentBlobUrlRef.current = null;
          }
          resolve();
        };

        globalAudioElement.onerror = () => {
          globalIsSpeaking = false;
          // Revoke blob URL on error too
          if (currentBlobUrlRef.current) {
            URL.revokeObjectURL(currentBlobUrlRef.current);
            currentBlobUrlRef.current = null;
          }
          reject(new Error('Audio playback failed'));
        };

        globalAudioElement.play().catch(reject);
      });

      return true;
    } catch (_error) {
      globalIsSpeaking = false;
      return false;
    }
  }, []);

  /**
   * Stop current speech
   */
  const stop = useCallback(() => {
    if (globalAudioElement) {
      globalAudioElement.pause();
      globalAudioElement.currentTime = 0;
    }
    globalIsSpeaking = false;
    // Clean up blob URL
    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current);
      currentBlobUrlRef.current = null;
    }
  }, []);

  // Cleanup blob URL on unmount (global audio is shared, so don't stop it)
  useEffect(() => {
    return () => {
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
        currentBlobUrlRef.current = null;
      }
    };
  }, []);

  return {
    ...state,
    loadKokoro,
    speak,
    stop,
  };
}
