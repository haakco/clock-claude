import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface SpeakButtonProps {
  onClick: () => void;
  color: string;
  size?: number;
  title?: string;
}

export function SpeakButton({ onClick, color, size = 18, title = 'Listen' }: SpeakButtonProps) {
  return (
    <motion.button
      className="p-2 rounded-full"
      style={{ background: `${color}20` }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={title}
    >
      <Volume2 size={size} style={{ color }} />
    </motion.button>
  );
}
