import { describe, expect, it } from 'vitest';
import { timeToWords, wordsToTime } from '../../src/utils/timeToWords';

describe('timeToWords', () => {
  describe('deterministic behavior', () => {
    it('returns the same result for multiple calls with the same input', () => {
      // Test that the function is deterministic for SSR/hydration consistency
      const input = { hours: 3, minutes: 15, period: 'PM' as const };
      const results = Array.from({ length: 10 }, () => timeToWords(input));

      // All results should be identical
      const firstResult = results[0];
      for (const result of results) {
        expect(result).toBe(firstResult);
      }
    });

    it('is deterministic across different time values', () => {
      const testCases = [
        { hours: 12, minutes: 0, period: 'AM' as const },
        { hours: 6, minutes: 30, period: 'PM' as const },
        { hours: 9, minutes: 45, period: 'AM' as const },
        { hours: 2, minutes: 20, period: 'PM' as const },
      ];

      for (const input of testCases) {
        const results = Array.from({ length: 5 }, () => timeToWords(input));
        const firstResult = results[0];
        for (const result of results) {
          expect(result).toBe(firstResult);
        }
      }
    });
  });

  describe("o'clock times", () => {
    it('converts 3:00 to one of the valid phrases', () => {
      const validPhrases = [
        "three o'clock",
        'exactly three',
        'three on the dot',
        "precisely three o'clock",
      ];
      const result = timeToWords({ hours: 3, minutes: 0, period: 'PM' });
      expect(validPhrases).toContain(result);
    });

    it('converts 12:00 to one of the valid phrases', () => {
      const validPhrases = [
        "twelve o'clock",
        'exactly twelve',
        'twelve on the dot',
        "precisely twelve o'clock",
      ];
      const result = timeToWords({ hours: 12, minutes: 0, period: 'AM' });
      expect(validPhrases).toContain(result);
    });
  });

  describe('quarter past', () => {
    it('converts 3:15 to one of the valid phrases', () => {
      const validPhrases = [
        'quarter past three',
        'a quarter after three',
        'fifteen past three',
        'three fifteen',
      ];
      const result = timeToWords({ hours: 3, minutes: 15, period: 'PM' });
      expect(validPhrases).toContain(result);
    });

    it('converts 12:15 to one of the valid phrases', () => {
      const validPhrases = [
        'quarter past twelve',
        'a quarter after twelve',
        'fifteen past twelve',
        'twelve fifteen',
      ];
      const result = timeToWords({ hours: 12, minutes: 15, period: 'AM' });
      expect(validPhrases).toContain(result);
    });
  });

  describe('half past', () => {
    it('converts 3:30 to one of the valid phrases', () => {
      const validPhrases = [
        'half past three',
        'three thirty',
        'thirty past three',
        'halfway past three',
      ];
      const result = timeToWords({ hours: 3, minutes: 30, period: 'PM' });
      expect(validPhrases).toContain(result);
    });

    it('converts 12:30 to one of the valid phrases', () => {
      const validPhrases = [
        'half past twelve',
        'twelve thirty',
        'thirty past twelve',
        'halfway past twelve',
      ];
      const result = timeToWords({ hours: 12, minutes: 30, period: 'AM' });
      expect(validPhrases).toContain(result);
    });
  });

  describe('quarter to', () => {
    it('converts 3:45 to one of the valid phrases', () => {
      const validPhrases = [
        'quarter to four',
        'a quarter before four',
        'fifteen to four',
        'three forty-five',
      ];
      const result = timeToWords({ hours: 3, minutes: 45, period: 'PM' });
      expect(validPhrases).toContain(result);
    });

    it('converts 12:45 to one of the valid phrases', () => {
      const validPhrases = [
        'quarter to one',
        'a quarter before one',
        'fifteen to one',
        'twelve forty-five',
      ];
      const result = timeToWords({ hours: 12, minutes: 45, period: 'AM' });
      expect(validPhrases).toContain(result);
    });
  });

  describe('minutes past', () => {
    it('converts 3:05 to one of the valid phrases', () => {
      const validPhrases = ['five past three', 'five after three', 'three five'];
      const result = timeToWords({ hours: 3, minutes: 5, period: 'PM' });
      expect(validPhrases).toContain(result);
    });

    it('converts 3:10 to one of the valid phrases', () => {
      const validPhrases = ['ten past three', 'ten after three', 'three ten'];
      const result = timeToWords({ hours: 3, minutes: 10, period: 'PM' });
      expect(validPhrases).toContain(result);
    });

    it('converts 3:20 to one of the valid phrases', () => {
      const validPhrases = ['twenty past three', 'twenty after three', 'three twenty'];
      const result = timeToWords({ hours: 3, minutes: 20, period: 'PM' });
      expect(validPhrases).toContain(result);
    });

    it('converts 3:25 to one of the valid phrases', () => {
      const validPhrases = [
        'twenty-five past three',
        'twenty-five after three',
        'three twenty five',
      ];
      const result = timeToWords({ hours: 3, minutes: 25, period: 'PM' });
      expect(validPhrases).toContain(result);
    });
  });

  describe('minutes to', () => {
    it('converts 3:55 to one of the valid phrases', () => {
      const validPhrases = ['five to four', 'five before four', 'five until four'];
      const result = timeToWords({ hours: 3, minutes: 55, period: 'PM' });
      expect(validPhrases).toContain(result);
    });

    it('converts 3:50 to one of the valid phrases', () => {
      const validPhrases = ['ten to four', 'ten before four', 'ten until four'];
      const result = timeToWords({ hours: 3, minutes: 50, period: 'PM' });
      expect(validPhrases).toContain(result);
    });

    it('converts 3:40 to one of the valid phrases', () => {
      const validPhrases = ['twenty to four', 'twenty before four', 'twenty until four'];
      const result = timeToWords({ hours: 3, minutes: 40, period: 'PM' });
      expect(validPhrases).toContain(result);
    });

    it('converts 3:35 to one of the valid phrases', () => {
      const validPhrases = [
        'twenty-five to four',
        'twenty-five before four',
        'twenty-five until four',
      ];
      const result = timeToWords({ hours: 3, minutes: 35, period: 'PM' });
      expect(validPhrases).toContain(result);
    });
  });
});

describe('wordsToTime', () => {
  it('parses "three o\'clock"', () => {
    const result = wordsToTime("three o'clock");
    expect(result).toEqual({ hours: 3, minutes: 0, period: 'AM' });
  });

  it('parses "quarter past three"', () => {
    const result = wordsToTime('quarter past three');
    expect(result).toEqual({ hours: 3, minutes: 15, period: 'AM' });
  });

  it('parses "half past three"', () => {
    const result = wordsToTime('half past three');
    expect(result).toEqual({ hours: 3, minutes: 30, period: 'AM' });
  });

  it('parses "quarter to four"', () => {
    const result = wordsToTime('quarter to four');
    expect(result).toEqual({ hours: 3, minutes: 45, period: 'AM' });
  });

  it('parses "five past three"', () => {
    const result = wordsToTime('five past three');
    expect(result).toEqual({ hours: 3, minutes: 5, period: 'AM' });
  });

  it('parses "ten to four"', () => {
    const result = wordsToTime('ten to four');
    expect(result).toEqual({ hours: 3, minutes: 50, period: 'AM' });
  });

  it('returns null for invalid input', () => {
    expect(wordsToTime('invalid time')).toBeNull();
  });
});
