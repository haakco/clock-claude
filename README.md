# Clock Learning Game

An interactive web-based game to help children aged 6-8 learn to tell time.

## Overview

This educational game features:

- **Interactive analog clock** with draggable hour and minute hands
- **Digital time display** in both 12-hour and 24-hour formats
- **Time in words** showing English expressions like "half past three"
- **Quiz mode** with small clocks to test time-reading skills
- **Word problems** to practice understanding time expressions
- **Fun themes** - choose between Blue and Pink designs
- **Sound effects** and celebrations for correct answers

## Documentation

- **[Project Plan](docs/plan.md)** - Detailed specification and design decisions
- **[TODO](TODO.md)** - Current development tasks and progress

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Tech Stack

- **React** + **Vite** - Fast, modern frontend tooling
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - Lightweight state management
- **Vitest** + **Playwright** - Comprehensive testing

## Features

### Learning Modes

| Mode | Description |
|------|-------------|
| **Free Play** | Explore the main clock, drag hands, see time in different formats |
| **Clock Quiz** | Read small clocks and enter the correct time |
| **Word Problems** | Convert English expressions to digital time |

### Difficulty Levels

| Level | Times Included |
|-------|----------------|
| Easy | O'clock (3:00, 7:00) |
| Medium | O'clock, half past, quarters (3:00, 3:15, 3:30, 3:45) |
| Hard | All 5-minute increments |

### Themes

- **Blue Theme** - Rockets, dinosaurs, cars, and stars
- **Pink Theme** - Butterflies, flowers, unicorns, and hearts

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build

# Testing
npm test             # Run unit tests
npm run test:e2e     # Run E2E tests
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

### Project Structure

```
src/
├── components/      # React components
│   ├── Clock/       # Analog clock components
│   ├── DigitalDisplay/  # Digital time and inputs
│   ├── Quiz/        # Quiz and word problems
│   ├── Layout/      # Header, theme toggle, etc.
│   └── Feedback/    # Animations and messages
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── stores/          # Zustand state stores
├── themes/          # Theme configurations
└── assets/          # Sounds and decorations
```

## Contributing

1. Check [TODO.md](TODO.md) for open tasks
2. Read the [Project Plan](docs/plan.md) for context
3. Create a feature branch
4. Make your changes
5. Run tests: `npm test`
6. Submit a pull request

## License

MIT
