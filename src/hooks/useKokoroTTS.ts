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

export function useKokoroTTS() {
  const [state, setState] = useState<KokoroTTSState>({
    isAvailable: false,
    isLoading: false,
    isDownloaded: false,
    loadProgress: 0,
    error: null,
  });

  const isSpeakingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

        // Check WebGPU availability for optimal performance
        let device: 'webgpu' | 'wasm' = 'wasm';
        if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
          try {
            const gpu = navigator.gpu as GPU;
            const adapter = await gpu.requestAdapter();
            if (adapter) {
              device = 'webgpu';
            }
          } catch {
            // WebGPU not available, use WASM
          }
        }

        // Load the model
        kokoroInstance = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
          dtype: device === 'webgpu' ? 'fp32' : 'q8',
          device,
          progress_callback: (progress: { status: string; loaded?: number; total?: number }) => {
            if (progress.status === 'progress' && progress.total) {
              const percent = Math.round((progress.loaded! / progress.total) * 80) + 10;
              setState((prev) => ({ ...prev, loadProgress: percent }));
            } else if (progress.status === 'done') {
              setState((prev) => ({ ...prev, loadProgress: 95 }));
            }
          },
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
   * Generate and play speech using Kokoro TTS with Sunny voice
   */
  const speak = useCallback(async (text: string): Promise<boolean> => {
    if (!kokoroInstance || isSpeakingRef.current) {
      return false;
    }

    isSpeakingRef.current = true;

    try {
      // Generate audio with Sunny voice
      const tts = kokoroInstance as {
        generate: (text: string, options: { voice: string }) => Promise<{ toBlob: () => Blob }>;
      };
      const audio = await tts.generate(text, { voice: KOKORO_VOICE_ID });

      // Create blob and play
      const blob = audio.toBlob();
      const url = URL.createObjectURL(blob);

      // Clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src);
        }
      }

      // Create new audio element
      audioRef.current = new Audio(url);

      await new Promise<void>((resolve, reject) => {
        if (!audioRef.current) {
          reject(new Error('Audio element not created'));
          return;
        }

        audioRef.current.onended = () => {
          isSpeakingRef.current = false;
          resolve();
        };

        audioRef.current.onerror = () => {
          isSpeakingRef.current = false;
          reject(new Error('Audio playback failed'));
        };

        audioRef.current.play().catch(reject);
      });

      return true;
    } catch (_error) {
      isSpeakingRef.current = false;
      return false;
    }
  }, []);

  /**
   * Stop current speech
   */
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    isSpeakingRef.current = false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src);
        }
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
