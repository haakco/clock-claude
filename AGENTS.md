# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An interactive web-based game to help children aged 6-8 learn to tell time. Features an analog clock with draggable hands, digital displays, clock quizzes, word problems, and themed decorations.

**Live Site**: clock.catrgb.com

## Philosophy

It doesn't matter when a problem was caused or who caused it. It's always our problem to fix.

## Commands

```bash
# Development
npm run dev              # Start Vite dev server
npm run build            # TypeScript check + production build
npm run preview          # Preview production build

# Testing
npm test                 # Run unit tests (Vitest)
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run test:e2e         # Run Playwright E2E tests
npm run test:e2e:ui      # Run E2E tests with UI

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format with Prettier
npm run format:check     # Check formatting
```

## Architecture

### State Management

Two Zustand stores with localStorage persistence:
- **`gameStore`** (`src/stores/gameStore.ts`): Time, score, streak, difficulty, quiz questions, word problems, sound toggle
- **`themeStore`** (`src/stores/themeStore.ts`): Blue/pink theme selection

### Core Types (`src/types/index.ts`)

- **`Time`**: 12-hour format (hours 1-12, minutes 0-59, AM/PM)
- **`Time24`**: 24-hour format (hours 0-23, minutes 0-59)
- **`Difficulty`**: `'easy'` | `'medium'` | `'hard'`
- **`QuizQuestion`** / **`WordProblem`**: Quiz state tracking

### Key Hooks

| Hook | Purpose |
|------|---------|
| `useTime` | Time state sync between stores and components |
| `useClockDrag` | Mouse/touch drag handling for clock hands |
| `useQuiz` | Quiz answer validation and state |
| `useSound` | Howler.js sound effects |
| `useSpeech` | Web Speech API text-to-speech |

### Time Utilities (`src/utils/`)

- **`timeConversion.ts`**: Angle-to-time and time-to-angle calculations for clock hands
- **`timeToWords.ts`**: Converts time to English phrases ("half past three")
- **`generateQuizTime.ts`**: Random time generation respecting difficulty level

### Difficulty Levels

| Level | Times Generated |
|-------|-----------------|
| Easy | O'clock only (X:00) |
| Medium | O'clock, half past, quarters (X:00, X:15, X:30, X:45) |
| Hard | Any 5-minute increment |

### Component Structure

```
src/components/
├── Clock/          # AnalogClock (interactive), MiniClock (quiz), ClockHand, ClockFace
├── DigitalDisplay/ # DigitalTime, WheelPicker (Apple-style), TimeInput, TimeDisplayInput
├── Quiz/           # ClockQuiz (container), QuizCard, WordProblem
├── Layout/         # Header, ThemeToggle, ScoreDisplay, DifficultySelector
├── Feedback/       # EncouragingMessage with animations
└── Decorations/    # BlueThemeDecorations, PinkThemeDecorations, CustomIcons
```

### Theme System

Theme configs in `src/themes/` define colors for:
- Clock face, border, hands, numbers, center dot
- Background, primary, secondary, accent colors
- Theme-specific decorations (rockets/dinosaurs for blue, butterflies/unicorns for pink)

## Path Alias

`@/*` maps to `src/*` in both TypeScript and Vite config.

## Testing

- Unit tests in `tests/unit/` (Vitest + React Testing Library)
- E2E tests in `tests/e2e/` (Playwright)
- Test files use `.test.ts` or `.test.tsx` suffix

## Dependencies

Key libraries: React 19, Framer Motion (animations), Zustand (state), Howler.js (sound), canvas-confetti (celebration effects), Lucide React (icons).
