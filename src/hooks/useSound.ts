import { useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';

type SoundType = 'tick' | 'correct' | 'incorrect' | 'click' | 'whoosh';

// Celebration sound configurations - variety of fun melodies
const CELEBRATION_SOUNDS = [
  // Major arpeggio up (C-E-G-C)
  { notes: [523, 659, 784, 1047], durations: [0.1, 0.1, 0.1, 0.2], delays: [0, 80, 160, 240] },
  // Fanfare (G-C-E-G)
  { notes: [392, 523, 659, 784], durations: [0.08, 0.08, 0.1, 0.25], delays: [0, 60, 120, 200] },
  // Sparkle up (E-G-B-E)
  { notes: [659, 784, 988, 1319], durations: [0.08, 0.08, 0.1, 0.2], delays: [0, 50, 100, 180] },
  // Victory (C-G-C high)
  { notes: [523, 784, 1047], durations: [0.12, 0.12, 0.3], delays: [0, 100, 200] },
  // Twinkle (high notes)
  { notes: [880, 1047, 1319, 1568], durations: [0.06, 0.06, 0.08, 0.2], delays: [0, 40, 80, 140] },
];

// Minimum time between tick sounds (ms)
const TICK_THROTTLE_MS = 150;

export function useSound() {
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastTickTimeRef = useRef<number>(0);
  const celebrationIndexRef = useRef<number>(0);

  // Initialize audio context on first user interaction
  useEffect(() => {
    // Track whether audio has been initialized to prevent race conditions
    let isInitialized = false;
    // Track whether the effect has been cleaned up
    let isCleanedUp = false;

    const initAudio = () => {
      // Prevent initialization after cleanup or if already initialized
      if (isCleanedUp || isInitialized) return;

      isInitialized = true;

      // Remove both listeners once one fires to prevent duplicate initialization
      window.removeEventListener('click', initAudio);
      window.removeEventListener('touchstart', initAudio);

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
    };

    // Don't use { once: true } - we handle removal manually to avoid race conditions
    window.addEventListener('click', initAudio);
    window.addEventListener('touchstart', initAudio);

    return () => {
      isCleanedUp = true;

      // Always attempt to remove listeners (safe even if already removed)
      window.removeEventListener('click', initAudio);
      window.removeEventListener('touchstart', initAudio);

      // Close AudioContext to prevent memory leak
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.2) => {
      if (!soundEnabled || !audioContextRef.current) return;

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Softer attack and decay for pleasant sounds
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    },
    [soundEnabled]
  );

  // Play a gentle "pop" sound using noise burst
  const playPop = useCallback(() => {
    if (!soundEnabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Use triangle wave for softer sound
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(300, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.08);
  }, [soundEnabled]);

  const playSound = useCallback(
    (type: SoundType) => {
      if (!soundEnabled) return;

      switch (type) {
        case 'tick': {
          // Throttle tick sounds to prevent audio overload
          const now = Date.now();
          if (now - lastTickTimeRef.current < TICK_THROTTLE_MS) {
            return;
          }
          lastTickTimeRef.current = now;

          // Soft, gentle tick - like a soft bubble pop
          playPop();
          break;
        }

        case 'correct': {
          // Rotate through celebration sounds for variety
          const celebrationConfig =
            CELEBRATION_SOUNDS[celebrationIndexRef.current % CELEBRATION_SOUNDS.length];
          celebrationIndexRef.current++;

          celebrationConfig.notes.forEach((freq, i) => {
            setTimeout(() => {
              playTone(freq, celebrationConfig.durations[i], 'sine', 0.25);
            }, celebrationConfig.delays[i]);
          });
          break;
        }

        case 'incorrect':
          // Gentle, encouraging "try again" sound (not harsh)
          playTone(350, 0.15, 'sine', 0.15);
          setTimeout(() => playTone(300, 0.2, 'sine', 0.12), 120);
          break;

        case 'click':
          // Soft click
          playTone(500, 0.04, 'sine', 0.15);
          break;

        case 'whoosh': {
          // Smooth swoosh sound
          if (!audioContextRef.current) return;
          const ctx = audioContextRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(500, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);

          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.15);
          break;
        }
      }
    },
    [soundEnabled, playTone, playPop]
  );

  return { playSound };
}
