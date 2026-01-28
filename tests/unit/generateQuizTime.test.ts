import { describe, expect, it } from 'vitest';
import { generateMultipleQuizTimes, generateQuizTime } from '../../src/utils/generateQuizTime';

describe('generateQuizTime', () => {
  describe('easy difficulty', () => {
    it("generates only o'clock times", () => {
      for (let i = 0; i < 20; i++) {
        const time = generateQuizTime('easy');
        expect(time.minutes).toBe(0);
        expect(time.hours).toBeGreaterThanOrEqual(1);
        expect(time.hours).toBeLessThanOrEqual(12);
        expect(['AM', 'PM']).toContain(time.period);
      }
    });
  });

  describe('medium difficulty', () => {
    it('generates only 0, 15, 30, or 45 minute times', () => {
      const validMinutes = [0, 15, 30, 45];
      for (let i = 0; i < 20; i++) {
        const time = generateQuizTime('medium');
        expect(validMinutes).toContain(time.minutes);
        expect(time.hours).toBeGreaterThanOrEqual(1);
        expect(time.hours).toBeLessThanOrEqual(12);
      }
    });
  });

  describe('hard difficulty', () => {
    it('generates any minute from 0-59', () => {
      for (let i = 0; i < 20; i++) {
        const time = generateQuizTime('hard');
        expect(time.minutes).toBeGreaterThanOrEqual(0);
        expect(time.minutes).toBeLessThanOrEqual(59);
        expect(time.hours).toBeGreaterThanOrEqual(1);
        expect(time.hours).toBeLessThanOrEqual(12);
      }
    });
  });
});

describe('generateMultipleQuizTimes', () => {
  it('generates the requested number of unique times', () => {
    const times = generateMultipleQuizTimes('medium', 3);
    expect(times).toHaveLength(3);

    // Check uniqueness (by hour:minute combination)
    const keys = times.map((t) => `${t.hours}:${t.minutes}`);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(3);
  });

  it('generates times matching the difficulty', () => {
    const times = generateMultipleQuizTimes('easy', 5);
    times.forEach((time) => {
      expect(time.minutes).toBe(0);
    });
  });
});
