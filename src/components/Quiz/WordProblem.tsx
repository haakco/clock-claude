import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useCallback } from 'react';
import { useQuizAnswer } from '../../hooks/useQuizAnswer';
import { useSpeech } from '../../hooks/useSpeech';
import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';
import type { Time, WordProblem as WordProblemType } from '../../types';
import { TimeInput } from '../DigitalDisplay/TimeInput';
import { QuizActionButton } from './QuizActionButton';
import { QuizAnswerSection } from './QuizAnswerSection';

interface WordProblemProps {
  problem: WordProblemType;
  onAnswer: (userAnswer: Time) => boolean;
  onNext: () => void;
}

export function WordProblem({ problem, onAnswer, onNext }: WordProblemProps) {
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;
  const { speak } = useSpeech();

  const handleSpeakQuestion = useCallback(() => {
    speak(`What time is ${problem.timeInWords}?`);
  }, [speak, problem.timeInWords]);

  const { userAnswer, setUserAnswer, showResult, isCorrect, handleCheck, handleNext } =
    useQuizAnswer({
      onAnswer,
      onNext,
      confettiColors: [colors.primary, colors.accent, '#ffd700', '#ff69b4'],
      confettiConfig: { particleCount: 80, spread: 100, origin: { y: 0.5 } },
      playWhooshOnNext: true,
    });

  return (
    <motion.div
      className="card p-6"
      style={{ background: colors.clockFace }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-bold mb-4 text-center" style={{ color: colors.secondary }}>
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
        <div className="flex items-center justify-center gap-2 mb-2">
          <p className="text-lg font-medium" style={{ color: colors.secondary }}>
            What time is
          </p>
          <motion.button
            className="p-1.5 rounded-full"
            style={{ background: `${colors.primary}30` }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSpeakQuestion}
            title="Listen to the question"
          >
            <Volume2 size={18} style={{ color: colors.primary }} />
          </motion.button>
        </div>
        <p className="text-2xl font-bold" style={{ color: colors.primary }}>
          "{problem.timeInWords}"?
        </p>
      </motion.div>

      {/* Answer input or result */}
      <QuizAnswerSection
        showResult={showResult}
        resultClassName="text-center"
        inputContent={
          <>
            <TimeInput value={userAnswer} onChange={setUserAnswer} showPeriod compact />
            <QuizActionButton
              onClick={handleCheck}
              backgroundColor={colors.primary}
              className="mt-4 text-lg"
            >
              Check Answer!
            </QuizActionButton>
          </>
        }
        resultContent={
          <>
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
                {String(problem.correctTime.minutes).padStart(2, '0')} {problem.correctTime.period}
              </div>
            )}
            <QuizActionButton onClick={handleNext} backgroundColor={colors.secondary}>
              Next Challenge
            </QuizActionButton>
          </>
        }
      />
    </motion.div>
  );
}
