import { Time } from '../types';

const numberWords: Record<number, string> = {
  0: 'twelve',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
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
  21: 'twenty-one',
  22: 'twenty-two',
  23: 'twenty-three',
  24: 'twenty-four',
  25: 'twenty-five',
  26: 'twenty-six',
  27: 'twenty-seven',
  28: 'twenty-eight',
  29: 'twenty-nine',
  30: 'thirty',
};

/**
 * Get the next hour (wrapping 12 to 1)
 */
function getNextHour(hour: number): number {
  return hour === 12 ? 1 : hour + 1;
}

/**
 * Convert a time to English words
 */
export function timeToWords(time: Time): string {
  const { hours, minutes } = time;
  const hourWord = numberWords[hours];

  // On the hour
  if (minutes === 0) {
    return `${hourWord} o'clock`;
  }

  // Quarter past
  if (minutes === 15) {
    return `quarter past ${hourWord}`;
  }

  // Half past
  if (minutes === 30) {
    return `half past ${hourWord}`;
  }

  // Quarter to
  if (minutes === 45) {
    const nextHourWord = numberWords[getNextHour(hours)];
    return `quarter to ${nextHourWord}`;
  }

  // Minutes past (1-30)
  if (minutes > 0 && minutes < 30) {
    const minuteWord = numberWords[minutes];
    if (minuteWord) {
      return `${minuteWord} past ${hourWord}`;
    }
    // For minutes without direct word mapping
    return `${minutes} past ${hourWord}`;
  }

  // Minutes to (31-59)
  if (minutes > 30) {
    const minutesTo = 60 - minutes;
    const nextHourWord = numberWords[getNextHour(hours)];
    const minuteWord = numberWords[minutesTo];
    if (minuteWord) {
      return `${minuteWord} to ${nextHourWord}`;
    }
    return `${minutesTo} to ${nextHourWord}`;
  }

  return `${hourWord} ${minutes.toString().padStart(2, '0')}`;
}

/**
 * Parse time from words (for validation)
 * Returns null if cannot parse
 */
export function wordsToTime(words: string): Time | null {
  const normalized = words.toLowerCase().trim();

  // O'clock pattern
  const oclockMatch = normalized.match(/^(\w+(?:-\w+)?)\s+o'clock$/);
  if (oclockMatch) {
    const hourWord = oclockMatch[1];
    const hour = Object.entries(numberWords).find(
      ([, word]) => word === hourWord
    )?.[0];
    if (hour) {
      return { hours: parseInt(hour) || 12, minutes: 0, period: 'AM' };
    }
  }

  // Quarter past pattern
  const quarterPastMatch = normalized.match(/^quarter\s+past\s+(\w+(?:-\w+)?)$/);
  if (quarterPastMatch) {
    const hourWord = quarterPastMatch[1];
    const hour = Object.entries(numberWords).find(
      ([, word]) => word === hourWord
    )?.[0];
    if (hour) {
      return { hours: parseInt(hour) || 12, minutes: 15, period: 'AM' };
    }
  }

  // Half past pattern
  const halfPastMatch = normalized.match(/^half\s+past\s+(\w+(?:-\w+)?)$/);
  if (halfPastMatch) {
    const hourWord = halfPastMatch[1];
    const hour = Object.entries(numberWords).find(
      ([, word]) => word === hourWord
    )?.[0];
    if (hour) {
      return { hours: parseInt(hour) || 12, minutes: 30, period: 'AM' };
    }
  }

  // Quarter to pattern
  const quarterToMatch = normalized.match(/^quarter\s+to\s+(\w+(?:-\w+)?)$/);
  if (quarterToMatch) {
    const hourWord = quarterToMatch[1];
    const hour = Object.entries(numberWords).find(
      ([, word]) => word === hourWord
    )?.[0];
    if (hour) {
      const prevHour = parseInt(hour) === 1 ? 12 : parseInt(hour) - 1;
      return { hours: prevHour || 12, minutes: 45, period: 'AM' };
    }
  }

  // X past Y pattern
  const pastMatch = normalized.match(/^(\w+(?:-\w+)?)\s+past\s+(\w+(?:-\w+)?)$/);
  if (pastMatch) {
    const minuteWord = pastMatch[1];
    const hourWord = pastMatch[2];
    const minute = Object.entries(numberWords).find(
      ([, word]) => word === minuteWord
    )?.[0];
    const hour = Object.entries(numberWords).find(
      ([, word]) => word === hourWord
    )?.[0];
    if (minute && hour) {
      return {
        hours: parseInt(hour) || 12,
        minutes: parseInt(minute),
        period: 'AM',
      };
    }
  }

  // X to Y pattern
  const toMatch = normalized.match(/^(\w+(?:-\w+)?)\s+to\s+(\w+(?:-\w+)?)$/);
  if (toMatch) {
    const minuteWord = toMatch[1];
    const hourWord = toMatch[2];
    const minutesTo = Object.entries(numberWords).find(
      ([, word]) => word === minuteWord
    )?.[0];
    const hour = Object.entries(numberWords).find(
      ([, word]) => word === hourWord
    )?.[0];
    if (minutesTo && hour) {
      const prevHour = parseInt(hour) === 1 ? 12 : parseInt(hour) - 1;
      return {
        hours: prevHour || 12,
        minutes: 60 - parseInt(minutesTo),
        period: 'AM',
      };
    }
  }

  return null;
}
