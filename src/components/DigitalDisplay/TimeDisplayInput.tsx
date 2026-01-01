import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Pencil, Check, Clock } from 'lucide-react';
import { WheelPicker } from './WheelPicker';
import { Time } from '../../types';
import { formatTime12, formatTime24 } from '../../utils/timeConversion';
import { timeToWords } from '../../utils/timeToWords';
import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';
import { useSpeech } from '../../hooks/useSpeech';

interface TimeDisplayInputProps {
  time: Time;
  onChange: (time: Time) => void;
  showWords?: boolean;
}

// Generate picker options
const hours12 = Array.from({ length: 12 }, (_, i) => String(i + 1));
const hours24 = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const periods: ('AM' | 'PM')[] = ['AM', 'PM'];

export function TimeDisplayInput({
  time,
  onChange,
  showWords = true,
}: TimeDisplayInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [use24Hour, setUse24Hour] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;
  const { speakTime, speakTime24 } = useSpeech();

  // Display time rounds to 5-minute boundaries
  const displayTime = useMemo((): Time => {
    const roundedMinute = Math.floor(time.minutes / 5) * 5;
    return { hours: time.hours, minutes: roundedMinute, period: time.period };
  }, [time.hours, time.minutes, time.period]);

  const time12 = formatTime12(displayTime);
  const time24 = formatTime24(displayTime);
  const words = timeToWords(displayTime);

  const handleSpeak12 = useCallback(() => {
    speakTime(displayTime.hours, displayTime.minutes, displayTime.period);
  }, [speakTime, displayTime.hours, displayTime.minutes, displayTime.period]);

  const handleSpeak24 = useCallback(() => {
    speakTime24(displayTime.hours, displayTime.minutes, displayTime.period);
  }, [speakTime24, displayTime.hours, displayTime.minutes, displayTime.period]);

  // Convert 24h value to 12h for storage
  const handleHour24Change = (hour24: string) => {
    const h = parseInt(hour24);
    const newPeriod: 'AM' | 'PM' = h < 12 ? 'AM' : 'PM';
    const newHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    onChange({ ...time, hours: newHour, period: newPeriod });
  };

  const handleHour12Change = (hour: string) => {
    onChange({ ...time, hours: parseInt(hour) });
  };

  const handleMinuteChange = (minute: string) => {
    onChange({ ...time, minutes: parseInt(minute) });
  };

  const handlePeriodChange = (period: string) => {
    onChange({ ...time, period: period as 'AM' | 'PM' });
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
              <div className="flex items-center gap-2">
                <motion.div
                  className="text-3xl font-bold font-display cursor-pointer hover:opacity-80"
                  style={{ color: colors.primary }}
                  key={time12}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  onClick={() => setIsEditing(true)}
                  title="Click to edit"
                >
                  {time12}
                </motion.div>
                <motion.button
                  className="p-2 rounded-full"
                  style={{ background: `${colors.primary}20` }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSpeak12}
                  title="Listen to the time"
                >
                  <Volume2 size={18} style={{ color: colors.primary }} />
                </motion.button>
              </div>

              {/* Divider */}
              <div
                className="text-2xl font-light opacity-30"
                style={{ color: colors.secondary }}
              >
                /
              </div>

              {/* 24-hour time with speak button */}
              <div className="flex items-center gap-2">
                <motion.div
                  className="text-3xl font-bold font-display cursor-pointer hover:opacity-80"
                  style={{ color: colors.secondary }}
                  key={time24}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  onClick={() => setIsEditing(true)}
                  title="Click to edit"
                >
                  {time24}
                </motion.div>
                <motion.button
                  className="p-2 rounded-full"
                  style={{ background: `${colors.primary}20` }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSpeak24}
                  title="Listen to the time (24-hour)"
                >
                  <Volume2 size={18} style={{ color: colors.primary }} />
                </motion.button>
              </div>

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
              <motion.div
                className="mt-3 p-3 rounded-xl text-lg font-medium"
                style={{
                  background: `${colors.primary}15`,
                  color: colors.secondary,
                }}
                key={words}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                "{words}"
              </motion.div>
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
            <div className="flex items-center justify-center gap-2">
              {use24Hour ? (
                // 24-hour mode
                <>
                  <div className="w-16">
                    <WheelPicker
                      items={hours24}
                      value={current24Hour}
                      onChange={handleHour24Change}
                      height={120}
                      itemHeight={36}
                    />
                  </div>
                  <div
                    className="text-3xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    :
                  </div>
                  <div className="w-16">
                    <WheelPicker
                      items={minutes}
                      value={String(time.minutes).padStart(2, '0')}
                      onChange={handleMinuteChange}
                      height={120}
                      itemHeight={36}
                    />
                  </div>
                </>
              ) : (
                // 12-hour mode
                <>
                  <div className="w-16">
                    <WheelPicker
                      items={hours12}
                      value={String(time.hours)}
                      onChange={handleHour12Change}
                      height={120}
                      itemHeight={36}
                    />
                  </div>
                  <div
                    className="text-3xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    :
                  </div>
                  <div className="w-16">
                    <WheelPicker
                      items={minutes}
                      value={String(time.minutes).padStart(2, '0')}
                      onChange={handleMinuteChange}
                      height={120}
                      itemHeight={36}
                    />
                  </div>
                  <div className="w-16 ml-2">
                    <WheelPicker
                      items={periods}
                      value={time.period}
                      onChange={handlePeriodChange}
                      height={120}
                      itemHeight={36}
                    />
                  </div>
                </>
              )}
            </div>

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
