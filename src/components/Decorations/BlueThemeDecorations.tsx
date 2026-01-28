import { Car, Rocket, Star } from 'lucide-react';
import { Dinosaur, SoccerBall } from './CustomIcons';
import { FloatingDecorations } from './FloatingDecorations';

const decorations = [
  { Icon: Rocket, x: '5%', y: '20%', size: 40, rotate: 45, delay: 0 },
  { Icon: Dinosaur, x: '90%', y: '15%', size: 45, rotate: 0, delay: 0.2 },
  { Icon: Car, x: '8%', y: '80%', size: 45, rotate: 0, delay: 0.4 },
  { Icon: SoccerBall, x: '85%', y: '75%', size: 35, rotate: 15, delay: 0.6 },
  { Icon: Rocket, x: '92%', y: '45%', size: 35, rotate: -30, delay: 0.8 },
  { Icon: Dinosaur, x: '3%', y: '50%', size: 38, rotate: -10, delay: 1.0 },
];

const floatingItems = [
  {
    count: 6,
    baseSize: 20,
    sizeIncrement: 3,
    colorClass: 'text-yellow-300/20',
    Icon: Star,
    filled: true,
    keyPrefix: 'star',
  },
];

export function BlueThemeDecorations() {
  return (
    <FloatingDecorations
      decorations={decorations}
      decorationColorClass="text-blue-300/30"
      floatingItems={floatingItems}
    />
  );
}
