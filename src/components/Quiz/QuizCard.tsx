import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MiniClock } from '../Clock/MiniClock';
import { TimeInput } from '../DigitalDisplay/TimeInput';
import { QuizQuestion, Time } from '../../types';
import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';
import { useSound } from '../../hooks/useSound';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (questionId: string, userAnswer: Time) => boolean;
  onNext: () => void;
}

export function QuizCard({ question, onAnswer, onNext }: QuizCardProps) {
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
    const correct = onAnswer(question.id, userAnswer);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      playSound('correct');
      // Fire confetti!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: [colors.primary, colors.accent, '#ffd700'],
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
      className="card flex flex-col items-center gap-4 p-4"
      style={{ background: colors.clockFace }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring' }}
    >
      {/* Mini clock display */}
      <MiniClock
        time={question.time}
        size={120}
        showCorrect={showResult && isCorrect}
        showIncorrect={showResult && !isCorrect}
      />

      {/* Answer input or result */}
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <TimeInput
              value={userAnswer}
              onChange={setUserAnswer}
              showPeriod={false}
              compact
            />

            <motion.button
              className="w-full mt-3 py-3 rounded-xl font-bold text-white"
              style={{ background: colors.primary }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheck}
            >
              Check!
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center w-full"
          >
            {isCorrect ? (
              <div className="text-green-500 text-2xl font-bold mb-2">
                Correct! 🎉
              </div>
            ) : (
              <div className="text-red-500 text-xl font-bold mb-2">
                Try again! The answer is {question.time.hours}:
                {String(question.time.minutes).padStart(2, '0')}
              </div>
            )}

            <motion.button
              className="w-full py-3 rounded-xl font-bold text-white"
              style={{ background: colors.secondary }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
            >
              Next Question
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
