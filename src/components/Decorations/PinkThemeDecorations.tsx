import { motion } from 'framer-motion';
import { Heart, Flower2 } from 'lucide-react';
import { Butterfly, Unicorn, Rainbow } from './CustomIcons';

export function PinkThemeDecorations() {
  const decorations = [
    { Icon: Butterfly, x: '5%', y: '20%', size: 40, rotate: -15, delay: 0 },
    { Icon: Unicorn, x: '90%', y: '15%', size: 45, rotate: 0, delay: 0.2 },
    { Icon: Flower2, x: '8%', y: '80%', size: 45, rotate: 0, delay: 0.4 },
    { Icon: Heart, x: '85%', y: '75%', size: 30, rotate: 15, delay: 0.6 },
    { Icon: Butterfly, x: '92%', y: '45%', size: 35, rotate: -30, delay: 0.8 },
    { Icon: Unicorn, x: '3%', y: '50%', size: 40, rotate: 10, delay: 1.0 },
  ];

  const rainbows = [
    { x: '15%', y: '10%', size: 60, delay: 0.3 },
    { x: '75%', y: '85%', size: 50, delay: 0.7 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {decorations.map((dec, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-300/30"
          style={{ left: dec.x, top: dec.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: [dec.rotate, dec.rotate + 10, dec.rotate],
          }}
          transition={{
            delay: dec.delay,
            duration: 0.5,
            rotate: {
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          <dec.Icon size={dec.size} />
        </motion.div>
      ))}

      {/* Floating hearts animation */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          className="absolute text-pink-400/20"
          style={{
            left: `${15 + i * 15}%`,
            top: `${10 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          <Heart size={20 + i * 3} fill="currentColor" />
        </motion.div>
      ))}

      {/* Rainbow decorations */}
      {rainbows.map((rainbow, i) => (
        <motion.div
          key={`rainbow-${i}`}
          className="absolute"
          style={{ left: rainbow.x, top: rainbow.y, opacity: 0.3 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ delay: rainbow.delay, duration: 0.5 }}
        >
          <Rainbow size={rainbow.size} />
        </motion.div>
      ))}

      {/* Sparkle effect */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-2 h-2 rounded-full bg-purple-300/30"
          style={{
            left: `${10 + (i * 11)}%`,
            top: `${15 + (i * 10)}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
}
