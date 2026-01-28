import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';

interface ClockFaceProps {
  size: number;
}

// Round to 2 decimal places to prevent SSR hydration mismatches
// from floating-point precision differences between server and client
const round = (n: number) => Math.round(n * 100) / 100;

export function ClockFace({ size }: ClockFaceProps) {
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;

  const center = size / 2;
  const radius = size / 2 - 10;
  const numberRadius = radius - 25;

  // Generate numbers 1-12 positioned around the clock
  const numbers = Array.from({ length: 12 }, (_, i) => {
    const number = i + 1;
    const angle = (number * 30 - 90) * (Math.PI / 180);
    const x = round(center + numberRadius * Math.cos(angle));
    const y = round(center + numberRadius * Math.sin(angle));
    return { number, x, y };
  });

  // Generate tick marks
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i * 6 - 90) * (Math.PI / 180);
    const isHour = i % 5 === 0;
    const outerRadius = radius - 5;
    const innerRadius = isHour ? radius - 20 : radius - 12;

    return {
      x1: round(center + innerRadius * Math.cos(angle)),
      y1: round(center + innerRadius * Math.sin(angle)),
      x2: round(center + outerRadius * Math.cos(angle)),
      y2: round(center + outerRadius * Math.sin(angle)),
      isHour,
    };
  });

  return (
    <svg width={size} height={size} className="absolute top-0 left-0">
      {/* Clock face background */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill={colors.clockFace}
        stroke={colors.clockBorder}
        strokeWidth="8"
      />

      {/* Inner decorative circle */}
      <circle
        cx={center}
        cy={center}
        r={radius - 35}
        fill="none"
        stroke={colors.clockBorder}
        strokeWidth="2"
        opacity="0.2"
      />

      {/* Tick marks */}
      {ticks.map((tick, i) => (
        <line
          key={i}
          x1={tick.x1}
          y1={tick.y1}
          x2={tick.x2}
          y2={tick.y2}
          stroke={colors.numbers}
          strokeWidth={tick.isHour ? 3 : 1}
          strokeLinecap="round"
        />
      ))}

      {/* Numbers */}
      {numbers.map(({ number, x, y }) => (
        <text
          key={number}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={colors.numbers}
          fontSize={size / 12}
          fontWeight="bold"
          fontFamily="Fredoka, sans-serif"
          className="select-none"
        >
          {number}
        </text>
      ))}
    </svg>
  );
}
