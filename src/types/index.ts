export interface Time {
  hours: number; // 1-12 for display, stored as 0-23 internally
  minutes: number; // 0-59
  period: 'AM' | 'PM';
}

export interface Time24 {
  hours: number; // 0-23
  minutes: number; // 0-59
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Theme = 'blue' | 'pink';

export interface QuizQuestion {
  id: string;
  time: Time;
  answered: boolean;
  correct: boolean | null;
}

export interface WordProblem {
  id: string;
  timeInWords: string;
  correctTime: Time;
  answered: boolean;
  correct: boolean | null;
}

export interface GameState {
  score: number;
  streak: number;
  difficulty: Difficulty;
  quizQuestions: QuizQuestion[];
  wordProblem: WordProblem | null;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  clockFace: string;
  clockBorder: string;
  hourHand: string;
  minuteHand: string;
  numbers: string;
  centerDot: string;
}

export interface ThemeConfig {
  name: Theme;
  colors: ThemeColors;
  decorations: string[];
}
