import { motion } from 'framer-motion';
import { SpeakButton } from './SpeakButton';

interface TimeValueDisplayProps {
  value: string;
  color: string;
  onSpeak: () => void;
  speakTitle: string;
  onClick?: () => void;
  className?: string;
  speakButtonSize?: number;
  speakButtonColor?: string;
}

export function TimeValueDisplay({
  value,
  color,
  onSpeak,
  speakTitle,
  onClick,
  className = 'text-4xl',
  speakButtonSize,
  speakButtonColor,
}: TimeValueDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`${className} font-bold font-display ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
        style={{ color }}
        key={value}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        onClick={onClick}
        title={onClick ? 'Click to edit' : undefined}
      >
        {value}
      </motion.div>
      <SpeakButton
        onClick={onSpeak}
        color={speakButtonColor ?? color}
        size={speakButtonSize}
        title={speakTitle}
      />
    </div>
  );
}
