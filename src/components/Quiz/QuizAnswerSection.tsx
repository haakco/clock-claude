import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface QuizAnswerSectionProps {
  showResult: boolean;
  inputContent: ReactNode;
  resultContent: ReactNode;
  inputClassName?: string;
  resultClassName?: string;
}

export function QuizAnswerSection({
  showResult,
  inputContent,
  resultContent,
  inputClassName = '',
  resultClassName = 'text-center',
}: QuizAnswerSectionProps) {
  return (
    <AnimatePresence mode="wait">
      {!showResult ? (
        <motion.div
          key="input"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={inputClassName}
        >
          {inputContent}
        </motion.div>
      ) : (
        <motion.div
          key="result"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className={resultClassName}
        >
          {resultContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
