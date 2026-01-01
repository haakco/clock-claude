import { describe, it, expect } from 'vitest';
import { timeToWords, wordsToTime } from '../../src/utils/timeToWords';

describe('timeToWords', () => {
  describe('o\'clock times', () => {
    it('converts 3:00 to "three o\'clock"', () => {
      expect(timeToWords({ hours: 3, minutes: 0, period: 'PM' })).toBe(
        "three o'clock"
      );
    });

    it('converts 12:00 to "twelve o\'clock"', () => {
      expect(timeToWords({ hours: 12, minutes: 0, period: 'AM' })).toBe(
        "twelve o'clock"
      );
    });
  });

  describe('quarter past', () => {
    it('converts 3:15 to "quarter past three"', () => {
      expect(timeToWords({ hours: 3, minutes: 15, period: 'PM' })).toBe(
        'quarter past three'
      );
    });

    it('converts 12:15 to "quarter past twelve"', () => {
      expect(timeToWords({ hours: 12, minutes: 15, period: 'AM' })).toBe(
        'quarter past twelve'
      );
    });
  });

  describe('half past', () => {
    it('converts 3:30 to "half past three"', () => {
      expect(timeToWords({ hours: 3, minutes: 30, period: 'PM' })).toBe(
        'half past three'
      );
    });

    it('converts 12:30 to "half past twelve"', () => {
      expect(timeToWords({ hours: 12, minutes: 30, period: 'AM' })).toBe(
        'half past twelve'
      );
    });
  });

  describe('quarter to', () => {
    it('converts 3:45 to "quarter to four"', () => {
      expect(timeToWords({ hours: 3, minutes: 45, period: 'PM' })).toBe(
        'quarter to four'
      );
    });

    it('converts 12:45 to "quarter to one"', () => {
      expect(timeToWords({ hours: 12, minutes: 45, period: 'AM' })).toBe(
        'quarter to one'
      );
    });
  });

  describe('minutes past', () => {
    it('converts 3:05 to "five past three"', () => {
      expect(timeToWords({ hours: 3, minutes: 5, period: 'PM' })).toBe(
        'five past three'
      );
    });

    it('converts 3:10 to "ten past three"', () => {
      expect(timeToWords({ hours: 3, minutes: 10, period: 'PM' })).toBe(
        'ten past three'
      );
    });

    it('converts 3:20 to "twenty past three"', () => {
      expect(timeToWords({ hours: 3, minutes: 20, period: 'PM' })).toBe(
        'twenty past three'
      );
    });

    it('converts 3:25 to "twenty-five past three"', () => {
      expect(timeToWords({ hours: 3, minutes: 25, period: 'PM' })).toBe(
        'twenty-five past three'
      );
    });
  });

  describe('minutes to', () => {
    it('converts 3:55 to "five to four"', () => {
      expect(timeToWords({ hours: 3, minutes: 55, period: 'PM' })).toBe(
        'five to four'
      );
    });

    it('converts 3:50 to "ten to four"', () => {
      expect(timeToWords({ hours: 3, minutes: 50, period: 'PM' })).toBe(
        'ten to four'
      );
    });

    it('converts 3:40 to "twenty to four"', () => {
      expect(timeToWords({ hours: 3, minutes: 40, period: 'PM' })).toBe(
        'twenty to four'
      );
    });

    it('converts 3:35 to "twenty-five to four"', () => {
      expect(timeToWords({ hours: 3, minutes: 35, period: 'PM' })).toBe(
        'twenty-five to four'
      );
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
