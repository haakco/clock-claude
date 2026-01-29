import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

type IconComponent = LucideIcon | ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

interface Decoration {
  Icon: IconComponent;
  x: string;
  y: string;
  size: number;
  rotate: number;
  delay: number;
}

interface FloatingItem {
  count: number;
  baseSize: number;
  sizeIncrement: number;
  colorClass: string;
  Icon: IconComponent;
  filled?: boolean;
  keyPrefix: string;
  animation?: {
    scale?: number[];
  };
}

interface FloatingDecorationsProps {
  decorations: Decoration[];
  decorationColorClass: string;
  floatingItems: FloatingItem[];
  children?: React.ReactNode;
}

export function FloatingDecorations({
  decorations,
  decorationColorClass,
  floatingItems,
  children,
}: FloatingDecorationsProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Static decorations with gentle rotation */}
      {decorations.map((dec, i) => (
        <motion.div
          key={`decoration-${i}`}
          className={`absolute ${decorationColorClass}`}
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

      {/* Floating animated items */}
      {floatingItems.map((item) =>
        [...new Array(item.count)].map((_, i) => (
          <motion.div
            key={`${item.keyPrefix}-${i}`}
            className={`absolute ${item.colorClass}`}
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, item.animation?.scale ? 0.4 : 0.5, 0.2],
              ...(item.animation?.scale && { scale: item.animation.scale }),
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            <item.Icon
              size={item.baseSize + i * item.sizeIncrement}
              {...(item.filled && { fill: 'currentColor' })}
            />
          </motion.div>
        )),
      )}

      {/* Theme-specific additional decorations */}
      {children}
    </div>
  );
}
