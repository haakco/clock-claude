// Type declarations for Kokoro TTS loaded from CDN

declare module 'https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm' {
  export class KokoroTTS {
    static from_pretrained(
      modelId: string,
      options?: {
        dtype?: 'fp32' | 'q8';
        device?: 'webgpu' | 'wasm';
        progress_callback?: (progress: { status: string; loaded?: number; total?: number }) => void;
      },
    ): Promise<KokoroTTS>;

    generate(
      text: string,
      options: { voice: string },
    ): Promise<{
      toBlob(): Blob;
    }>;

    list_voices(): string[] | Record<string, unknown> | undefined;
  }
}

// WebGPU types (subset needed for detection)
interface GPU {
  requestAdapter(): Promise<GPUAdapter | null>;
}

// biome-ignore lint/complexity/noBannedTypes: Minimal type for WebGPU detection
type GPUAdapter = {};
