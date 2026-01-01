import { WheelPicker } from './WheelPicker';
import { Time } from '../../types';
import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';

interface TimeInputProps {
  value: Time;
  onChange: (time: Time) => void;
  showPeriod?: boolean;
  compact?: boolean;
}

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, '0')
);
const periods: ('AM' | 'PM')[] = ['AM', 'PM'];

export function TimeInput({
  value,
  onChange,
  showPeriod = true,
  compact = false,
}: TimeInputProps) {
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;

  const height = compact ? 120 : 150;
  const itemHeight = compact ? 36 : 40;

  const handleHourChange = (hour: string) => {
    onChange({ ...value, hours: parseInt(hour) });
  };

  const handleMinuteChange = (minute: string) => {
    onChange({ ...value, minutes: parseInt(minute) });
  };

  const handlePeriodChange = (period: string) => {
    onChange({ ...value, period: period as 'AM' | 'PM' });
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
      <div
        className="text-3xl font-bold"
        style={{ color: colors.primary }}
      >
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
