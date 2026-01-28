import type { Time } from '../types';

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
 * Pick a deterministic item from an array based on a seed value.
 * This ensures SSR and client hydration produce the same result.
 */
function deterministicPick<T>(arr: T[], seed: number): T {
  // Use a simple hash to get a stable index from the seed
  const index = Math.abs(seed) % arr.length;
  return arr[index];
}

/**
 * Get period phrase based on time of day
 */
function getPeriodPhrase(hours: number, period: 'AM' | 'PM'): string {
  if (period === 'AM') {
    if (hours === 12) return 'at midnight';
    if (hours < 6) return 'at night';
    return 'in the morning';
  }
  if (hours === 12) return 'at noon';
  if (hours < 6) return 'in the afternoon';
  if (hours < 9) return 'in the evening';
  return 'at night';
}

/**
 * Convert a time to English words with variety.
 * Uses deterministic selection based on time value to ensure SSR/hydration consistency.
 */
export function timeToWords(time: Time, includePeriod = false): string {
  const { hours, minutes, period } = time;
  const hourWord = numberWords[hours];
  const periodPhrase = includePeriod ? ` ${getPeriodPhrase(hours, period)}` : '';
  // Create a seed from time components for deterministic phrase selection
  const seed = hours * 100 + minutes + (period === 'PM' ? 1000 : 0);

  // On the hour
  if (minutes === 0) {
    const phrases = [
      `${hourWord} o'clock`,
      `exactly ${hourWord}`,
      `${hourWord} on the dot`,
      `precisely ${hourWord} o'clock`,
    ];
    return deterministicPick(phrases, seed) + periodPhrase;
  }

  // Quarter past
  if (minutes === 15) {
    const phrases = [
      `quarter past ${hourWord}`,
      `a quarter after ${hourWord}`,
      `fifteen past ${hourWord}`,
      `${hourWord} fifteen`,
    ];
    return deterministicPick(phrases, seed) + periodPhrase;
  }

  // Half past
  if (minutes === 30) {
    const phrases = [
      `half past ${hourWord}`,
      `${hourWord} thirty`,
      `thirty past ${hourWord}`,
      `halfway past ${hourWord}`,
    ];
    return deterministicPick(phrases, seed) + periodPhrase;
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
    return deterministicPick(phrases, seed) + periodPhrase;
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
      return deterministicPick(phrases, seed) + periodPhrase;
    }
    return `${minutes} past ${hourWord}${periodPhrase}`;
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
      return deterministicPick(phrases, seed) + periodPhrase;
    }
    return `${minutesTo} to ${nextHourWord}${periodPhrase}`;
  }

  return `${hourWord} ${minutes.toString().padStart(2, '0')}${periodPhrase}`;
}

/**
 * Find the numeric key for a word in numberWords
 */
function wordToNumber(word: string): number | null {
  const entry = Object.entries(numberWords).find(([, w]) => w === word);
  return entry ? parseInt(entry[0], 10) : null;
}

/**
 * Get the previous hour (wrapping 1 to 12)
 */
function getPrevHour(hour: number): number {
  return hour === 1 ? 12 : hour - 1;
}

/**
 * Create a time result with default period
 */
function createTime(hours: number, minutes: number): Time {
  return { hours: hours || 12, minutes, period: 'AM' };
}

type PatternParser = (normalized: string) => Time | null;

/**
 * Parse "X o'clock" pattern
 */
const parseOclock: PatternParser = (normalized) => {
  const match = normalized.match(/^(\w+(?:-\w+)?)\s+o'clock$/);
  if (!match) return null;
  const hour = wordToNumber(match[1]);
  return hour !== null ? createTime(hour, 0) : null;
};

/**
 * Parse "quarter past X" pattern
 */
const parseQuarterPast: PatternParser = (normalized) => {
  const match = normalized.match(/^quarter\s+past\s+(\w+(?:-\w+)?)$/);
  if (!match) return null;
  const hour = wordToNumber(match[1]);
  return hour !== null ? createTime(hour, 15) : null;
};

/**
 * Parse "half past X" pattern
 */
const parseHalfPast: PatternParser = (normalized) => {
  const match = normalized.match(/^half\s+past\s+(\w+(?:-\w+)?)$/);
  if (!match) return null;
  const hour = wordToNumber(match[1]);
  return hour !== null ? createTime(hour, 30) : null;
};

/**
 * Parse "quarter to X" pattern
 */
const parseQuarterTo: PatternParser = (normalized) => {
  const match = normalized.match(/^quarter\s+to\s+(\w+(?:-\w+)?)$/);
  if (!match) return null;
  const hour = wordToNumber(match[1]);
  return hour !== null ? createTime(getPrevHour(hour), 45) : null;
};

/**
 * Parse "X past Y" pattern
 */
const parsePast: PatternParser = (normalized) => {
  const match = normalized.match(/^(\w+(?:-\w+)?)\s+past\s+(\w+(?:-\w+)?)$/);
  if (!match) return null;
  const minute = wordToNumber(match[1]);
  const hour = wordToNumber(match[2]);
  return minute !== null && hour !== null ? createTime(hour, minute) : null;
};

/**
 * Parse "X to Y" pattern
 */
const parseTo: PatternParser = (normalized) => {
  const match = normalized.match(/^(\w+(?:-\w+)?)\s+to\s+(\w+(?:-\w+)?)$/);
  if (!match) return null;
  const minutesTo = wordToNumber(match[1]);
  const hour = wordToNumber(match[2]);
  return minutesTo !== null && hour !== null ? createTime(getPrevHour(hour), 60 - minutesTo) : null;
};

/** All pattern parsers in order of specificity */
const patternParsers: PatternParser[] = [
  parseOclock,
  parseQuarterPast,
  parseHalfPast,
  parseQuarterTo,
  parsePast,
  parseTo,
];

/**
 * Parse time from words (for validation)
 * Returns null if cannot parse
 */
export function wordsToTime(words: string): Time | null {
  const normalized = words.toLowerCase().trim();

  for (const parser of patternParsers) {
    const result = parser(normalized);
    if (result) return result;
  }

  return null;
}
