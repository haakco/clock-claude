import { motion } from 'framer-motion';
import { QuizCard } from './QuizCard';
import { WordProblem } from './WordProblem';
import { useQuiz } from '../../hooks/useQuiz';
import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';

export function ClockQuiz() {
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;

  const {
    quizQuestions,
    wordProblem,
    checkQuizAnswer,
    checkWordProblemAnswer,
    refreshQuestions,
    refreshSingleQuestion,
  } = useQuiz();

  return (
    <div className="space-y-6">
      {/* Score and refresh */}
      <div className="flex justify-end">
        <motion.button
          className="px-4 py-2 rounded-full font-bold text-white flex items-center gap-2"
          style={{ background: colors.secondary }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={refreshQuestions}
        >
          <span>🔄</span>
          New Questions
        </motion.button>
      </div>

      {/* Quiz clocks grid */}
      <div>
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: colors.secondary }}
        >
          What time is shown?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quizQuestions.map((question) => (
            <QuizCard
              key={question.id}
              question={question}
              onAnswer={checkQuizAnswer}
              onNext={() => refreshSingleQuestion(question.id)}
            />
          ))}
        </div>
      </div>

      {/* Word problem */}
      {wordProblem && (
        <WordProblem
          problem={wordProblem}
          onAnswer={checkWordProblemAnswer}
          onNext={refreshQuestions}
        />
      )}
    </div>
  );
}
