import { motion } from 'framer-motion';
import { useQuiz } from '../../hooks/useQuiz';
import { useSound } from '../../hooks/useSound';
import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';
import { QuizCard } from './QuizCard';
import { WordProblem } from './WordProblem';

export function ClockQuiz() {
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;
  const { playSound } = useSound();

  const {
    quizQuestions,
    wordProblem,
    checkQuizAnswer,
    checkWordProblemAnswer,
    refreshQuestions,
    refreshSingleQuestion,
    refreshWordProblem,
  } = useQuiz();

  const handleRefresh = () => {
    playSound('whoosh');
    refreshQuestions();
  };

  return (
    <div className="space-y-6">
      {/* Score and refresh */}
      <div className="flex justify-end">
        <motion.button
          className="px-4 py-2 rounded-full font-bold text-white flex items-center gap-2"
          style={{ background: colors.secondary }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
        >
          <span>🔄</span>
          New Questions
        </motion.button>
      </div>

      {/* Quiz clocks grid */}
      <div>
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.secondary }}>
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
          onNext={refreshWordProblem}
        />
      )}
    </div>
  );
}
