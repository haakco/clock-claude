import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnalogClock } from './components/Clock';
import { DigitalTime, TimeInput } from './components/DigitalDisplay';
import { ClockQuiz } from './components/Quiz';
import { Header } from './components/Layout';
import { EncouragingMessage } from './components/Feedback';
import {
  BlueThemeDecorations,
  PinkThemeDecorations,
} from './components/Decorations';
import { useThemeStore } from './stores/themeStore';
import { useGameStore } from './stores/gameStore';
import { getTheme } from './themes';
import { useTime } from './hooks/useTime';

function App() {
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;
  const { generateNewQuizQuestions, generateNewWordProblem } = useGameStore();
  const { time, setFullTime } = useTime();

  // Initialize quiz on mount
  useEffect(() => {
    generateNewQuizQuestions();
    generateNewWordProblem();
  }, [generateNewQuizQuestions, generateNewWordProblem]);

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{ background: colors.background }}
    >
      {/* Theme decorations */}
      {theme === 'blue' ? <BlueThemeDecorations /> : <PinkThemeDecorations />}

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Main clock and controls */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Encouraging message */}
            <div className="flex justify-center">
              <EncouragingMessage />
            </div>

            {/* Main interactive clock */}
            <div className="flex justify-center">
              <AnalogClock size={300} interactive />
            </div>

            {/* Digital display */}
            <motion.div
              className="card"
              style={{ background: colors.clockFace }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DigitalTime time={time} showWords show24Hour />
            </motion.div>

            {/* Time input */}
            <motion.div
              className="card"
              style={{ background: colors.clockFace }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3
                className="text-lg font-bold mb-3 text-center"
                style={{ color: colors.secondary }}
              >
                Set the time
              </h3>
              <TimeInput value={time} onChange={setFullTime} />
            </motion.div>
          </motion.div>

          {/* Right column - Quiz */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ClockQuiz />
          </motion.div>
        </div>

        {/* Instructions for kids */}
        <motion.div
          className="mt-8 text-center p-6 rounded-2xl"
          style={{ background: `${colors.primary}10` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2
            className="text-xl font-bold mb-2"
            style={{ color: colors.secondary }}
          >
            How to Play
          </h2>
          <div
            className="text-lg space-y-1"
            style={{ color: colors.secondary }}
          >
            <p>👆 Drag the clock hands to change the time</p>
            <p>🎯 Look at the small clocks and enter the time shown</p>
            <p>📝 Read the word puzzles and enter the matching time</p>
            <p>⭐ Get points for each correct answer!</p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer
        className="text-center py-4 text-sm opacity-50"
        style={{ color: colors.secondary }}
      >
        Learn to Tell Time - Made with ❤️ for kids
      </footer>
    </div>
  );
}

export default App;
