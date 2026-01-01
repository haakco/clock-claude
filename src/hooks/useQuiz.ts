import { useCallback, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { Time } from '../types';

export function useQuiz() {
  const {
    quizQuestions,
    wordProblem,
    generateNewQuizQuestions,
    generateNewWordProblem,
    answerQuizQuestion,
    answerWordProblem,
    difficulty,
    score,
    streak,
  } = useGameStore();

  // Initialize questions on mount
  useEffect(() => {
    if (quizQuestions.length === 0) {
      generateNewQuizQuestions();
    }
    if (!wordProblem) {
      generateNewWordProblem();
    }
  }, [
    quizQuestions.length,
    wordProblem,
    generateNewQuizQuestions,
    generateNewWordProblem,
  ]);

  const checkQuizAnswer = useCallback(
    (questionId: string, userAnswer: Time): boolean => {
      const question = quizQuestions.find((q) => q.id === questionId);
      if (!question) return false;

      // Compare hours and minutes only (ignore AM/PM for quiz)
      const correct =
        question.time.hours === userAnswer.hours &&
        question.time.minutes === userAnswer.minutes;

      answerQuizQuestion(questionId, correct);
      return correct;
    },
    [quizQuestions, answerQuizQuestion]
  );

  const checkWordProblemAnswer = useCallback(
    (userAnswer: Time): boolean => {
      if (!wordProblem) return false;

      // Compare hours and minutes only
      const correct =
        wordProblem.correctTime.hours === userAnswer.hours &&
        wordProblem.correctTime.minutes === userAnswer.minutes;

      answerWordProblem(correct);
      return correct;
    },
    [wordProblem, answerWordProblem]
  );

  const refreshQuestions = useCallback(() => {
    generateNewQuizQuestions();
    generateNewWordProblem();
  }, [generateNewQuizQuestions, generateNewWordProblem]);

  const refreshSingleQuestion = useCallback(
    (_questionId: string) => {
      // This would regenerate a single question
      // For now, we'll just regenerate all
      generateNewQuizQuestions();
    },
    [generateNewQuizQuestions]
  );

  return {
    quizQuestions,
    wordProblem,
    difficulty,
    score,
    streak,
    checkQuizAnswer,
    checkWordProblemAnswer,
    refreshQuestions,
    refreshSingleQuestion,
  };
}
