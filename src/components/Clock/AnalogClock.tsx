import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useClockDrag } from '../../hooks/useClockDrag';
import { useTime } from '../../hooks/useTime';
import { useGameStore } from '../../stores/gameStore';
import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';
import { ClockFace } from './ClockFace';
import { ClockHand } from './ClockHand';

interface AnalogClockProps {
  size?: number;
  interactive?: boolean;
}

export function AnalogClock({ size = 300, interactive = true }: AnalogClockProps) {
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;
  const { hourAngle, minuteAngle, setMinutes, setHours } = useTime();
  const setIsDragging = useGameStore((state) => state.setIsDragging);

  const center = size / 2;
  const hourLength = size * 0.25;
  const minuteLength = size * 0.38;

  const handleMinuteChange = (minutes: number) => {
    setMinutes(minutes);
  };

  const handleHourChange = (hours: number) => {
    setHours(hours);
  };

  const { isDraggingMinute, isDraggingHour, handleMinuteStart, handleHourStart, clockRef } =
    useClockDrag({
      onMinuteChange: handleMinuteChange,
      onHourChange: handleHourChange,
      snapToFive: false,
    });

  // Sync dragging state to game store for text display
  useEffect(() => {
    setIsDragging(isDraggingMinute || isDraggingHour);
  }, [isDraggingMinute, isDraggingHour, setIsDragging]);

  return (
    <motion.div
      ref={clockRef}
      className="relative clock-container no-select"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${colors.clockFace} 0%, ${colors.background} 100%)`,
        borderRadius: '50%',
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', duration: 0.5 }}
    >
      <ClockFace size={size} />

      <svg width={size} height={size} className="absolute top-0 left-0" style={{ zIndex: 10 }}>
        {/* Hour hand (behind minute hand) */}
        <ClockHand
          angle={hourAngle}
          length={hourLength}
          width={8}
          color={colors.hourHand}
          centerX={center}
          centerY={center}
          isDragging={isDraggingHour}
          onDragStart={interactive ? handleHourStart : undefined}
          type="hour"
        />

        {/* Minute hand (in front) */}
        <ClockHand
          angle={minuteAngle}
          length={minuteLength}
          width={5}
          color={colors.minuteHand}
          centerX={center}
          centerY={center}
          isDragging={isDraggingMinute}
          onDragStart={interactive ? handleMinuteStart : undefined}
          type="minute"
        />

        {/* Center dot */}
        <circle
          cx={center}
          cy={center}
          r={12}
          fill={colors.centerDot}
          stroke={colors.clockBorder}
          strokeWidth={2}
        />
        <circle cx={center} cy={center} r={6} fill={colors.clockBorder} />
      </svg>

      {/* Dragging indicator */}
      {(isDraggingMinute || isDraggingHour) && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: `0 0 30px 10px ${colors.primary}40`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
}
