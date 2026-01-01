import { Difficulty, Time } from '../types';

/**
 * Generate a random hour (1-12)
 */
function randomHour(): number {
  return Math.floor(Math.random() * 12) + 1;
}

/**
 * Generate a random AM/PM
 */
function randomPeriod(): 'AM' | 'PM' {
  return Math.random() < 0.5 ? 'AM' : 'PM';
}

/**
 * Generate a random time based on difficulty level
 */
export function generateQuizTime(difficulty: Difficulty): Time {
  const hours = randomHour();
  const period = randomPeriod();

  let minutes: number;

  switch (difficulty) {
    case 'easy':
      // O'clock times only (0 minutes)
      minutes = 0;
      break;

    case 'medium': {
      // O'clock, quarter past, half past, quarter to
      // Randomly pick one of: 0, 15, 30, 45
      const mediumOptions = [0, 15, 30, 45];
      minutes = mediumOptions[Math.floor(Math.random() * mediumOptions.length)];
      break;
    }

    case 'hard':
      // Any minute from 0-59
      minutes = Math.floor(Math.random() * 60);
      break;

    default:
      minutes = 0;
  }

  return { hours, minutes, period };
}

/**
 * Generate multiple unique quiz times
 */
export function generateMultipleQuizTimes(
  difficulty: Difficulty,
  count: number
): Time[] {
  const times: Time[] = [];
  const seen = new Set<string>();

  while (times.length < count) {
    const time = generateQuizTime(difficulty);
    const key = `${time.hours}:${time.minutes}`;

    // Avoid duplicate times (ignore AM/PM for uniqueness)
    if (!seen.has(key)) {
      seen.add(key);
      times.push(time);
    }
  }

  return times;
}
