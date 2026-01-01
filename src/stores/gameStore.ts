import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Difficulty, QuizQuestion, WordProblem, Time } from '../types';
import { generateQuizTime } from '../utils/generateQuizTime';
import { timeToWords } from '../utils/timeToWords';

interface GameState {
  // Current time on main clock
  currentTime: Time;
  setCurrentTime: (time: Time) => void;

  // Dragging state for clock hands
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;

  // Score tracking
  score: number;
  streak: number;
  addPoints: (points: number) => void;
  resetStreak: () => void;

  // Difficulty
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;

  // Quiz questions
  quizQuestions: QuizQuestion[];
  generateNewQuizQuestions: () => void;
  answerQuizQuestion: (id: string, correct: boolean) => void;

  // Word problem
  wordProblem: WordProblem | null;
  generateNewWordProblem: () => void;
  answerWordProblem: (correct: boolean) => void;

  // Sound
  soundEnabled: boolean;
  toggleSound: () => void;

  // Reset
  resetGame: () => void;
}

const createQuizQuestion = (difficulty: Difficulty): QuizQuestion => {
  const time = generateQuizTime(difficulty);
  return {
    id: crypto.randomUUID(),
    time,
    answered: false,
    correct: null,
  };
};

const createWordProblem = (difficulty: Difficulty): WordProblem => {
  const time = generateQuizTime(difficulty);
  return {
    id: crypto.randomUUID(),
    timeInWords: timeToWords(time),
    correctTime: time,
    answered: false,
    correct: null,
  };
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Current time - default to 3:00 PM
      currentTime: { hours: 3, minutes: 0, period: 'PM' },
      setCurrentTime: (time) => set({ currentTime: time }),

      // Dragging state
      isDragging: false,
      setIsDragging: (dragging) => set({ isDragging: dragging }),

      // Score
      score: 0,
      streak: 0,
      addPoints: (points) =>
        set((state) => ({
          score: state.score + points,
          streak: state.streak + 1,
        })),
      resetStreak: () => set({ streak: 0 }),

      // Difficulty
      difficulty: 'medium',
      setDifficulty: (difficulty) => {
        set({ difficulty });
        // Regenerate questions for new difficulty
        get().generateNewQuizQuestions();
        get().generateNewWordProblem();
      },

      // Quiz questions
      quizQuestions: [],
      generateNewQuizQuestions: () => {
        const { difficulty } = get();
        set({
          quizQuestions: [
            createQuizQuestion(difficulty),
            createQuizQuestion(difficulty),
            createQuizQuestion(difficulty),
          ],
        });
      },
      answerQuizQuestion: (id, correct) => {
        set((state) => ({
          quizQuestions: state.quizQuestions.map((q) =>
            q.id === id ? { ...q, answered: true, correct } : q
          ),
        }));
        if (correct) {
          get().addPoints(1);
        } else {
          get().resetStreak();
        }
      },

      // Word problem
      wordProblem: null,
      generateNewWordProblem: () => {
        const { difficulty } = get();
        set({ wordProblem: createWordProblem(difficulty) });
      },
      answerWordProblem: (correct) => {
        set((state) => ({
          wordProblem: state.wordProblem
            ? { ...state.wordProblem, answered: true, correct }
            : null,
        }));
        if (correct) {
          get().addPoints(1);
        } else {
          get().resetStreak();
        }
      },

      // Sound
      soundEnabled: true,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      // Reset
      resetGame: () => {
        set({ score: 0, streak: 0 });
        get().generateNewQuizQuestions();
        get().generateNewWordProblem();
      },
    }),
    {
      name: 'clock-game-state',
      partialize: (state) => ({
        score: state.score,
        difficulty: state.difficulty,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
);
