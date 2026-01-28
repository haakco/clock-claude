import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';
import type { Time } from '../../types';
import { WheelPicker } from './WheelPicker';

interface TimeInputProps {
  value: Time;
  onChange: (time: Time) => void;
  showPeriod?: boolean;
  compact?: boolean;
}

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const periods: ('AM' | 'PM')[] = ['AM', 'PM'];

export function TimeInput({ value, onChange, showPeriod = true, compact = false }: TimeInputProps) {
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;

  const height = compact ? 120 : 150;
  const itemHeight = compact ? 36 : 40;

  const handleHourChange = (hour: string) => {
    const parsed = parseInt(hour, 10);
    // Clamp hours to valid 12-hour range (1-12)
    const hours = Number.isNaN(parsed) ? 12 : Math.max(1, Math.min(12, parsed));
    onChange({ ...value, hours });
  };

  const handleMinuteChange = (minute: string) => {
    const parsed = parseInt(minute, 10);
    // Clamp minutes to valid range (0-59)
    const minutes = Number.isNaN(parsed) ? 0 : Math.max(0, Math.min(59, parsed));
    onChange({ ...value, minutes });
  };

  const handlePeriodChange = (period: string) => {
    // Strict type guard: only accept exactly 'AM' or 'PM'
    const isValidPeriod = (p: string): p is 'AM' | 'PM' => p === 'AM' || p === 'PM';

    if (isValidPeriod(period)) {
      onChange({ ...value, period });
    } else {
      // Default to AM for any invalid input
      onChange({ ...value, period: 'AM' });
    }
  };

  return (
    <div
      className="flex items-center justify-center gap-2 p-4 rounded-2xl"
      style={{ background: `${colors.background}` }}
    >
      {/* Hour picker */}
      <div className="w-16">
        <WheelPicker
          items={hours}
          value={String(value.hours)}
          onChange={handleHourChange}
          height={height}
          itemHeight={itemHeight}
        />
      </div>

      {/* Colon separator */}
      <div className="text-3xl font-bold" style={{ color: colors.primary }}>
        :
      </div>

      {/* Minute picker */}
      <div className="w-16">
        <WheelPicker
          items={minutes}
          value={String(value.minutes).padStart(2, '0')}
          onChange={handleMinuteChange}
          height={height}
          itemHeight={itemHeight}
        />
      </div>

      {/* AM/PM picker */}
      {showPeriod && (
        <div className="w-16 ml-2">
          <WheelPicker
            items={periods}
            value={value.period}
            onChange={handlePeriodChange}
            height={height}
            itemHeight={itemHeight}
          />
        </div>
      )}
    </div>
  );
}
