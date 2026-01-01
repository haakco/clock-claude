import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { ScoreDisplay } from './ScoreDisplay';
import { DifficultySelector } from './DifficultySelector';
import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';
import { useGameStore } from '../../stores/gameStore';
import { Volume2, VolumeX } from 'lucide-react';

export function Header() {
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;
  const { soundEnabled, toggleSound } = useGameStore();

  return (
    <motion.header
      className="py-4 px-6 rounded-b-3xl shadow-lg"
      style={{ background: colors.primary }}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Title */}
          <motion.h1
            className="text-2xl md:text-3xl font-display font-bold text-white"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            Learn to Tell Time!
          </motion.h1>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <ScoreDisplay />
            <DifficultySelector />

            {/* Sound toggle */}
            <motion.button
              className="p-2 rounded-full bg-white/20 text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSound}
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </motion.button>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
