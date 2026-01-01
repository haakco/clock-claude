import { useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';

// Check if speech synthesis is supported
const isSpeechSupported =
  typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * Pure function to format time as spoken text.
 * Extracted for testability.
 */
export function formatTimeForSpeech(
  hours: number,
  minutes: number,
  period: 'AM' | 'PM'
): string {
  let timeText = '';

  if (minutes === 0) {
    timeText = `${hours} o'clock`;
  } else if (minutes === 15) {
    timeText = `quarter past ${hours}`;
  } else if (minutes === 30) {
    timeText = `half past ${hours}`;
  } else if (minutes === 45) {
    const nextHour = hours === 12 ? 1 : hours + 1;
    timeText = `quarter to ${nextHour}`;
  } else if (minutes < 30) {
    timeText = `${minutes} minutes past ${hours}`;
  } else {
    const minutesTo = 60 - minutes;
    const nextHour = hours === 12 ? 1 : hours + 1;
    timeText = `${minutesTo} minutes to ${nextHour}`;
  }

  return `${timeText} ${period}`;
}

export function useSpeech() {
  const soundEnabled = useGameStore((state) => state.soundEnabled);

  const speak = useCallback(
    (text: string) => {
      if (!soundEnabled || !isSpeechSupported) return;

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // Slower for kids
      utterance.pitch = 1.1; // Slightly higher pitch, friendlier
      utterance.volume = 1;

      // Try to find a friendly voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Female') ||
            v.name.includes('Samantha') ||
            v.name.includes('Victoria'))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      speechSynthesis.speak(utterance);
    },
    [soundEnabled]
  );

  const speakTime = useCallback(
    (hours: number, minutes: number, period: 'AM' | 'PM') => {
      const timeText = formatTimeForSpeech(hours, minutes, period);
      speak(timeText);
    },
    [speak]
  );

  return { speak, speakTime };
}
