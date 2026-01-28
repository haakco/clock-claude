import { motion } from 'framer-motion';
import type React from 'react';

interface ClockHandProps {
  angle: number;
  length: number;
  width: number;
  color: string;
  centerX: number;
  centerY: number;
  isDragging?: boolean;
  onDragStart?: (e: React.MouseEvent | React.TouchEvent) => void;
  type: 'hour' | 'minute';
}

export function ClockHand({
  angle,
  length,
  width,
  color,
  centerX,
  centerY,
  isDragging = false,
  onDragStart,
  type,
}: ClockHandProps) {
  // Calculate end point of the hand
  const radian = (angle - 90) * (Math.PI / 180);
  const endX = centerX + length * Math.cos(radian);
  const endY = centerY + length * Math.sin(radian);

  // Small tail on opposite side
  const tailLength = length * 0.2;
  const tailX = centerX - tailLength * Math.cos(radian);
  const tailY = centerY - tailLength * Math.sin(radian);

  return (
    <motion.g
      className="clock-hand"
      style={{ cursor: onDragStart ? 'grab' : 'default' }}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
      animate={{
        filter: isDragging ? 'drop-shadow(0 0 8px rgba(0,0,0,0.3))' : 'none',
      }}
    >
      {/* Invisible larger hit area for easier grabbing */}
      <line
        x1={tailX}
        y1={tailY}
        x2={endX}
        y2={endY}
        stroke="transparent"
        strokeWidth={width * 4}
        strokeLinecap="round"
      />

      {/* Visible hand */}
      <motion.line
        x1={tailX}
        y1={tailY}
        x2={endX}
        y2={endY}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        animate={{
          strokeWidth: isDragging ? width * 1.2 : width,
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Arrow tip for minute hand */}
      {type === 'minute' && <circle cx={endX} cy={endY} r={width * 1.5} fill={color} />}
    </motion.g>
  );
}
