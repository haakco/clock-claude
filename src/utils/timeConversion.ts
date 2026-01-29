import type { Time, Time24 } from '../types';

// Clock geometry constants
const DEGREES_IN_CIRCLE = 360;
const HOURS_ON_CLOCK = 12;
const MINUTES_IN_HOUR = 60;
const DEGREES_PER_HOUR = DEGREES_IN_CIRCLE / HOURS_ON_CLOCK; // 30
const DEGREES_PER_MINUTE = DEGREES_IN_CIRCLE / MINUTES_IN_HOUR; // 6
const HOUR_HAND_DEGREES_PER_MINUTE = DEGREES_PER_HOUR / MINUTES_IN_HOUR; // 0.5
const RADIANS_TO_DEGREES = 180 / Math.PI;
const SNAP_INCREMENT = 5;

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
  const hourAngle = (hours % HOURS_ON_CLOCK) * DEGREES_PER_HOUR;
  const minuteAdjustment = minutes * HOUR_HAND_DEGREES_PER_MINUTE;
  return hourAngle + minuteAdjustment;
}

/**
 * Calculate the angle for the minute hand (in degrees)
 * Each minute = 6 degrees
 */
export function minuteToAngle(minutes: number): number {
  return minutes * DEGREES_PER_MINUTE;
}

/**
 * Convert an angle (in degrees) to hours (1-12)
 * Returns hours with decimal for minute adjustment
 */
export function angleToHour(angle: number): number {
  // Normalize angle to 0-360
  const normalized = ((angle % DEGREES_IN_CIRCLE) + DEGREES_IN_CIRCLE) % DEGREES_IN_CIRCLE;
  const hour = normalized / DEGREES_PER_HOUR;
  return hour === 0 ? HOURS_ON_CLOCK : hour;
}

/**
 * Convert an angle (in degrees) to minutes (0-59)
 */
export function angleToMinute(angle: number): number {
  // Normalize angle to 0-360
  const normalized = ((angle % DEGREES_IN_CIRCLE) + DEGREES_IN_CIRCLE) % DEGREES_IN_CIRCLE;
  return Math.round(normalized / DEGREES_PER_MINUTE) % MINUTES_IN_HOUR;
}

/**
 * Calculate the angle from center point to a touch/mouse position
 */
export function calculateAngle(
  centerX: number,
  centerY: number,
  pointX: number,
  pointY: number,
): number {
  const deltaX = pointX - centerX;
  const deltaY = pointY - centerY;

  // atan2 returns angle from positive x-axis, counter-clockwise
  // We need angle from positive y-axis (12 o'clock), clockwise
  let angle = Math.atan2(deltaX, -deltaY) * RADIANS_TO_DEGREES;

  // Normalize to 0-360
  if (angle < 0) {
    angle += DEGREES_IN_CIRCLE;
  }

  return angle;
}

/**
 * Snap minutes to nearest 5-minute increment
 */
export function snapToFiveMinutes(minutes: number): number {
  return Math.round(minutes / SNAP_INCREMENT) * SNAP_INCREMENT;
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
