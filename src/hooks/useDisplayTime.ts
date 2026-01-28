import { useMemo } from 'react';
import type { Time } from '../types';
import { formatTime12, formatTime24 } from '../utils/timeConversion';
import { timeToWords } from '../utils/timeToWords';

interface DisplayTimeResult {
  displayTime: Time;
  time12: string;
  time24: string;
  words: string;
}

/**
 * Hook to compute display time rounded to 5-minute boundaries
 * with formatted strings for 12h, 24h, and words
 */
export function useDisplayTime(time: Time): DisplayTimeResult {
  const displayTime = useMemo((): Time => {
    const roundedMinute = Math.floor(time.minutes / 5) * 5;
    return { hours: time.hours, minutes: roundedMinute, period: time.period };
  }, [time.hours, time.minutes, time.period]);

  const time12 = formatTime12(displayTime);
  const time24 = formatTime24(displayTime);
  const words = timeToWords(displayTime);

  return { displayTime, time12, time24, words };
}
