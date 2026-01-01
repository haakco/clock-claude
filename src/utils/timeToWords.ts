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
 * Pick a random item from an array
 */
function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Get period phrase based on time of day
 */
function getPeriodPhrase(hours: number, period: 'AM' | 'PM'): string {
  if (period === 'AM') {
    if (hours === 12) return 'at midnight';
    if (hours < 6) return 'at night';
    return 'in the morning';
  } else {
    if (hours === 12) return 'at noon';
    if (hours < 6) return 'in the afternoon';
    if (hours < 9) return 'in the evening';
    return 'at night';
  }
}

/**
 * Convert a time to English words with random variety
 */
export function timeToWords(time: Time, includePeriod = false): string {
  const { hours, minutes, period } = time;
  const hourWord = numberWords[hours];
  const periodPhrase = includePeriod ? ` ${getPeriodPhrase(hours, period)}` : '';

  // On the hour
  if (minutes === 0) {
    const phrases = [
      `${hourWord} o'clock`,
      `exactly ${hourWord}`,
      `${hourWord} on the dot`,
      `precisely ${hourWord} o'clock`,
    ];
    return randomPick(phrases) + periodPhrase;
  }

  // Quarter past
  if (minutes === 15) {
    const phrases = [
      `quarter past ${hourWord}`,
      `a quarter after ${hourWord}`,
      `fifteen past ${hourWord}`,
      `${hourWord} fifteen`,
    ];
    return randomPick(phrases) + periodPhrase;
  }

  // Half past
  if (minutes === 30) {
    const phrases = [
      `half past ${hourWord}`,
      `${hourWord} thirty`,
      `thirty past ${hourWord}`,
      `halfway past ${hourWord}`,
    ];
    return randomPick(phrases) + periodPhrase;
  }

  // Quarter to
  if (minutes === 45) {
    const nextHourWord = numberWords[getNextHour(hours)];
    const phrases = [
      `quarter to ${nextHourWord}`,
      `a quarter before ${nextHourWord}`,
      `fifteen to ${nextHourWord}`,
      `${hourWord} forty-five`,
    ];
    return randomPick(phrases) + periodPhrase;
  }

  // Minutes past (1-30)
  if (minutes > 0 && minutes < 30) {
    const minuteWord = numberWords[minutes];
    if (minuteWord) {
      const phrases = [
        `${minuteWord} past ${hourWord}`,
        `${minuteWord} after ${hourWord}`,
        `${hourWord} ${minuteWord.replace('-', ' ')}`,
      ];
      return randomPick(phrases) + periodPhrase;
    }
    return `${minutes} past ${hourWord}` + periodPhrase;
  }

  // Minutes to (31-59)
  if (minutes > 30) {
    const minutesTo = 60 - minutes;
    const nextHourWord = numberWords[getNextHour(hours)];
    const minuteWord = numberWords[minutesTo];
    if (minuteWord) {
      const phrases = [
        `${minuteWord} to ${nextHourWord}`,
        `${minuteWord} before ${nextHourWord}`,
        `${minuteWord} until ${nextHourWord}`,
      ];
      return randomPick(phrases) + periodPhrase;
    }
    return `${minutesTo} to ${nextHourWord}` + periodPhrase;
  }

  return `${hourWord} ${minutes.toString().padStart(2, '0')}` + periodPhrase;
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
