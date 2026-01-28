import { motion } from 'framer-motion';
import { useThemeStore } from '../../stores/themeStore';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <motion.button
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white font-bold"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ type: 'spring' }}
      >
        {theme === 'blue' ? '🔵' : '🩷'}
      </motion.span>
      <span className="hidden sm:inline">{theme === 'blue' ? 'Blue' : 'Pink'}</span>
    </motion.button>
  );
}
