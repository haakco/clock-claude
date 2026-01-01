import { Time } from '../../types';
import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';
import { hourToAngle, minuteToAngle } from '../../utils/timeConversion';

interface MiniClockProps {
  time: Time;
  size?: number;
  showCorrect?: boolean;
  showIncorrect?: boolean;
}

export function MiniClock({
  time,
  size = 100,
  showCorrect = false,
  showIncorrect = false,
}: MiniClockProps) {
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;

  const center = size / 2;
  const radius = size / 2 - 5;
  const hourLength = size * 0.22;
  const minuteLength = size * 0.35;

  const hourAngle = hourToAngle(time.hours, time.minutes);
  const minuteAngle = minuteToAngle(time.minutes);

  // Calculate hand end points
  const hourRadian = (hourAngle - 90) * (Math.PI / 180);
  const minuteRadian = (minuteAngle - 90) * (Math.PI / 180);

  const hourEndX = center + hourLength * Math.cos(hourRadian);
  const hourEndY = center + hourLength * Math.sin(hourRadian);
  const minuteEndX = center + minuteLength * Math.cos(minuteRadian);
  const minuteEndY = center + minuteLength * Math.sin(minuteRadian);

  // Generate numbers
  const numberRadius = radius - 15;
  const numbers = [12, 3, 6, 9].map((num) => {
    const idx = num === 12 ? 0 : num;
    const angle = (idx * 30 - 90) * (Math.PI / 180);
    return {
      num,
      x: center + numberRadius * Math.cos(angle),
      y: center + numberRadius * Math.sin(angle),
    };
  });

  let borderColor = colors.clockBorder;
  if (showCorrect) borderColor = '#22c55e'; // green-500
  if (showIncorrect) borderColor = '#ef4444'; // red-500

  return (
    <div
      className={`relative transition-all duration-300 ${
        showCorrect ? 'scale-105' : ''
      } ${showIncorrect ? 'animate-wiggle' : ''}`}
    >
      <svg width={size} height={size}>
        {/* Clock face */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill={colors.clockFace}
          stroke={borderColor}
          strokeWidth="4"
        />

        {/* Hour markers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const outerR = radius - 3;
          const innerR = i % 3 === 0 ? radius - 10 : radius - 7;
          return (
            <line
              key={i}
              x1={center + innerR * Math.cos(angle)}
              y1={center + innerR * Math.sin(angle)}
              x2={center + outerR * Math.cos(angle)}
              y2={center + outerR * Math.sin(angle)}
              stroke={colors.numbers}
              strokeWidth={i % 3 === 0 ? 2 : 1}
            />
          );
        })}

        {/* Numbers - only 12, 3, 6, 9 for small clock */}
        {numbers.map(({ num, x, y }) => (
          <text
            key={num}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={colors.numbers}
            fontSize={size / 8}
            fontWeight="bold"
            fontFamily="Fredoka, sans-serif"
          >
            {num}
          </text>
        ))}

        {/* Hour hand */}
        <line
          x1={center}
          y1={center}
          x2={hourEndX}
          y2={hourEndY}
          stroke={colors.hourHand}
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Minute hand */}
        <line
          x1={center}
          y1={center}
          x2={minuteEndX}
          y2={minuteEndY}
          stroke={colors.minuteHand}
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Center dot */}
        <circle cx={center} cy={center} r={5} fill={colors.centerDot} />
      </svg>

      {/* Correct indicator */}
      {showCorrect && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-lg">
          ✓
        </div>
      )}

      {/* Incorrect indicator */}
      {showIncorrect && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-lg">
          ✗
        </div>
      )}
    </div>
  );
}
