import { motion } from 'framer-motion';

interface TimeWordsDisplayProps {
  words: string;
  primaryColor: string;
  secondaryColor: string;
}

export function TimeWordsDisplay({ words, primaryColor, secondaryColor }: TimeWordsDisplayProps) {
  return (
    <motion.div
      className="mt-3 p-3 rounded-xl text-lg font-medium"
      style={{
        background: `${primaryColor}15`,
        color: secondaryColor,
      }}
      key={words}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      "{words}"
    </motion.div>
  );
}
