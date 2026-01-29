import { useCallback, useEffect, useRef, useState } from 'react';
import { angleToMinute, calculateAngle } from '../utils/timeConversion';

interface UseClockDragOptions {
  onMinuteChange: (minutes: number) => void;
  onHourChange: (hours: number) => void;
  snapToFive?: boolean;
}

interface UseClockDragReturn {
  isDraggingMinute: boolean;
  isDraggingHour: boolean;
  handleMinuteStart: (e: React.MouseEvent | React.TouchEvent) => void;
  handleHourStart: (e: React.MouseEvent | React.TouchEvent) => void;
  clockRef: React.RefObject<HTMLDivElement>;
}

export function useClockDrag({
  onMinuteChange,
  onHourChange,
  snapToFive = true,
}: UseClockDragOptions): UseClockDragReturn {
  const [isDraggingMinute, setIsDraggingMinute] = useState(false);
  const [isDraggingHour, setIsDraggingHour] = useState(false);
  const clockRef = useRef<HTMLDivElement>(null);

  const getClockCenter = useCallback(() => {
    if (!clockRef.current) return { x: 0, y: 0 };
    const rect = clockRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }, []);

  const getEventPosition = useCallback((e: MouseEvent | TouchEvent): { x: number; y: number } => {
    if ('touches' in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }, []);

  const getAngleFromEvent = useCallback(
    (e: MouseEvent | TouchEvent): number => {
      e.preventDefault();
      const center = getClockCenter();
      const pos = getEventPosition(e);
      return calculateAngle(center.x, center.y, pos.x, pos.y);
    },
    [getClockCenter, getEventPosition],
  );

  const handleMinuteMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const angle = getAngleFromEvent(e);
      let minutes = angleToMinute(angle);

      if (snapToFive) {
        minutes = Math.round(minutes / 5) * 5;
        if (minutes === 60) minutes = 0;
      }

      onMinuteChange(minutes);
    },
    [getAngleFromEvent, onMinuteChange, snapToFive],
  );

  const handleHourMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const angle = getAngleFromEvent(e);

      // Convert angle to hour (each hour = 30 degrees)
      let hour = Math.round(angle / 30);
      if (hour === 0) hour = 12;
      if (hour > 12) hour = hour % 12 || 12;

      onHourChange(hour);
    },
    [getAngleFromEvent, onHourChange],
  );

  const handleMinuteEnd = useCallback(() => {
    setIsDraggingMinute(false);
  }, []);

  const handleHourEnd = useCallback(() => {
    setIsDraggingHour(false);
  }, []);

  const handleMinuteStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Clear hour drag state to prevent simultaneous drags (mutex behavior)
    setIsDraggingHour(false);
    setIsDraggingMinute(true);
  }, []);

  const handleHourStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Clear minute drag state to prevent simultaneous drags (mutex behavior)
    setIsDraggingMinute(false);
    setIsDraggingHour(true);
  }, []);

  // Combined drag event listener management - ensures only one drag can be active at a time
  useEffect(() => {
    // Determine which handler to use based on which drag is active
    // Due to mutex behavior in start handlers, only one can be true at a time
    const activeMove = isDraggingMinute ? handleMinuteMove : isDraggingHour ? handleHourMove : null;
    const activeEnd = isDraggingMinute ? handleMinuteEnd : isDraggingHour ? handleHourEnd : null;

    if (activeMove && activeEnd) {
      window.addEventListener('mousemove', activeMove);
      window.addEventListener('mouseup', activeEnd);
      window.addEventListener('touchmove', activeMove, { passive: false });
      window.addEventListener('touchend', activeEnd);
    }

    return () => {
      // Clean up all possible listeners to ensure no orphaned handlers
      window.removeEventListener('mousemove', handleMinuteMove);
      window.removeEventListener('mouseup', handleMinuteEnd);
      window.removeEventListener('touchmove', handleMinuteMove);
      window.removeEventListener('touchend', handleMinuteEnd);
      window.removeEventListener('mousemove', handleHourMove);
      window.removeEventListener('mouseup', handleHourEnd);
      window.removeEventListener('touchmove', handleHourMove);
      window.removeEventListener('touchend', handleHourEnd);
    };
  }, [
    isDraggingMinute,
    isDraggingHour,
    handleMinuteMove,
    handleMinuteEnd,
    handleHourMove,
    handleHourEnd,
  ]);

  return {
    isDraggingMinute,
    isDraggingHour,
    handleMinuteStart,
    handleHourStart,
    clockRef: clockRef as React.RefObject<HTMLDivElement>,
  };
}
