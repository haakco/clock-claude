import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { TimeInput } from '../DigitalDisplay/TimeInput';
import { WordProblem as WordProblemType, Time } from '../../types';
import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';
import { useSound } from '../../hooks/useSound';

interface WordProblemProps {
  problem: WordProblemType;
  onAnswer: (userAnswer: Time) => boolean;
  onNext: () => void;
}

export function WordProblem({ problem, onAnswer, onNext }: WordProblemProps) {
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;
  const { playSound } = useSound();

  const [userAnswer, setUserAnswer] = useState<Time>({
    hours: 12,
    minutes: 0,
    period: 'AM',
  });
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleCheck = () => {
    const correct = onAnswer(userAnswer);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      playSound('correct');
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        colors: [colors.primary, colors.accent, '#ffd700', '#ff69b4'],
      });
    } else {
      playSound('incorrect');
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setUserAnswer({ hours: 12, minutes: 0, period: 'AM' });
    onNext();
  };

  return (
    <motion.div
      className="card p-6"
      style={{ background: colors.clockFace }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3
        className="text-xl font-bold mb-4 text-center"
        style={{ color: colors.secondary }}
      >
        Word Challenge
      </h3>

      {/* The question */}
      <motion.div
        className="text-center p-4 rounded-xl mb-4"
        style={{ background: `${colors.primary}15` }}
        key={problem.timeInWords}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <p
          className="text-lg font-medium"
          style={{ color: colors.secondary }}
        >
          What time is
        </p>
        <p
          className="text-2xl font-bold mt-2"
          style={{ color: colors.primary }}
        >
          "{problem.timeInWords}"?
        </p>
      </motion.div>

      {/* Answer input or result */}
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TimeInput
              value={userAnswer}
              onChange={setUserAnswer}
              showPeriod={false}
              compact
            />

            <motion.button
              className="w-full mt-4 py-3 rounded-xl font-bold text-white text-lg"
              style={{ background: colors.primary }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheck}
            >
              Check Answer!
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            {isCorrect ? (
              <motion.div
                className="text-green-500 text-3xl font-bold mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Amazing! 🌟
              </motion.div>
            ) : (
              <div className="text-red-500 text-xl font-bold mb-4">
                Not quite! The answer is {problem.correctTime.hours}:
                {String(problem.correctTime.minutes).padStart(2, '0')}
              </div>
            )}

            <motion.button
              className="w-full py-3 rounded-xl font-bold text-white"
              style={{ background: colors.secondary }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
            >
              Next Challenge
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
