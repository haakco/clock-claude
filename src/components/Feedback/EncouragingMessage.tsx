import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';

const messages = {
  start: ['Let\'s learn about time!', 'Ready to tell time?', 'Time for fun!'],
  streak1: ['Great start!', 'Nice one!', 'You got it!'],
  streak3: ['You\'re on fire!', 'Amazing!', 'Keep it up!'],
  streak5: ['Incredible!', 'Time master!', 'Unstoppable!'],
  streak10: ['LEGENDARY!', 'Clock champion!', 'Perfect timing!'],
};

function getRandomMessage(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}

export function EncouragingMessage() {
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;
  const { streak } = useGameStore();

  let messageType: keyof typeof messages = 'start';
  if (streak >= 10) messageType = 'streak10';
  else if (streak >= 5) messageType = 'streak5';
  else if (streak >= 3) messageType = 'streak3';
  else if (streak >= 1) messageType = 'streak1';

  const message = getRandomMessage(messages[messageType]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${messageType}-${streak}`}
        className="text-center py-2 px-4 rounded-full font-bold"
        style={{
          background: `${colors.primary}20`,
          color: colors.primary,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        {message}
      </motion.div>
    </AnimatePresence>
  );
}
