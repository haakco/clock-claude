import { useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import type { Time } from '../types';
import { hourToAngle, minuteToAngle } from '../utils/timeConversion';

export function useTime() {
  const currentTime = useGameStore((state) => state.currentTime);
  const setCurrentTime = useGameStore((state) => state.setCurrentTime);

  // Use getState() to read current time at execution time, not callback creation time.
  // This keeps callbacks stable and prevents recreation on every time change.
  const setMinutes = useCallback(
    (minutes: number) => {
      const time = useGameStore.getState().currentTime;
      // Calculate how the hour hand should move based on minute change
      const oldMinutes = time.minutes;
      let newHours = time.hours;

      // If we cross over 0/60, adjust the hour
      if (oldMinutes > 45 && minutes < 15) {
        // Moved forward past 12
        newHours = newHours === 12 ? 1 : newHours + 1;
      } else if (oldMinutes < 15 && minutes > 45) {
        // Moved backward past 12
        newHours = newHours === 1 ? 12 : newHours - 1;
      }

      setCurrentTime({
        ...time,
        hours: newHours,
        minutes,
      });
    },
    [setCurrentTime],
  );

  const setHours = useCallback(
    (hours: number) => {
      const time = useGameStore.getState().currentTime;
      setCurrentTime({
        ...time,
        hours,
      });
    },
    [setCurrentTime],
  );

  const setPeriod = useCallback(
    (period: 'AM' | 'PM') => {
      const time = useGameStore.getState().currentTime;
      setCurrentTime({
        ...time,
        period,
      });
    },
    [setCurrentTime],
  );

  const setFullTime = useCallback(
    (time: Time) => {
      setCurrentTime(time);
    },
    [setCurrentTime],
  );

  // Get angles for clock hands
  const hourAngle = hourToAngle(currentTime.hours, currentTime.minutes);
  const minuteAngle = minuteToAngle(currentTime.minutes);

  return {
    time: currentTime,
    hourAngle,
    minuteAngle,
    setMinutes,
    setHours,
    setPeriod,
    setFullTime,
  };
}
