import confetti from 'canvas-confetti';
import { useState } from 'react';
import type { Time } from '../types';
import { useSound } from './useSound';

interface UseQuizAnswerOptions {
  onAnswer: (userAnswer: Time) => boolean;
  onNext: () => void;
  confettiColors: string[];
  confettiConfig?: {
    particleCount?: number;
    spread?: number;
    origin?: { y: number };
  };
  playWhooshOnNext?: boolean;
}

interface UseQuizAnswerReturn {
  userAnswer: Time;
  setUserAnswer: (time: Time) => void;
  showResult: boolean;
  isCorrect: boolean;
  handleCheck: () => void;
  handleNext: () => void;
}

const DEFAULT_ANSWER: Time = { hours: 12, minutes: 0, period: 'AM' };

export function useQuizAnswer({
  onAnswer,
  onNext,
  confettiColors,
  confettiConfig = {},
  playWhooshOnNext = false,
}: UseQuizAnswerOptions): UseQuizAnswerReturn {
  const { playSound } = useSound();
  const [userAnswer, setUserAnswer] = useState<Time>(DEFAULT_ANSWER);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleCheck = () => {
    const correct = onAnswer(userAnswer);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      playSound('correct');
      confetti({
        particleCount: confettiConfig.particleCount ?? 50,
        spread: confettiConfig.spread ?? 60,
        origin: confettiConfig.origin ?? { y: 0.6 },
        colors: confettiColors,
      });
    } else {
      playSound('incorrect');
    }
  };

  const handleNext = () => {
    if (playWhooshOnNext) {
      playSound('whoosh');
    }
    setShowResult(false);
    setUserAnswer(DEFAULT_ANSWER);
    onNext();
  };

  return {
    userAnswer,
    setUserAnswer,
    showResult,
    isCorrect,
    handleCheck,
    handleNext,
  };
}
