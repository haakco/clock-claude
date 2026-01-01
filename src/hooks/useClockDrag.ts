import { useState, useCallback, useRef, useEffect } from 'react';
import { calculateAngle, angleToMinute } from '../utils/timeConversion';

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

  const getEventPosition = useCallback(
    (e: MouseEvent | TouchEvent): { x: number; y: number } => {
      if ('touches' in e) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    },
    []
  );

  const handleMinuteMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const center = getClockCenter();
      const pos = getEventPosition(e);
      const angle = calculateAngle(center.x, center.y, pos.x, pos.y);
      let minutes = angleToMinute(angle);

      if (snapToFive) {
        minutes = Math.round(minutes / 5) * 5;
        if (minutes === 60) minutes = 0;
      }

      onMinuteChange(minutes);
    },
    [getClockCenter, getEventPosition, onMinuteChange, snapToFive]
  );

  const handleHourMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const center = getClockCenter();
      const pos = getEventPosition(e);
      const angle = calculateAngle(center.x, center.y, pos.x, pos.y);

      // Convert angle to hour (each hour = 30 degrees)
      let hour = Math.round(angle / 30);
      if (hour === 0) hour = 12;
      if (hour > 12) hour = hour % 12 || 12;

      onHourChange(hour);
    },
    [getClockCenter, getEventPosition, onHourChange]
  );

  const handleMinuteEnd = useCallback(() => {
    setIsDraggingMinute(false);
  }, []);

  const handleHourEnd = useCallback(() => {
    setIsDraggingHour(false);
  }, []);

  const handleMinuteStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingMinute(true);
    },
    []
  );

  const handleHourStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingHour(true);
    },
    []
  );

  // Add/remove event listeners for dragging
  useEffect(() => {
    if (isDraggingMinute) {
      window.addEventListener('mousemove', handleMinuteMove);
      window.addEventListener('mouseup', handleMinuteEnd);
      window.addEventListener('touchmove', handleMinuteMove, { passive: false });
      window.addEventListener('touchend', handleMinuteEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMinuteMove);
      window.removeEventListener('mouseup', handleMinuteEnd);
      window.removeEventListener('touchmove', handleMinuteMove);
      window.removeEventListener('touchend', handleMinuteEnd);
    };
  }, [isDraggingMinute, handleMinuteMove, handleMinuteEnd]);

  useEffect(() => {
    if (isDraggingHour) {
      window.addEventListener('mousemove', handleHourMove);
      window.addEventListener('mouseup', handleHourEnd);
      window.addEventListener('touchmove', handleHourMove, { passive: false });
      window.addEventListener('touchend', handleHourEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleHourMove);
      window.removeEventListener('mouseup', handleHourEnd);
      window.removeEventListener('touchmove', handleHourMove);
      window.removeEventListener('touchend', handleHourEnd);
    };
  }, [isDraggingHour, handleHourMove, handleHourEnd]);

  return {
    isDraggingMinute,
    isDraggingHour,
    handleMinuteStart,
    handleHourStart,
    clockRef: clockRef as React.RefObject<HTMLDivElement>,
  };
}
