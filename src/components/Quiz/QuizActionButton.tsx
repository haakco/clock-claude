import { motion } from 'framer-motion';

interface QuizActionButtonProps {
  onClick: () => void;
  backgroundColor: string;
  children: React.ReactNode;
  className?: string;
}

export function QuizActionButton({
  onClick,
  backgroundColor,
  children,
  className = '',
}: QuizActionButtonProps) {
  return (
    <motion.button
      className={`w-full py-3 rounded-xl font-bold text-white ${className}`}
      style={{ background: backgroundColor }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
