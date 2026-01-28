import { motion } from 'framer-motion';
import { Flower2, Heart } from 'lucide-react';
import { Butterfly, Rainbow, Unicorn } from './CustomIcons';
import { FloatingDecorations } from './FloatingDecorations';

const decorations = [
  { Icon: Butterfly, x: '5%', y: '20%', size: 40, rotate: -15, delay: 0 },
  { Icon: Unicorn, x: '90%', y: '15%', size: 45, rotate: 0, delay: 0.2 },
  { Icon: Flower2, x: '8%', y: '80%', size: 45, rotate: 0, delay: 0.4 },
  { Icon: Heart, x: '85%', y: '75%', size: 30, rotate: 15, delay: 0.6 },
  { Icon: Butterfly, x: '92%', y: '45%', size: 35, rotate: -30, delay: 0.8 },
  { Icon: Unicorn, x: '3%', y: '50%', size: 40, rotate: 10, delay: 1.0 },
];

const floatingItems = [
  {
    count: 6,
    baseSize: 20,
    sizeIncrement: 3,
    colorClass: 'text-pink-400/20',
    Icon: Heart,
    filled: true,
    keyPrefix: 'heart',
    animation: { scale: [1, 1.2, 1] },
  },
];

const rainbows = [
  { x: '15%', y: '10%', size: 60, delay: 0.3 },
  { x: '75%', y: '85%', size: 50, delay: 0.7 },
];

export function PinkThemeDecorations() {
  return (
    <FloatingDecorations
      decorations={decorations}
      decorationColorClass="text-pink-300/30"
      floatingItems={floatingItems}
    >
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
      {[...new Array(8)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-2 h-2 rounded-full bg-purple-300/30"
          style={{
            left: `${10 + i * 11}%`,
            top: `${15 + i * 10}%`,
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
    </FloatingDecorations>
  );
}
