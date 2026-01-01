import { useCallback, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useGameStore } from '../stores/gameStore';

type SoundType = 'tick' | 'correct' | 'incorrect' | 'click';

// We'll use simple oscillator-based sounds instead of audio files
// This avoids needing to bundle audio files

export function useSound() {
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
    };

    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('touchstart', initAudio, { once: true });

    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('touchstart', initAudio);
    };
  }, []);

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = 'sine') => {
      if (!soundEnabled || !audioContextRef.current) return;

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + duration
      );

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    },
    [soundEnabled]
  );

  const playSound = useCallback(
    (type: SoundType) => {
      if (!soundEnabled) return;

      switch (type) {
        case 'tick':
          playTone(800, 0.05, 'square');
          break;
        case 'correct':
          // Happy ascending notes
          playTone(523, 0.15, 'sine'); // C5
          setTimeout(() => playTone(659, 0.15, 'sine'), 100); // E5
          setTimeout(() => playTone(784, 0.2, 'sine'), 200); // G5
          break;
        case 'incorrect':
          // Gentle descending tone
          playTone(400, 0.2, 'sine');
          setTimeout(() => playTone(350, 0.2, 'sine'), 150);
          break;
        case 'click':
          playTone(600, 0.05, 'sine');
          break;
      }
    },
    [soundEnabled, playTone]
  );

  return { playSound };
}

// Placeholder for future Howler.js implementation with actual audio files
export function useSoundWithFiles() {
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const sounds = useRef<Record<SoundType, Howl | null>>({
    tick: null,
    correct: null,
    incorrect: null,
    click: null,
  });

  const playSound = useCallback(
    (type: SoundType) => {
      if (!soundEnabled || !sounds.current[type]) return;
      sounds.current[type]?.play();
    },
    [soundEnabled]
  );

  return { playSound };
}
