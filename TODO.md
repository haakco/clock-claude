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

- [ ] Initialize Vite + React + TypeScript project
- [ ] Configure Tailwind CSS
- [ ] Set up ESLint and Prettier
- [ ] Configure Vitest for unit testing
- [ ] Configure Playwright for E2E testing
- [ ] Create folder structure per plan

### CI/CD
_Reference: [Project Structure](docs/plan.md#project-structure)_

- [ ] Create GitHub Actions workflow for CI (test on PR)
- [ ] Create GitHub Actions workflow for deployment (GitHub Pages)
- [ ] Configure build and preview scripts

---

## Phase 2: Core Components

### Main Interactive Clock
_Reference: [Main Interactive Clock](docs/plan.md#1-main-interactive-clock)_

- [ ] Create `ClockFace` component with numbers 1-12
- [ ] Create `ClockHand` component (reusable for hour/minute)
- [ ] Implement `AnalogClock` container component
- [ ] Add drag functionality for minute hand
- [ ] Add drag functionality for hour hand
- [ ] Implement hour hand auto-movement when minute hand moves
- [ ] Add visual feedback on drag (highlight, glow)
- [ ] Make clock responsive
- [ ] Add touch support for mobile/tablet

### Digital Display
_Reference: [Digital Time Display](docs/plan.md#2-digital-time-display)_

- [ ] Create `DigitalTime` display component (12hr and 24hr)
- [ ] Create `WheelPicker` component (Apple-style scroll picker)
- [ ] Implement hour wheel (1-12, looping)
- [ ] Implement minute wheel (00-59, looping)
- [ ] Implement AM/PM wheel
- [ ] Create `TimeInput` combined component
- [ ] Sync digital input with analog clock

### Time in Words
_Reference: [Time in Words Display](docs/plan.md#3-time-in-words-display)_

- [ ] Create `timeToWords` utility function
- [ ] Handle o'clock times
- [ ] Handle half past times
- [ ] Handle quarter past/to times
- [ ] Handle 5-minute increments (five past, ten to, etc.)
- [ ] Create display component for time in words

---

## Phase 3: Quiz Features

### Mini Clock Quiz
_Reference: [Quiz Section - Small Clocks](docs/plan.md#4-quiz-section---small-clocks)_

- [ ] Create `MiniClock` component (static, smaller version)
- [ ] Create `QuizCard` component with clock + input + check button
- [ ] Create `ClockQuiz` container for 3 quiz cards
- [ ] Implement `generateQuizTime` utility (respects difficulty)
- [ ] Add answer validation logic
- [ ] Implement correct answer feedback (green glow)
- [ ] Implement incorrect answer feedback (red shake)
- [ ] Add new random time after correct answer

### Word Problems
_Reference: [Word Problems Section](docs/plan.md#5-word-problems-section)_

- [ ] Create `WordProblem` component
- [ ] Generate random word problem based on difficulty
- [ ] Add wheel picker input for answer
- [ ] Implement answer validation
- [ ] Add feedback animations

### Difficulty System
_Reference: [Difficulty Levels](docs/plan.md#6-difficulty-levels)_

- [ ] Create `DifficultySelector` component
- [ ] Implement Easy mode (o'clock only)
- [ ] Implement Medium mode (o'clock, half, quarters)
- [ ] Implement Hard mode (5-minute increments)
- [ ] Store difficulty preference
- [ ] Filter quiz times by difficulty

---

## Phase 4: Theming & Polish

### Theme System
_Reference: [Theme Toggle](docs/plan.md#7-theme-toggle)_

- [ ] Create theme store with Zustand
- [ ] Define Blue theme colors and config
- [ ] Define Pink theme colors and config
- [ ] Create `ThemeToggle` component
- [ ] Apply theme to clock face
- [ ] Apply theme to clock hands
- [ ] Apply theme to background

### Decorations
_Reference: [Theme Toggle](docs/plan.md#7-theme-toggle)_

- [ ] Create/source Blue theme decorations (rockets, dinosaurs, cars, stars)
- [ ] Create/source Pink theme decorations (butterflies, flowers, unicorns, hearts)
- [ ] Create `BlueThemeDecorations` component
- [ ] Create `PinkThemeDecorations` component
- [ ] Position decorations around UI

### Sound Effects
_Reference: [Sound Effects](docs/plan.md#8-sound-effects)_

- [ ] Set up Howler.js
- [ ] Add tick sound for hand movement
- [ ] Add celebration sound for correct answers
- [ ] Add gentle sound for incorrect answers
- [ ] Add button click sounds
- [ ] Create mute/unmute toggle
- [ ] Create `useSound` hook

---

## Phase 5: Scoring & Feedback

### Score System
_Reference: [Score and Progress](docs/plan.md#9-score-and-progress)_

- [ ] Create game store with Zustand
- [ ] Implement points counter
- [ ] Implement streak counter
- [ ] Create `ScoreDisplay` component
- [ ] Show encouraging messages based on progress

### Feedback Animations
_Reference: [Quiz Section - Small Clocks](docs/plan.md#4-quiz-section---small-clocks)_

- [ ] Set up canvas-confetti
- [ ] Create `CorrectAnimation` component with confetti
- [ ] Create `IncorrectAnimation` component with shake
- [ ] Create `EncouragingMessage` component
- [ ] Implement animation triggers

---

## Phase 6: Layout & Responsiveness

### Main Layout
_Reference: [UI Layout Design](docs/plan.md#ui-layout-design)_

- [ ] Create `Header` component with title and theme toggle
- [ ] Create main layout grid (clock left, quiz right)
- [ ] Add "New Questions" button
- [ ] Style overall app container

### Responsive Design
_Reference: [Responsive Design](docs/plan.md#responsive-design)_

- [ ] Implement desktop layout (side-by-side)
- [ ] Implement tablet layout (stacked)
- [ ] Implement mobile layout (single column)
- [ ] Ensure 44x44px minimum touch targets
- [ ] Test on various screen sizes

---

## Phase 7: Testing

### Unit Tests
_Reference: [Testing Strategy](docs/plan.md#testing-strategy)_

- [ ] Test `timeConversion` utilities
- [ ] Test `timeToWords` function
- [ ] Test `generateQuizTime` function
- [ ] Test score calculation logic

### Component Tests
_Reference: [Testing Strategy](docs/plan.md#testing-strategy)_

- [ ] Test `AnalogClock` hand positions
- [ ] Test `WheelPicker` input/output
- [ ] Test `ThemeToggle` functionality
- [ ] Test quiz answer validation

### E2E Tests
_Reference: [Testing Strategy](docs/plan.md#testing-strategy)_

- [ ] Test complete quiz flow
- [ ] Test clock hand dragging
- [ ] Test digital-to-analog sync
- [ ] Test theme switching
- [ ] Test mobile touch interactions

---

## Phase 8: Documentation & Deployment

### Documentation
- [x] Create project plan (docs/plan.md)
- [x] Create README.md
- [x] Create TODO.md

### Deployment
- [ ] Configure Vite for GitHub Pages base path
- [ ] Test production build locally
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
