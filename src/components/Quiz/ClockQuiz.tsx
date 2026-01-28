import { motion } from 'framer-motion';
import { useCallback, useRef } from 'react';
import { useQuiz } from '../../hooks/useQuiz';
import { useSound } from '../../hooks/useSound';
import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';
import { QuizCard } from './QuizCard';
import { WordProblem } from './WordProblem';

// Simple skeleton for loading state
function QuizSkeleton({ color }: { color: string }) {
  return <div className="h-48 rounded-2xl animate-pulse" style={{ background: `${color}20` }} />;
}

export function ClockQuiz() {
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;
  const { playSound } = useSound();
  const lastRefreshTime = useRef(0);

  const {
    quizQuestions,
    wordProblem,
    checkQuizAnswer,
    checkWordProblemAnswer,
    refreshQuestions,
    refreshSingleQuestion,
    refreshWordProblem,
  } = useQuiz();

  // Debounce refresh to prevent rapid clicking (300ms minimum between refreshes)
  const handleRefresh = useCallback(() => {
    const now = Date.now();
    if (now - lastRefreshTime.current < 300) return;
    lastRefreshTime.current = now;

    playSound('whoosh');
    refreshQuestions();
  }, [playSound, refreshQuestions]);

  const isLoading = quizQuestions.length === 0;

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
          {isLoading
            ? // Show skeletons while loading
              [0, 1, 2].map((i) => <QuizSkeleton key={i} color={colors.primary} />)
            : quizQuestions.map((question) => (
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
