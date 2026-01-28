import { motion } from 'framer-motion';
import { useQuizAnswer } from '../../hooks/useQuizAnswer';
import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';
import type { QuizQuestion, Time } from '../../types';
import { MiniClock } from '../Clock/MiniClock';
import { TimeInput } from '../DigitalDisplay/TimeInput';
import { QuizActionButton } from './QuizActionButton';
import { QuizAnswerSection } from './QuizAnswerSection';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (questionId: string, userAnswer: Time) => boolean;
  onNext: () => void;
}

export function QuizCard({ question, onAnswer, onNext }: QuizCardProps) {
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;

  const { userAnswer, setUserAnswer, showResult, isCorrect, handleCheck, handleNext } =
    useQuizAnswer({
      onAnswer: (answer) => onAnswer(question.id, answer),
      onNext,
      confettiColors: [colors.primary, colors.accent, '#ffd700'],
    });

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
      <QuizAnswerSection
        showResult={showResult}
        inputClassName="w-full"
        resultClassName="text-center w-full"
        inputContent={
          <>
            <TimeInput value={userAnswer} onChange={setUserAnswer} showPeriod={false} compact />
            <QuizActionButton
              onClick={handleCheck}
              backgroundColor={colors.primary}
              className="mt-3"
            >
              Check!
            </QuizActionButton>
          </>
        }
        resultContent={
          <>
            {isCorrect ? (
              <div className="text-green-500 text-2xl font-bold mb-2">Correct! 🎉</div>
            ) : (
              <div className="text-red-500 text-xl font-bold mb-2">
                Try again! The answer is {question.time.hours}:
                {String(question.time.minutes).padStart(2, '0')}
              </div>
            )}
            <QuizActionButton onClick={handleNext} backgroundColor={colors.secondary}>
              Next Question
            </QuizActionButton>
          </>
        }
      />
    </motion.div>
  );
}
