import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { Time } from '../../types';
import { formatTime12, formatTime24 } from '../../utils/timeConversion';
import { timeToWords } from '../../utils/timeToWords';
import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';
import { useSpeech } from '../../hooks/useSpeech';

interface DigitalTimeProps {
  time: Time;
  showWords?: boolean;
  show24Hour?: boolean;
}

export function DigitalTime({
  time,
  showWords = true,
  show24Hour = true,
}: DigitalTimeProps) {
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;
  const { speakTime } = useSpeech();

  const time12 = formatTime12(time);
  const time24 = formatTime24(time);
  const words = timeToWords(time);

  const handleSpeak = useCallback(() => {
    speakTime(time.hours, time.minutes, time.period);
  }, [speakTime, time.hours, time.minutes, time.period]);

  return (
    <motion.div
      className="text-center p-4 rounded-2xl"
      style={{ background: colors.background }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* 12-hour time with speak button */}
      <div className="flex items-center justify-center gap-3">
        <motion.div
          className="text-4xl font-bold font-display"
          style={{ color: colors.primary }}
          key={time12}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {time12}
        </motion.div>
        <motion.button
          className="p-2 rounded-full"
          style={{ background: `${colors.primary}20` }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSpeak}
          title="Listen to the time"
        >
          <Volume2 size={24} style={{ color: colors.primary }} />
        </motion.button>
      </div>

      {/* 24-hour time */}
      {show24Hour && (
        <div
          className="text-xl mt-1 opacity-70"
          style={{ color: colors.secondary }}
        >
          {time24}
        </div>
      )}

      {/* Time in words */}
      {showWords && (
        <motion.div
          className="mt-4 p-3 rounded-xl text-lg font-medium"
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
  );
}
