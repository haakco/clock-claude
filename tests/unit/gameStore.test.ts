import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGameStore } from '../../src/stores/gameStore';

// Mock crypto.randomUUID
vi.stubGlobal('crypto', {
  randomUUID: () => `test-uuid-${Math.random().toString(36).substring(2)}`,
});

describe('gameStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useGameStore.setState({
      score: 0,
      streak: 0,
      difficulty: 'medium',
      currentTime: { hours: 3, minutes: 0, period: 'PM' },
      isDragging: false,
      quizQuestions: [],
      wordProblem: null,
      soundEnabled: true,
    });
  });

  describe('score calculation', () => {
    it('starts with score of 0', () => {
      expect(useGameStore.getState().score).toBe(0);
    });

    it('starts with streak of 0', () => {
      expect(useGameStore.getState().streak).toBe(0);
    });

    it('adds points correctly', () => {
      useGameStore.getState().addPoints(1);
      expect(useGameStore.getState().score).toBe(1);
      expect(useGameStore.getState().streak).toBe(1);
    });

    it('accumulates points over multiple correct answers', () => {
      useGameStore.getState().addPoints(1);
      useGameStore.getState().addPoints(1);
      useGameStore.getState().addPoints(1);
      expect(useGameStore.getState().score).toBe(3);
      expect(useGameStore.getState().streak).toBe(3);
    });

    it('resets streak to 0', () => {
      useGameStore.getState().addPoints(1);
      useGameStore.getState().addPoints(1);
      expect(useGameStore.getState().streak).toBe(2);

      useGameStore.getState().resetStreak();
      expect(useGameStore.getState().streak).toBe(0);
      expect(useGameStore.getState().score).toBe(2); // Score should remain
    });

    it('tracks score and streak independently', () => {
      useGameStore.getState().addPoints(5);
      expect(useGameStore.getState().score).toBe(5);
      expect(useGameStore.getState().streak).toBe(1);

      useGameStore.getState().addPoints(3);
      expect(useGameStore.getState().score).toBe(8);
      expect(useGameStore.getState().streak).toBe(2);
    });
  });

  describe('quiz question answering', () => {
    beforeEach(() => {
      useGameStore.getState().generateNewQuizQuestions();
    });

    it('generates 3 quiz questions', () => {
      expect(useGameStore.getState().quizQuestions.length).toBe(3);
    });

    it('adds points on correct quiz answer', () => {
      const questions = useGameStore.getState().quizQuestions;
      useGameStore.getState().answerQuizQuestion(questions[0].id, true);

      expect(useGameStore.getState().score).toBe(1);
      expect(useGameStore.getState().streak).toBe(1);
    });

    it('resets streak on incorrect quiz answer', () => {
      // First build up a streak
      useGameStore.getState().addPoints(1);
      useGameStore.getState().addPoints(1);
      expect(useGameStore.getState().streak).toBe(2);

      const questions = useGameStore.getState().quizQuestions;
      useGameStore.getState().answerQuizQuestion(questions[0].id, false);

      expect(useGameStore.getState().streak).toBe(0);
      expect(useGameStore.getState().score).toBe(2); // Score doesn't decrease
    });

    it('marks question as answered', () => {
      const questions = useGameStore.getState().quizQuestions;
      useGameStore.getState().answerQuizQuestion(questions[0].id, true);

      const updatedQuestion = useGameStore
        .getState()
        .quizQuestions.find((q) => q.id === questions[0].id);
      expect(updatedQuestion?.answered).toBe(true);
      expect(updatedQuestion?.correct).toBe(true);
    });
  });

  describe('word problem answering', () => {
    beforeEach(() => {
      useGameStore.getState().generateNewWordProblem();
    });

    it('generates a word problem', () => {
      expect(useGameStore.getState().wordProblem).not.toBeNull();
    });

    it('adds points on correct word problem answer', () => {
      useGameStore.getState().answerWordProblem(true);

      expect(useGameStore.getState().score).toBe(1);
      expect(useGameStore.getState().streak).toBe(1);
    });

    it('resets streak on incorrect word problem answer', () => {
      // Build up a streak
      useGameStore.getState().addPoints(1);
      expect(useGameStore.getState().streak).toBe(1);

      useGameStore.getState().answerWordProblem(false);

      expect(useGameStore.getState().streak).toBe(0);
      expect(useGameStore.getState().score).toBe(1);
    });

    it('marks word problem as answered', () => {
      useGameStore.getState().answerWordProblem(true);

      expect(useGameStore.getState().wordProblem?.answered).toBe(true);
      expect(useGameStore.getState().wordProblem?.correct).toBe(true);
    });
  });

  describe('game reset', () => {
    it('resets score and streak', () => {
      useGameStore.getState().addPoints(5);
      useGameStore.getState().addPoints(3);

      useGameStore.getState().resetGame();

      expect(useGameStore.getState().score).toBe(0);
      expect(useGameStore.getState().streak).toBe(0);
    });

    it('generates new quiz questions on reset', () => {
      useGameStore.getState().generateNewQuizQuestions();
      const originalIds = useGameStore.getState().quizQuestions.map((q) => q.id);

      useGameStore.getState().resetGame();

      const newIds = useGameStore.getState().quizQuestions.map((q) => q.id);
      expect(newIds).not.toEqual(originalIds);
    });

    it('generates new word problem on reset', () => {
      useGameStore.getState().generateNewWordProblem();
      const originalId = useGameStore.getState().wordProblem?.id;

      useGameStore.getState().resetGame();

      const newId = useGameStore.getState().wordProblem?.id;
      expect(newId).not.toBe(originalId);
    });
  });

  describe('difficulty changes', () => {
    it('starts with medium difficulty', () => {
      expect(useGameStore.getState().difficulty).toBe('medium');
    });

    it('changes difficulty', () => {
      useGameStore.getState().setDifficulty('easy');
      expect(useGameStore.getState().difficulty).toBe('easy');

      useGameStore.getState().setDifficulty('hard');
      expect(useGameStore.getState().difficulty).toBe('hard');
    });

    it('regenerates quiz questions when difficulty changes', () => {
      useGameStore.getState().generateNewQuizQuestions();
      const originalIds = useGameStore.getState().quizQuestions.map((q) => q.id);

      useGameStore.getState().setDifficulty('easy');

      const newIds = useGameStore.getState().quizQuestions.map((q) => q.id);
      expect(newIds).not.toEqual(originalIds);
    });

    it('regenerates word problem when difficulty changes', () => {
      useGameStore.getState().generateNewWordProblem();
      const originalId = useGameStore.getState().wordProblem?.id;

      useGameStore.getState().setDifficulty('hard');

      const newId = useGameStore.getState().wordProblem?.id;
      expect(newId).not.toBe(originalId);
    });
  });

  describe('sound toggle', () => {
    it('starts with sound enabled', () => {
      expect(useGameStore.getState().soundEnabled).toBe(true);
    });

    it('toggles sound off', () => {
      useGameStore.getState().toggleSound();
      expect(useGameStore.getState().soundEnabled).toBe(false);
    });

    it('toggles sound back on', () => {
      useGameStore.getState().toggleSound(); // off
      useGameStore.getState().toggleSound(); // on
      expect(useGameStore.getState().soundEnabled).toBe(true);
    });
  });
});
