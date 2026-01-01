# TODO - Clock Learning Game

Development task list for the Clock Learning Game project. See [docs/plan.md](docs/plan.md) for detailed specifications.

## Legend

- [ ] Not started
- [x] Completed
- [~] In progress

---

## Phase 1: Project Setup

### Scaffolding
_Reference: [Technology Stack](docs/plan.md#technology-stack) | [Project Structure](docs/plan.md#project-structure)_

- [x] Initialize Vite + React + TypeScript project
- [x] Configure Tailwind CSS
- [x] Set up ESLint and Prettier
- [x] Configure Vitest for unit testing
- [x] Configure Playwright for E2E testing
- [x] Create folder structure per plan

### CI/CD
_Reference: [Project Structure](docs/plan.md#project-structure)_

- [x] Create GitHub Actions workflow for CI (test on PR)
- [x] Create GitHub Actions workflow for deployment (GitHub Pages)
- [x] Configure build and preview scripts

---

## Phase 2: Core Components

### Main Interactive Clock
_Reference: [Main Interactive Clock](docs/plan.md#1-main-interactive-clock)_

- [x] Create `ClockFace` component with numbers 1-12
- [x] Create `ClockHand` component (reusable for hour/minute)
- [x] Implement `AnalogClock` container component
- [x] Add drag functionality for minute hand
- [x] Add drag functionality for hour hand
- [x] Implement hour hand auto-movement when minute hand moves
- [x] Add visual feedback on drag (highlight, glow)
- [x] Make clock responsive
- [x] Add touch support for mobile/tablet

### Digital Display
_Reference: [Digital Time Display](docs/plan.md#2-digital-time-display)_

- [x] Create `DigitalTime` display component (12hr and 24hr)
- [x] Create `WheelPicker` component (Apple-style scroll picker)
- [x] Implement hour wheel (1-12, looping)
- [x] Implement minute wheel (00-59, looping)
- [x] Implement AM/PM wheel
- [x] Create `TimeInput` combined component
- [x] Sync digital input with analog clock

### Time in Words
_Reference: [Time in Words Display](docs/plan.md#3-time-in-words-display)_

- [x] Create `timeToWords` utility function
- [x] Handle o'clock times
- [x] Handle half past times
- [x] Handle quarter past/to times
- [x] Handle 5-minute increments (five past, ten to, etc.)
- [x] Create display component for time in words

---

## Phase 3: Quiz Features

### Mini Clock Quiz
_Reference: [Quiz Section - Small Clocks](docs/plan.md#4-quiz-section---small-clocks)_

- [x] Create `MiniClock` component (static, smaller version)
- [x] Create `QuizCard` component with clock + input + check button
- [x] Create `ClockQuiz` container for 3 quiz cards
- [x] Implement `generateQuizTime` utility (respects difficulty)
- [x] Add answer validation logic
- [x] Implement correct answer feedback (green glow)
- [x] Implement incorrect answer feedback (red shake)
- [x] Add new random time after correct answer

### Word Problems
_Reference: [Word Problems Section](docs/plan.md#5-word-problems-section)_

- [x] Create `WordProblem` component
- [x] Generate random word problem based on difficulty
- [x] Add wheel picker input for answer
- [x] Implement answer validation
- [x] Add feedback animations

### Difficulty System
_Reference: [Difficulty Levels](docs/plan.md#6-difficulty-levels)_

- [x] Create `DifficultySelector` component
- [x] Implement Easy mode (o'clock only)
- [x] Implement Medium mode (o'clock, half, quarters)
- [x] Implement Hard mode (5-minute increments)
- [x] Store difficulty preference
- [x] Filter quiz times by difficulty

---

## Phase 4: Theming & Polish

### Theme System
_Reference: [Theme Toggle](docs/plan.md#7-theme-toggle)_

- [x] Create theme store with Zustand
- [x] Define Blue theme colors and config
- [x] Define Pink theme colors and config
- [x] Create `ThemeToggle` component
- [x] Apply theme to clock face
- [x] Apply theme to clock hands
- [x] Apply theme to background

### Decorations
_Reference: [Theme Toggle](docs/plan.md#7-theme-toggle)_

- [x] Create/source Blue theme decorations (rockets, dinosaurs, cars, stars)
- [x] Create/source Pink theme decorations (butterflies, flowers, unicorns, hearts)
- [x] Create `BlueThemeDecorations` component
- [x] Create `PinkThemeDecorations` component
- [x] Position decorations around UI

### Sound Effects
_Reference: [Sound Effects](docs/plan.md#8-sound-effects)_

- [x] Set up Howler.js
- [x] Add tick sound for hand movement
- [x] Add celebration sound for correct answers
- [x] Add gentle sound for incorrect answers
- [x] Add button click sounds
- [x] Create mute/unmute toggle
- [x] Create `useSound` hook

---

## Phase 5: Scoring & Feedback

### Score System
_Reference: [Score and Progress](docs/plan.md#9-score-and-progress)_

- [x] Create game store with Zustand
- [x] Implement points counter
- [x] Implement streak counter
- [x] Create `ScoreDisplay` component
- [x] Show encouraging messages based on progress

### Feedback Animations
_Reference: [Quiz Section - Small Clocks](docs/plan.md#4-quiz-section---small-clocks)_

- [x] Set up canvas-confetti
- [x] Create `CorrectAnimation` component with confetti
- [x] Create `IncorrectAnimation` component with shake
- [x] Create `EncouragingMessage` component
- [x] Implement animation triggers

---

## Phase 6: Layout & Responsiveness

### Main Layout
_Reference: [UI Layout Design](docs/plan.md#ui-layout-design)_

- [x] Create `Header` component with title and theme toggle
- [x] Create main layout grid (clock left, quiz right)
- [x] Add "New Questions" button
- [x] Style overall app container

### Responsive Design
_Reference: [Responsive Design](docs/plan.md#responsive-design)_

- [x] Implement desktop layout (side-by-side)
- [x] Implement tablet layout (stacked)
- [x] Implement mobile layout (single column)
- [x] Ensure 44x44px minimum touch targets
- [ ] Test on various screen sizes

---

## Phase 7: Testing

### Unit Tests
_Reference: [Testing Strategy](docs/plan.md#testing-strategy)_

- [x] Test `timeConversion` utilities
- [x] Test `timeToWords` function
- [x] Test `generateQuizTime` function
- [ ] Test score calculation logic

### Component Tests
_Reference: [Testing Strategy](docs/plan.md#testing-strategy)_

- [ ] Test `AnalogClock` hand positions
- [ ] Test `WheelPicker` input/output
- [ ] Test `ThemeToggle` functionality
- [ ] Test quiz answer validation

### E2E Tests
_Reference: [Testing Strategy](docs/plan.md#testing-strategy)_

- [x] Test complete quiz flow (scaffolded)
- [ ] Test clock hand dragging
- [ ] Test digital-to-analog sync
- [x] Test theme switching (scaffolded)
- [ ] Test mobile touch interactions

---

## Phase 8: Documentation & Deployment

### Documentation
- [x] Create project plan (docs/plan.md)
- [x] Create README.md
- [x] Create TODO.md

### Deployment
- [x] Configure Vite for GitHub Pages base path
- [x] Test production build locally
- [ ] Deploy to GitHub Pages
- [ ] Verify deployment works correctly

---

## Future Enhancements (Out of Scope)
_Reference: [Future Enhancements](docs/plan.md#future-enhancements)_

These are documented for future consideration but not part of initial release:

- [ ] Tutorial mode with animated hints
- [ ] Character guide/mascot
- [ ] Achievement badges
- [ ] Parent dashboard
- [ ] Multiple languages
- [ ] PWA offline support
- [ ] Custom theme builder
- [ ] Multiplayer mode
- [ ] Additional quiz types
- [ ] Accessibility improvements (screen reader, keyboard nav)
