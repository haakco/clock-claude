import { motion } from 'framer-motion';
import { Rocket, Star, Car } from 'lucide-react';
import { Dinosaur, SoccerBall } from './CustomIcons';

export function BlueThemeDecorations() {
  const decorations = [
    { Icon: Rocket, x: '5%', y: '20%', size: 40, rotate: 45, delay: 0 },
    { Icon: Dinosaur, x: '90%', y: '15%', size: 45, rotate: 0, delay: 0.2 },
    { Icon: Car, x: '8%', y: '80%', size: 45, rotate: 0, delay: 0.4 },
    { Icon: SoccerBall, x: '85%', y: '75%', size: 35, rotate: 15, delay: 0.6 },
    { Icon: Rocket, x: '92%', y: '45%', size: 35, rotate: -30, delay: 0.8 },
    { Icon: Dinosaur, x: '3%', y: '50%', size: 38, rotate: -10, delay: 1.0 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {decorations.map((dec, i) => (
        <motion.div
          key={i}
          className="absolute text-blue-300/30"
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

      {/* Floating stars animation */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute text-yellow-300/20"
          style={{
            left: `${15 + i * 15}%`,
            top: `${10 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          <Star size={20 + i * 3} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
}
