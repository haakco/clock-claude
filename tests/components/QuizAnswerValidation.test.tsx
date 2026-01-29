import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QuizCard } from '../../src/components/Quiz/QuizCard';
import type { QuizQuestion, Time } from '../../src/types';
import { timesEqual } from '../../src/utils/timeConversion';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock useSound hook
vi.mock('../../src/hooks/useSound', () => ({
  useSound: () => ({
    playSound: vi.fn(),
  }),
}));

describe('Quiz Answer Validation', () => {
  describe('timesEqual utility', () => {
    it('returns true for identical times', () => {
      const time1: Time = { hours: 3, minutes: 30, period: 'PM' };
      const time2: Time = { hours: 3, minutes: 30, period: 'PM' };
      expect(timesEqual(time1, time2)).toBe(true);
    });

    it('returns false when hours differ', () => {
      const time1: Time = { hours: 3, minutes: 30, period: 'PM' };
      const time2: Time = { hours: 4, minutes: 30, period: 'PM' };
      expect(timesEqual(time1, time2)).toBe(false);
    });

    it('returns false when minutes differ', () => {
      const time1: Time = { hours: 3, minutes: 30, period: 'PM' };
      const time2: Time = { hours: 3, minutes: 45, period: 'PM' };
      expect(timesEqual(time1, time2)).toBe(false);
    });

    it('returns false when period differs', () => {
      const time1: Time = { hours: 3, minutes: 30, period: 'PM' };
      const time2: Time = { hours: 3, minutes: 30, period: 'AM' };
      expect(timesEqual(time1, time2)).toBe(false);
    });

    it("validates o'clock times correctly", () => {
      const time1: Time = { hours: 12, minutes: 0, period: 'PM' };
      const time2: Time = { hours: 12, minutes: 0, period: 'PM' };
      expect(timesEqual(time1, time2)).toBe(true);
    });

    it('handles midnight (12:00 AM)', () => {
      const time1: Time = { hours: 12, minutes: 0, period: 'AM' };
      const time2: Time = { hours: 12, minutes: 0, period: 'AM' };
      expect(timesEqual(time1, time2)).toBe(true);
    });

    it('distinguishes between 12 AM and 12 PM', () => {
      const time1: Time = { hours: 12, minutes: 0, period: 'AM' };
      const time2: Time = { hours: 12, minutes: 0, period: 'PM' };
      expect(timesEqual(time1, time2)).toBe(false);
    });

    it('handles quarter past', () => {
      const time1: Time = { hours: 9, minutes: 15, period: 'AM' };
      const time2: Time = { hours: 9, minutes: 15, period: 'AM' };
      expect(timesEqual(time1, time2)).toBe(true);
    });

    it('handles half past', () => {
      const time1: Time = { hours: 6, minutes: 30, period: 'PM' };
      const time2: Time = { hours: 6, minutes: 30, period: 'PM' };
      expect(timesEqual(time1, time2)).toBe(true);
    });

    it('handles quarter to', () => {
      const time1: Time = { hours: 2, minutes: 45, period: 'PM' };
      const time2: Time = { hours: 2, minutes: 45, period: 'PM' };
      expect(timesEqual(time1, time2)).toBe(true);
    });
  });

  describe('QuizCard answer validation', () => {
    const createQuestion = (hours: number, minutes: number, period: 'AM' | 'PM'): QuizQuestion => ({
      id: 'test-question-1',
      time: { hours, minutes, period },
      answered: false,
      correct: null,
    });

    it('renders the check button', () => {
      const question = createQuestion(3, 0, 'PM');
      const onAnswer = vi.fn(() => true);
      const onNext = vi.fn();

      render(<QuizCard question={question} onAnswer={onAnswer} onNext={onNext} />);

      expect(screen.getByText('Check!')).toBeDefined();
    });

    it('calls onAnswer with question ID when check is clicked', () => {
      const question = createQuestion(3, 0, 'PM');
      const onAnswer = vi.fn(() => true);
      const onNext = vi.fn();

      render(<QuizCard question={question} onAnswer={onAnswer} onNext={onNext} />);

      const checkButton = screen.getByText('Check!');
      fireEvent.click(checkButton);

      expect(onAnswer).toHaveBeenCalledWith('test-question-1', expect.any(Object));
    });

    it('shows "Correct!" when answer is correct', () => {
      const question = createQuestion(12, 0, 'AM');
      const onAnswer = vi.fn(() => true);
      const onNext = vi.fn();

      render(<QuizCard question={question} onAnswer={onAnswer} onNext={onNext} />);

      const checkButton = screen.getByText('Check!');
      fireEvent.click(checkButton);

      expect(screen.getByText(/Correct!/)).toBeDefined();
    });

    it('shows "Try again!" when answer is incorrect', () => {
      const question = createQuestion(3, 30, 'PM');
      const onAnswer = vi.fn(() => false);
      const onNext = vi.fn();

      render(<QuizCard question={question} onAnswer={onAnswer} onNext={onNext} />);

      const checkButton = screen.getByText('Check!');
      fireEvent.click(checkButton);

      expect(screen.getByText(/Try again!/)).toBeDefined();
    });

    it('shows correct answer when wrong', () => {
      const question = createQuestion(5, 45, 'PM');
      const onAnswer = vi.fn(() => false);
      const onNext = vi.fn();

      render(<QuizCard question={question} onAnswer={onAnswer} onNext={onNext} />);

      const checkButton = screen.getByText('Check!');
      fireEvent.click(checkButton);

      expect(screen.getByText(/5:45/)).toBeDefined();
    });

    it('shows next question button after answering', () => {
      const question = createQuestion(9, 0, 'AM');
      const onAnswer = vi.fn(() => true);
      const onNext = vi.fn();

      render(<QuizCard question={question} onAnswer={onAnswer} onNext={onNext} />);

      const checkButton = screen.getByText('Check!');
      fireEvent.click(checkButton);

      expect(screen.getByText('Next Question')).toBeDefined();
    });

    it('calls onNext when next button is clicked', () => {
      const question = createQuestion(9, 0, 'AM');
      const onAnswer = vi.fn(() => true);
      const onNext = vi.fn();

      render(<QuizCard question={question} onAnswer={onAnswer} onNext={onNext} />);

      const checkButton = screen.getByText('Check!');
      fireEvent.click(checkButton);

      const nextButton = screen.getByText('Next Question');
      fireEvent.click(nextButton);

      expect(onNext).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('validates 1:00 correctly', () => {
      expect(
        timesEqual({ hours: 1, minutes: 0, period: 'PM' }, { hours: 1, minutes: 0, period: 'PM' }),
      ).toBe(true);
    });

    it('validates 11:55 correctly', () => {
      expect(
        timesEqual(
          { hours: 11, minutes: 55, period: 'PM' },
          { hours: 11, minutes: 55, period: 'PM' },
        ),
      ).toBe(true);
    });

    it('validates single-digit minutes', () => {
      expect(
        timesEqual({ hours: 7, minutes: 5, period: 'AM' }, { hours: 7, minutes: 5, period: 'AM' }),
      ).toBe(true);
    });

    it('does not confuse AM/PM for same hour/minute', () => {
      expect(
        timesEqual(
          { hours: 10, minutes: 30, period: 'AM' },
          { hours: 10, minutes: 30, period: 'PM' },
        ),
      ).toBe(false);
    });
  });
});
