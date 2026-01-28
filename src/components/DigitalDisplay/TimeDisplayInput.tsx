import { AnimatePresence, motion } from 'framer-motion';
import { Check, Clock, Pencil } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useDisplayTime } from '../../hooks/useDisplayTime';
import { useSpeech } from '../../hooks/useSpeech';
import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';
import type { Time } from '../../types';
import { TimeValueDisplay } from './TimeValueDisplay';
import { TimeWordsDisplay } from './TimeWordsDisplay';
import { WheelPicker } from './WheelPicker';

interface TimeDisplayInputProps {
  time: Time;
  onChange: (time: Time) => void;
  showWords?: boolean;
}

// Generate picker options
const hours12 = Array.from({ length: 12 }, (_, i) => String(i + 1));
const hours24 = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minuteOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const periods: ('AM' | 'PM')[] = ['AM', 'PM'];

interface TimePickerProps {
  time: Time;
  use24Hour: boolean;
  current24Hour: string;
  colors: { primary: string };
  onHour24Change: (hour: string) => void;
  onHour12Change: (hour: string) => void;
  onMinuteChange: (minute: string) => void;
  onPeriodChange: (period: string) => void;
}

function TimePicker({
  time,
  use24Hour,
  current24Hour,
  colors,
  onHour24Change,
  onHour12Change,
  onMinuteChange,
  onPeriodChange,
}: TimePickerProps) {
  const hourItems = use24Hour ? hours24 : hours12;
  const hourValue = use24Hour ? current24Hour : String(time.hours);
  const onHourChange = use24Hour ? onHour24Change : onHour12Change;

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="w-16">
        <WheelPicker
          items={hourItems}
          value={hourValue}
          onChange={onHourChange}
          height={120}
          itemHeight={36}
        />
      </div>
      <div className="text-3xl font-bold" style={{ color: colors.primary }}>
        :
      </div>
      <div className="w-16">
        <WheelPicker
          items={minuteOptions}
          value={String(time.minutes).padStart(2, '0')}
          onChange={onMinuteChange}
          height={120}
          itemHeight={36}
        />
      </div>
      {!use24Hour && (
        <div className="w-16 ml-2">
          <WheelPicker
            items={periods}
            value={time.period}
            onChange={onPeriodChange}
            height={120}
            itemHeight={36}
          />
        </div>
      )}
    </div>
  );
}

export function TimeDisplayInput({ time, onChange, showWords = true }: TimeDisplayInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [use24Hour, setUse24Hour] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;
  const { speakTime, speakTime24 } = useSpeech();
  const { displayTime, time12, time24, words } = useDisplayTime(time);

  const handleSpeak12 = useCallback(() => {
    speakTime(displayTime.hours, displayTime.minutes, displayTime.period);
  }, [speakTime, displayTime.hours, displayTime.minutes, displayTime.period]);

  const handleSpeak24 = useCallback(() => {
    speakTime24(displayTime.hours, displayTime.minutes, displayTime.period);
  }, [speakTime24, displayTime.hours, displayTime.minutes, displayTime.period]);

  // Convert 24h value to 12h for storage with validation
  const handleHour24Change = (hour24: string) => {
    const parsed = parseInt(hour24, 10);
    // Clamp to valid 24-hour range (0-23)
    const h = Number.isNaN(parsed) ? 0 : Math.max(0, Math.min(23, parsed));
    const newPeriod: 'AM' | 'PM' = h < 12 ? 'AM' : 'PM';
    const newHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    onChange({ ...time, hours: newHour, period: newPeriod });
  };

  const handleHour12Change = (hour: string) => {
    const parsed = parseInt(hour, 10);
    // Clamp to valid 12-hour range (1-12)
    const hours = Number.isNaN(parsed) ? 12 : Math.max(1, Math.min(12, parsed));
    onChange({ ...time, hours });
  };

  const handleMinuteChange = (minute: string) => {
    const parsed = parseInt(minute, 10);
    // Clamp to valid minute range (0-59)
    const minutes = Number.isNaN(parsed) ? 0 : Math.max(0, Math.min(59, parsed));
    onChange({ ...time, minutes });
  };

  const handlePeriodChange = (period: string) => {
    // Validate period is AM or PM, default to AM if invalid
    const validPeriod = period === 'PM' ? 'PM' : 'AM';
    onChange({ ...time, period: validPeriod });
  };

  // Get current 24h value for picker
  const current24Hour = useMemo(() => {
    let h = time.hours;
    if (time.period === 'PM' && h !== 12) h += 12;
    if (time.period === 'AM' && h === 12) h = 0;
    return String(h).padStart(2, '0');
  }, [time.hours, time.period]);

  return (
    <motion.div
      className="p-4 rounded-2xl"
      style={{ background: colors.background }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <AnimatePresence mode="wait">
        {!isEditing ? (
          // Display Mode
          <motion.div
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            {/* Both time formats side by side */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {/* 12-hour time with speak button */}
              <TimeValueDisplay
                value={time12}
                color={colors.primary}
                onSpeak={handleSpeak12}
                speakTitle="Listen to the time"
                onClick={() => setIsEditing(true)}
                className="text-3xl"
              />

              {/* Divider */}
              <div className="text-2xl font-light opacity-30" style={{ color: colors.secondary }}>
                /
              </div>

              {/* 24-hour time with speak button */}
              <TimeValueDisplay
                value={time24}
                color={colors.secondary}
                onSpeak={handleSpeak24}
                speakTitle="Listen to the time (24-hour)"
                onClick={() => setIsEditing(true)}
                className="text-3xl"
                speakButtonColor={colors.primary}
              />

              {/* Edit button */}
              <motion.button
                className="p-2 rounded-full"
                style={{ background: `${colors.primary}20` }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                title="Edit time"
              >
                <Pencil size={18} style={{ color: colors.primary }} />
              </motion.button>
            </div>

            {/* Time in words */}
            {showWords && (
              <TimeWordsDisplay
                words={words}
                primaryColor={colors.primary}
                secondaryColor={colors.secondary}
              />
            )}
          </motion.div>
        ) : (
          // Edit Mode
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Mode selector and done button */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                <motion.button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    background: !use24Hour ? colors.primary : `${colors.primary}20`,
                    color: !use24Hour ? 'white' : colors.primary,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUse24Hour(false)}
                >
                  <Clock size={14} />
                  12h
                </motion.button>
                <motion.button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    background: use24Hour ? colors.primary : `${colors.primary}20`,
                    color: use24Hour ? 'white' : colors.primary,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUse24Hour(true)}
                >
                  <Clock size={14} />
                  24h
                </motion.button>
              </div>
              <motion.button
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold text-white"
                style={{ background: colors.primary }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(false)}
              >
                <Check size={16} />
                Done
              </motion.button>
            </div>

            {/* Wheel pickers */}
            <TimePicker
              time={time}
              use24Hour={use24Hour}
              current24Hour={current24Hour}
              colors={colors}
              onHour24Change={handleHour24Change}
              onHour12Change={handleHour12Change}
              onMinuteChange={handleMinuteChange}
              onPeriodChange={handlePeriodChange}
            />

            {/* Current time preview */}
            <div
              className="text-center mt-3 text-lg font-medium"
              style={{ color: colors.secondary }}
            >
              {use24Hour ? time24 : time12}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
