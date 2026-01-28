import { useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';

// Check if speech synthesis is supported
const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * Pure function to format time as spoken text (12-hour format).
 * Extracted for testability.
 */
export function formatTimeForSpeech(hours: number, minutes: number, period: 'AM' | 'PM'): string {
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

/**
 * Pure function to format time as spoken text (24-hour/military format).
 * E.g., 15:00 → "fifteen hundred", 09:30 → "oh nine thirty"
 */
export function formatTime24ForSpeech(hours: number, minutes: number, period: 'AM' | 'PM'): string {
  // Convert 12h to 24h
  let hour24 = hours;
  if (period === 'PM' && hours !== 12) hour24 = hours + 12;
  if (period === 'AM' && hours === 12) hour24 = 0;

  // Format hour word
  const hourWords: Record<number, string> = {
    0: 'zero',
    1: 'oh one',
    2: 'oh two',
    3: 'oh three',
    4: 'oh four',
    5: 'oh five',
    6: 'oh six',
    7: 'oh seven',
    8: 'oh eight',
    9: 'oh nine',
    10: 'ten',
    11: 'eleven',
    12: 'twelve',
    13: 'thirteen',
    14: 'fourteen',
    15: 'fifteen',
    16: 'sixteen',
    17: 'seventeen',
    18: 'eighteen',
    19: 'nineteen',
    20: 'twenty',
    21: 'twenty one',
    22: 'twenty two',
    23: 'twenty three',
  };

  const hourWord = hourWords[hour24] || String(hour24);

  if (minutes === 0) {
    return `${hourWord} hundred hours`;
  }

  // Format minutes
  const minuteWords: Record<number, string> = {
    1: 'oh one',
    2: 'oh two',
    3: 'oh three',
    4: 'oh four',
    5: 'oh five',
    6: 'oh six',
    7: 'oh seven',
    8: 'oh eight',
    9: 'oh nine',
  };

  const minuteWord = minuteWords[minutes] || String(minutes);

  return `${hourWord} ${minuteWord}`;
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
          (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria'))
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

  const speakTime24 = useCallback(
    (hours: number, minutes: number, period: 'AM' | 'PM') => {
      const timeText = formatTime24ForSpeech(hours, minutes, period);
      speak(timeText);
    },
    [speak]
  );

  return { speak, speakTime, speakTime24 };
}
