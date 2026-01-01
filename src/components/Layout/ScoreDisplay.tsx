import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { Star, Zap } from 'lucide-react';

export function ScoreDisplay() {
  const { score, streak } = useGameStore();

  return (
    <div className="flex items-center gap-4">
      {/* Score */}
      <motion.div
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white font-bold"
        whileHover={{ scale: 1.05 }}
      >
        <Star className="text-yellow-300" size={20} fill="currentColor" />
        <AnimatePresence mode="wait">
          <motion.span
            key={score}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {score}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* Streak */}
      {streak > 0 && (
        <motion.div
          className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500 text-white font-bold text-sm"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          <Zap size={16} fill="currentColor" />
          {streak}x
        </motion.div>
      )}
    </div>
  );
}
