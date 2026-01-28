import { describe, expect, it } from 'vitest';
import { formatTimeForSpeech } from '../../src/hooks/useSpeech';

describe('formatTimeForSpeech', () => {
  describe("o'clock times", () => {
    it('should say "X o\'clock" for times on the hour', () => {
      expect(formatTimeForSpeech(3, 0, 'PM')).toBe("3 o'clock PM");
      expect(formatTimeForSpeech(12, 0, 'AM')).toBe("12 o'clock AM");
      expect(formatTimeForSpeech(1, 0, 'PM')).toBe("1 o'clock PM");
    });
  });

  describe('quarter past times', () => {
    it('should say "quarter past X" for 15 minutes', () => {
      expect(formatTimeForSpeech(4, 15, 'AM')).toBe('quarter past 4 AM');
      expect(formatTimeForSpeech(9, 15, 'PM')).toBe('quarter past 9 PM');
    });
  });

  describe('half past times', () => {
    it('should say "half past X" for 30 minutes', () => {
      expect(formatTimeForSpeech(7, 30, 'PM')).toBe('half past 7 PM');
      expect(formatTimeForSpeech(11, 30, 'AM')).toBe('half past 11 AM');
    });
  });

  describe('quarter to times', () => {
    it('should say "quarter to X" for 45 minutes', () => {
      expect(formatTimeForSpeech(8, 45, 'AM')).toBe('quarter to 9 AM');
      expect(formatTimeForSpeech(3, 45, 'PM')).toBe('quarter to 4 PM');
    });

    it('should handle 12 rolling over to 1 for quarter to', () => {
      expect(formatTimeForSpeech(12, 45, 'PM')).toBe('quarter to 1 PM');
      expect(formatTimeForSpeech(12, 45, 'AM')).toBe('quarter to 1 AM');
    });
  });

  describe('minutes past times', () => {
    it('should say "X minutes past Y" for times before half hour', () => {
      expect(formatTimeForSpeech(5, 10, 'AM')).toBe('10 minutes past 5 AM');
      expect(formatTimeForSpeech(2, 5, 'PM')).toBe('5 minutes past 2 PM');
      expect(formatTimeForSpeech(8, 20, 'AM')).toBe('20 minutes past 8 AM');
      expect(formatTimeForSpeech(6, 25, 'PM')).toBe('25 minutes past 6 PM');
    });
  });

  describe('minutes to times', () => {
    it('should say "X minutes to Y" for times after half hour', () => {
      expect(formatTimeForSpeech(6, 50, 'PM')).toBe('10 minutes to 7 PM');
      expect(formatTimeForSpeech(4, 55, 'AM')).toBe('5 minutes to 5 AM');
      expect(formatTimeForSpeech(9, 35, 'PM')).toBe('25 minutes to 10 PM');
      expect(formatTimeForSpeech(10, 40, 'AM')).toBe('20 minutes to 11 AM');
    });

    it('should handle 12 rolling over to 1 for minutes to', () => {
      expect(formatTimeForSpeech(12, 50, 'PM')).toBe('10 minutes to 1 PM');
      expect(formatTimeForSpeech(12, 55, 'AM')).toBe('5 minutes to 1 AM');
    });
  });
});
