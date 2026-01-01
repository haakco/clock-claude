import { Time, Time24 } from '../types';

/**
 * Convert 12-hour time to 24-hour time
 */
export function to24Hour(time: Time): Time24 {
  let hours = time.hours;

  if (time.period === 'AM') {
    if (hours === 12) {
      hours = 0;
    }
  } else {
    // PM
    if (hours !== 12) {
      hours += 12;
    }
  }

  return { hours, minutes: time.minutes };
}

/**
 * Convert 24-hour time to 12-hour time
 */
export function to12Hour(time24: Time24): Time {
  let hours = time24.hours;
  let period: 'AM' | 'PM' = 'AM';

  if (hours === 0) {
    hours = 12;
    period = 'AM';
  } else if (hours === 12) {
    period = 'PM';
  } else if (hours > 12) {
    hours -= 12;
    period = 'PM';
  }

  return { hours, minutes: time24.minutes, period };
}

/**
 * Calculate the angle for the hour hand (in degrees)
 * Each hour = 30 degrees, plus adjustment for minutes
 */
export function hourToAngle(hours: number, minutes: number): number {
  // Each hour is 30 degrees (360 / 12)
  // Each minute adds 0.5 degrees to the hour hand (30 / 60)
  const hourAngle = (hours % 12) * 30;
  const minuteAdjustment = minutes * 0.5;
  return hourAngle + minuteAdjustment;
}

/**
 * Calculate the angle for the minute hand (in degrees)
 * Each minute = 6 degrees
 */
export function minuteToAngle(minutes: number): number {
  return minutes * 6;
}

/**
 * Convert an angle (in degrees) to hours (1-12)
 * Returns hours with decimal for minute adjustment
 */
export function angleToHour(angle: number): number {
  // Normalize angle to 0-360
  const normalized = ((angle % 360) + 360) % 360;
  const hour = normalized / 30;
  return hour === 0 ? 12 : hour;
}

/**
 * Convert an angle (in degrees) to minutes (0-59)
 */
export function angleToMinute(angle: number): number {
  // Normalize angle to 0-360
  const normalized = ((angle % 360) + 360) % 360;
  return Math.round(normalized / 6) % 60;
}

/**
 * Calculate the angle from center point to a touch/mouse position
 */
export function calculateAngle(
  centerX: number,
  centerY: number,
  pointX: number,
  pointY: number
): number {
  const deltaX = pointX - centerX;
  const deltaY = pointY - centerY;

  // atan2 returns angle from positive x-axis, counter-clockwise
  // We need angle from positive y-axis (12 o'clock), clockwise
  let angle = Math.atan2(deltaX, -deltaY) * (180 / Math.PI);

  // Normalize to 0-360
  if (angle < 0) {
    angle += 360;
  }

  return angle;
}

/**
 * Snap minutes to nearest 5-minute increment
 */
export function snapToFiveMinutes(minutes: number): number {
  return Math.round(minutes / 5) * 5;
}

/**
 * Format time for display
 */
export function formatTime12(time: Time): string {
  const hours = time.hours.toString();
  const minutes = time.minutes.toString().padStart(2, '0');
  return `${hours}:${minutes} ${time.period}`;
}

/**
 * Format time in 24-hour format
 */
export function formatTime24(time: Time): string {
  const time24 = to24Hour(time);
  const hours = time24.hours.toString().padStart(2, '0');
  const minutes = time24.minutes.toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Check if two times are equal
 */
export function timesEqual(a: Time, b: Time): boolean {
  return a.hours === b.hours && a.minutes === b.minutes && a.period === b.period;
}
