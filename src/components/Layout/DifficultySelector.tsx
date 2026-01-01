import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { Difficulty } from '../../types';

const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const difficultyEmojis: Record<Difficulty, string> = {
  easy: '🌟',
  medium: '⭐',
  hard: '🏆',
};

export function DifficultySelector() {
  const { difficulty, setDifficulty } = useGameStore();

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const currentIndex = difficulties.indexOf(difficulty);

  const handleCycle = () => {
    const nextIndex = (currentIndex + 1) % difficulties.length;
    setDifficulty(difficulties[nextIndex]);
  };

  return (
    <motion.button
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white font-bold"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCycle}
      title="Click to change difficulty"
    >
      <motion.span
        key={difficulty}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ type: 'spring' }}
      >
        {difficultyEmojis[difficulty]}
      </motion.span>
      <span className="hidden sm:inline">{difficultyLabels[difficulty]}</span>
    </motion.button>
  );
}
