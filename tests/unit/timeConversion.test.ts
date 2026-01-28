import { describe, expect, it } from 'vitest';
import {
  angleToMinute,
  formatTime12,
  formatTime24,
  hourToAngle,
  minuteToAngle,
  timesEqual,
  to12Hour,
  to24Hour,
} from '../../src/utils/timeConversion';

describe('timeConversion', () => {
  describe('to24Hour', () => {
    it('converts 12:00 AM to 0:00', () => {
      expect(to24Hour({ hours: 12, minutes: 0, period: 'AM' })).toEqual({
        hours: 0,
        minutes: 0,
      });
    });

    it('converts 12:00 PM to 12:00', () => {
      expect(to24Hour({ hours: 12, minutes: 0, period: 'PM' })).toEqual({
        hours: 12,
        minutes: 0,
      });
    });

    it('converts 3:30 AM to 3:30', () => {
      expect(to24Hour({ hours: 3, minutes: 30, period: 'AM' })).toEqual({
        hours: 3,
        minutes: 30,
      });
    });

    it('converts 3:30 PM to 15:30', () => {
      expect(to24Hour({ hours: 3, minutes: 30, period: 'PM' })).toEqual({
        hours: 15,
        minutes: 30,
      });
    });
  });

  describe('to12Hour', () => {
    it('converts 0:00 to 12:00 AM', () => {
      expect(to12Hour({ hours: 0, minutes: 0 })).toEqual({
        hours: 12,
        minutes: 0,
        period: 'AM',
      });
    });

    it('converts 12:00 to 12:00 PM', () => {
      expect(to12Hour({ hours: 12, minutes: 0 })).toEqual({
        hours: 12,
        minutes: 0,
        period: 'PM',
      });
    });

    it('converts 15:30 to 3:30 PM', () => {
      expect(to12Hour({ hours: 15, minutes: 30 })).toEqual({
        hours: 3,
        minutes: 30,
        period: 'PM',
      });
    });
  });

  describe('hourToAngle', () => {
    it('returns 0 for 12:00', () => {
      expect(hourToAngle(12, 0)).toBe(0);
    });

    it('returns 90 for 3:00', () => {
      expect(hourToAngle(3, 0)).toBe(90);
    });

    it('returns 180 for 6:00', () => {
      expect(hourToAngle(6, 0)).toBe(180);
    });

    it('returns 105 for 3:30 (hour hand advances with minutes)', () => {
      expect(hourToAngle(3, 30)).toBe(105);
    });
  });

  describe('minuteToAngle', () => {
    it('returns 0 for 0 minutes', () => {
      expect(minuteToAngle(0)).toBe(0);
    });

    it('returns 90 for 15 minutes', () => {
      expect(minuteToAngle(15)).toBe(90);
    });

    it('returns 180 for 30 minutes', () => {
      expect(minuteToAngle(30)).toBe(180);
    });

    it('returns 270 for 45 minutes', () => {
      expect(minuteToAngle(45)).toBe(270);
    });
  });

  describe('angleToMinute', () => {
    it('returns 0 for 0 degrees', () => {
      expect(angleToMinute(0)).toBe(0);
    });

    it('returns 15 for 90 degrees', () => {
      expect(angleToMinute(90)).toBe(15);
    });

    it('returns 30 for 180 degrees', () => {
      expect(angleToMinute(180)).toBe(30);
    });

    it('returns 0 for 360 degrees (wrap around)', () => {
      expect(angleToMinute(360)).toBe(0);
    });
  });

  describe('formatTime12', () => {
    it('formats 3:00 PM correctly', () => {
      expect(formatTime12({ hours: 3, minutes: 0, period: 'PM' })).toBe('3:00 PM');
    });

    it('formats 12:30 AM correctly', () => {
      expect(formatTime12({ hours: 12, minutes: 30, period: 'AM' })).toBe('12:30 AM');
    });
  });

  describe('formatTime24', () => {
    it('formats 3:00 PM as 15:00', () => {
      expect(formatTime24({ hours: 3, minutes: 0, period: 'PM' })).toBe('15:00');
    });

    it('formats 12:30 AM as 00:30', () => {
      expect(formatTime24({ hours: 12, minutes: 30, period: 'AM' })).toBe('00:30');
    });
  });

  describe('timesEqual', () => {
    it('returns true for equal times', () => {
      expect(
        timesEqual({ hours: 3, minutes: 30, period: 'PM' }, { hours: 3, minutes: 30, period: 'PM' })
      ).toBe(true);
    });

    it('returns false for different hours', () => {
      expect(
        timesEqual({ hours: 3, minutes: 30, period: 'PM' }, { hours: 4, minutes: 30, period: 'PM' })
      ).toBe(false);
    });

    it('returns false for different periods', () => {
      expect(
        timesEqual({ hours: 3, minutes: 30, period: 'PM' }, { hours: 3, minutes: 30, period: 'AM' })
      ).toBe(false);
    });
  });
});
