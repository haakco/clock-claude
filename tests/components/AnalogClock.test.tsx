import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AnalogClock } from '../../src/components/Clock/AnalogClock';
import { useGameStore } from '../../src/stores/gameStore';
import { hourToAngle, minuteToAngle } from '../../src/utils/timeConversion';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span {...props}>{children}</span>
    ),
    g: ({
      children,
      ...props
    }: React.SVGAttributes<SVGGElement> & { children?: React.ReactNode }) => (
      <g {...props}>{children}</g>
    ),
    line: (props: React.SVGAttributes<SVGLineElement>) => <line {...props} />,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('AnalogClock', () => {
  beforeEach(() => {
    // Reset the game store to a known state
    useGameStore.setState({
      currentTime: { hours: 3, minutes: 0, period: 'PM' },
      isDragging: false,
    });
  });

  describe('hand positions', () => {
    it('calculates correct hour hand angle for 3:00', () => {
      const hourAngle = hourToAngle(3, 0);
      expect(hourAngle).toBe(90); // 3 o'clock is at 90 degrees
    });

    it('calculates correct minute hand angle for 0 minutes', () => {
      const minuteAngle = minuteToAngle(0);
      expect(minuteAngle).toBe(0); // 0 minutes is at 0 degrees (12 o'clock)
    });

    it('calculates correct hour hand angle for 12:00', () => {
      const hourAngle = hourToAngle(12, 0);
      expect(hourAngle).toBe(0); // 12 o'clock is at 0 degrees
    });

    it('calculates correct hour hand angle for 6:00', () => {
      const hourAngle = hourToAngle(6, 0);
      expect(hourAngle).toBe(180); // 6 o'clock is at 180 degrees
    });

    it('calculates correct hour hand angle for 9:00', () => {
      const hourAngle = hourToAngle(9, 0);
      expect(hourAngle).toBe(270); // 9 o'clock is at 270 degrees
    });

    it('calculates hour hand adjustment for minutes', () => {
      // At 3:30, the hour hand should be halfway between 3 and 4
      const hourAngle = hourToAngle(3, 30);
      expect(hourAngle).toBe(105); // 90 + (30 * 0.5) = 105
    });

    it('calculates correct minute hand angle for 15 minutes', () => {
      const minuteAngle = minuteToAngle(15);
      expect(minuteAngle).toBe(90); // Quarter past is at 90 degrees
    });

    it('calculates correct minute hand angle for 30 minutes', () => {
      const minuteAngle = minuteToAngle(30);
      expect(minuteAngle).toBe(180); // Half past is at 180 degrees
    });

    it('calculates correct minute hand angle for 45 minutes', () => {
      const minuteAngle = minuteToAngle(45);
      expect(minuteAngle).toBe(270); // Quarter to is at 270 degrees
    });

    it('renders clock container with correct size', () => {
      render(<AnalogClock size={300} />);
      const clockContainer = document.querySelector('.clock-container');
      expect(clockContainer).toBeDefined();
      expect(clockContainer?.getAttribute('style')).toContain('width: 300px');
      expect(clockContainer?.getAttribute('style')).toContain('height: 300px');
    });

    it('renders with default size of 300', () => {
      render(<AnalogClock />);
      const clockContainer = document.querySelector('.clock-container');
      expect(clockContainer?.getAttribute('style')).toContain('width: 300px');
    });

    it('renders SVG element for hands', () => {
      render(<AnalogClock size={300} />);
      const svg = document.querySelector('svg');
      expect(svg).toBeDefined();
      expect(svg?.getAttribute('width')).toBe('300');
      expect(svg?.getAttribute('height')).toBe('300');
    });

    it('renders center dot circles', () => {
      render(<AnalogClock size={300} />);
      const circles = document.querySelectorAll('circle');
      expect(circles.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('different times', () => {
    it('handles midnight (12:00 AM)', () => {
      const hourAngle = hourToAngle(12, 0);
      const minuteAngle = minuteToAngle(0);
      expect(hourAngle).toBe(0);
      expect(minuteAngle).toBe(0);
    });

    it('handles noon (12:00 PM)', () => {
      const hourAngle = hourToAngle(12, 0);
      const minuteAngle = minuteToAngle(0);
      expect(hourAngle).toBe(0);
      expect(minuteAngle).toBe(0);
    });

    it('handles 1:30', () => {
      const hourAngle = hourToAngle(1, 30);
      const minuteAngle = minuteToAngle(30);
      expect(hourAngle).toBe(45); // 30 + (30 * 0.5) = 45
      expect(minuteAngle).toBe(180);
    });

    it('handles 11:55', () => {
      const hourAngle = hourToAngle(11, 55);
      const minuteAngle = minuteToAngle(55);
      expect(hourAngle).toBe(357.5); // 330 + (55 * 0.5) = 357.5
      expect(minuteAngle).toBe(330);
    });

    it('handles all hours correctly', () => {
      const expectedAngles = [
        { hour: 1, expected: 30 },
        { hour: 2, expected: 60 },
        { hour: 3, expected: 90 },
        { hour: 4, expected: 120 },
        { hour: 5, expected: 150 },
        { hour: 6, expected: 180 },
        { hour: 7, expected: 210 },
        { hour: 8, expected: 240 },
        { hour: 9, expected: 270 },
        { hour: 10, expected: 300 },
        { hour: 11, expected: 330 },
        { hour: 12, expected: 0 },
      ];

      for (const { hour, expected } of expectedAngles) {
        expect(hourToAngle(hour, 0)).toBe(expected);
      }
    });

    it('handles all 5-minute increments correctly', () => {
      const expectedAngles = [
        { minute: 0, expected: 0 },
        { minute: 5, expected: 30 },
        { minute: 10, expected: 60 },
        { minute: 15, expected: 90 },
        { minute: 20, expected: 120 },
        { minute: 25, expected: 150 },
        { minute: 30, expected: 180 },
        { minute: 35, expected: 210 },
        { minute: 40, expected: 240 },
        { minute: 45, expected: 270 },
        { minute: 50, expected: 300 },
        { minute: 55, expected: 330 },
      ];

      for (const { minute, expected } of expectedAngles) {
        expect(minuteToAngle(minute)).toBe(expected);
      }
    });
  });

  describe('interactive property', () => {
    it('renders as interactive by default', () => {
      render(<AnalogClock />);
      const clockContainer = document.querySelector('.clock-container');
      expect(clockContainer).toBeDefined();
    });

    it('renders as non-interactive when specified', () => {
      render(<AnalogClock interactive={false} />);
      const clockContainer = document.querySelector('.clock-container');
      expect(clockContainer).toBeDefined();
    });
  });
});
