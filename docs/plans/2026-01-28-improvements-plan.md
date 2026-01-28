# Clock Learning Game - Improvements Plan

**Date**: 2026-01-28
**Status**: Planning Complete - Ready for Implementation
**Branch**: `th/new_voice_plus_fixes`

---

## Overview

Three major improvements plus bug fixes from code review:

1. **Vike Migration** - Pre-rendering for faster initial load
2. **Kokoro TTS** - Higher quality neural voices (English)
3. **UI Improvements** - Make difficulty button more obviously clickable
4. **Bug Fixes** - Address critical/high severity issues from code review

---

## Implementation Order

```
┌─────────────────────────────────────────────────────────────────┐
│  Phase 1: Vike Migration (Foundation)                           │
│  └─> Pre-render single page for faster load                     │
├─────────────────────────────────────────────────────────────────┤
│  Phase 2: Kokoro TTS (Feature)                                  │
│  └─> Optional high-quality voice with download prompt           │
├─────────────────────────────────────────────────────────────────┤
│  Phase 3: UI Improvements (Polish)                              │
│  └─> Difficulty button affordance                               │
├─────────────────────────────────────────────────────────────────┤
│  Phase 4: Bug Fixes (Quality)                                   │
│  └─> Critical and high severity issues from code review         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Vike Migration

### Goal
Replace Vite SPA with Vike + pre-rendering for faster initial HTML delivery.

### Decisions Made
| Decision | Choice |
|----------|--------|
| Routing | Single page (no routes) |
| Pre-rendering | Full page SSG at build time |

### Tasks

- [ ] Install Vike and dependencies (`vike`, `vike-react`)
- [ ] Create Vike page structure (`/pages/index/+Page.tsx`)
- [ ] Configure pre-rendering in `+config.ts`
- [ ] Update `vite.config.ts` for Vike
- [ ] Move `App.tsx` content to page component
- [ ] Ensure SSR compatibility (no `window` access during render)
- [ ] Update build scripts in `package.json`
- [ ] Test pre-rendered output
- [ ] Verify hydration works correctly
- [ ] Update deployment workflow if needed

### Files to Create/Modify
```
pages/
├── index/
│   ├── +Page.tsx          # Main page (moved from App.tsx)
│   └── +config.ts         # Page config with prerender: true
├── +config.ts             # Global Vike config
└── +onRenderHtml.tsx      # HTML template
vite.config.ts             # Add Vike plugin
package.json               # Update scripts
```

### Verification
- [ ] `npm run build` generates static HTML in `dist/client/`
- [ ] HTML includes pre-rendered content (not empty div)
- [ ] App hydrates correctly in browser
- [ ] All interactive features work after hydration

---

## Phase 2: Kokoro TTS Integration

### Goal
Add optional high-quality neural TTS with opt-in download (~87MB).

### Decisions Made
| Decision | Choice |
|----------|--------|
| UI Placement | Next to sound toggle in header |
| Voices | 3 curated: Sunny, George, Emma |
| Default Voice | Sunny (af_heart) |
| Fallback | Silent fallback to Web Speech API |
| Download | Prompt on first click |

### Voice Configuration
| Name | Voice ID | Description |
|------|----------|-------------|
| Sunny | `af_heart` | Warm American female (default) |
| George | `bm_george` | British male |
| Emma | `bf_emma` | British female |

### Tasks

- [ ] Create `useKokoroTTS` hook
  - [ ] Model loading with progress callback
  - [ ] Voice generation function
  - [ ] Cache downloaded state in localStorage
- [ ] Create voice quality toggle button component
  - [ ] Icon showing current state (basic/enhanced)
  - [ ] Download prompt modal (~87MB warning)
  - [ ] Progress indicator during download
- [ ] Create voice selector dropdown
  - [ ] Show after Kokoro is downloaded
  - [ ] Persist selection in localStorage
- [ ] Update `useSpeech` hook
  - [ ] Check if Kokoro is available
  - [ ] Route to Kokoro or Web Speech API
  - [ ] Seamless fallback on error
- [ ] Add to Header component
  - [ ] Voice quality button next to sound toggle
  - [ ] Voice selector (when enhanced enabled)
- [ ] Update gameStore for voice preferences

### Files to Create/Modify
```
src/
├── hooks/
│   ├── useKokoroTTS.ts    # NEW: Kokoro integration
│   └── useSpeech.ts       # MODIFY: Add Kokoro routing
├── components/
│   └── Layout/
│       ├── Header.tsx     # MODIFY: Add voice controls
│       ├── VoiceQualityToggle.tsx  # NEW
│       └── VoiceSelector.tsx       # NEW
└── stores/
    └── gameStore.ts       # MODIFY: Add voice preferences
```

### Dependencies
```json
{
  "kokoro-js": "^1.2.1"
}
```

Note: kokoro-js is loaded from CDN, no npm install needed for browser use.

### Verification
- [ ] Voice quality button appears in header
- [ ] Clicking prompts for download with size warning
- [ ] Download shows progress indicator
- [ ] After download, TTS uses Kokoro
- [ ] Voice selector allows switching between Sunny/George/Emma
- [ ] Declining download uses Web Speech API (silent fallback)
- [ ] Preference persists across page reloads

---

## Phase 3: UI Improvements

### Goal
Make difficulty button more obviously clickable for kids.

### Decisions Made
- Add border + shadow for button affordance
- Add cycle icon to indicate interaction
- Add "Tap to change" tooltip on hover

### Tasks

- [ ] Update `DifficultySelector.tsx`
  - [ ] Add `border-2 border-white/40` for visible border
  - [ ] Add `shadow-md` for depth
  - [ ] Add cycle icon (↻ or similar from Lucide)
  - [ ] Add `title="Tap to change difficulty"` for tooltip
- [ ] Test on mobile (tooltip becomes long-press hint)
- [ ] Verify visual hierarchy still works with other header elements

### Files to Modify
```
src/components/Layout/DifficultySelector.tsx
```

### Verification
- [ ] Button has visible border and shadow
- [ ] Cycle icon is visible
- [ ] Hover shows tooltip
- [ ] Still looks good on mobile

---

## Phase 4: Bug Fixes (Code Review Issues)

### Critical Issues

#### 1. Memory Leak in AudioContext
**Location**: `src/hooks/useSound.ts:30-48`
**Issue**: Event listeners with `{ once: true }` have race condition in cleanup

**Fix**:
- [ ] Track AudioContext instances properly
- [ ] Add explicit cleanup in useEffect return
- [ ] Close AudioContext on unmount

#### 2. Race Condition in Drag Handlers
**Location**: `src/hooks/useClockDrag.ts:103-133`
**Issue**: Separate useEffect blocks for hour/minute drag could allow both active simultaneously

**Fix**:
- [ ] Combine drag handlers into single useEffect
- [ ] Add mutex/flag to prevent simultaneous drags
- [ ] Clear opposite drag state when starting new drag

### High Severity Issues

#### 3. Missing Error Boundary
**Location**: `src/App.tsx`
**Issue**: No graceful crash recovery

**Fix**:
- [ ] Create `ErrorBoundary` component
- [ ] Wrap App content with boundary
- [ ] Show kid-friendly error message

#### 4. No Keyboard/Accessibility Support
**Location**: `AnalogClock.tsx`, `WheelPicker.tsx`
**Issue**: Zero ARIA attributes, no keyboard navigation

**Fix**:
- [ ] Add ARIA labels to clock hands
- [ ] Add keyboard controls for clock (arrow keys)
- [ ] Add ARIA labels to wheel picker
- [ ] Add keyboard controls for picker (up/down arrows)

#### 5. Speech Voice Race Condition
**Location**: `src/hooks/useSpeech.ts:115-123`
**Issue**: getVoices() returns empty initially in Chrome

**Fix**:
- [ ] Add voiceschanged event listener
- [ ] Retry voice selection after voices load
- [ ] Cache voice list once loaded

#### 6. Store Synchronization Risk
**Location**: `src/hooks/useQuiz.ts:18-26`
**Issue**: Could infinite loop during localStorage rehydration

**Fix**:
- [ ] Add initialization flag
- [ ] Skip sync during hydration
- [ ] Use stable references for dependencies

#### 7. Type Safety Gap
**Location**: `TimeInput.tsx:38-42`
**Issue**: Period validation uses loose string comparison

**Fix**:
- [ ] Use strict type guard
- [ ] Validate against `'AM' | 'PM'` union type

#### 8. WheelPicker Scroll Race
**Location**: `WheelPicker.tsx:82-104`
**Issue**: Complex state management with potential race conditions

**Fix**:
- [ ] Review scroll handler debouncing
- [ ] Ensure state updates are batched
- [ ] Add scroll lock during animation

### Files to Modify
```
src/
├── hooks/
│   ├── useSound.ts        # Fix AudioContext cleanup
│   ├── useClockDrag.ts    # Fix drag race condition
│   ├── useSpeech.ts       # Fix voice loading race
│   └── useQuiz.ts         # Fix sync race condition
├── components/
│   ├── Clock/
│   │   └── AnalogClock.tsx   # Add accessibility
│   ├── DigitalDisplay/
│   │   ├── WheelPicker.tsx   # Add accessibility, fix scroll race
│   │   └── TimeInput.tsx     # Fix type safety
│   └── ErrorBoundary.tsx     # NEW
└── App.tsx                   # Wrap with ErrorBoundary
```

---

## Testing Checklist

### After Phase 1 (Vike)
- [ ] Build produces pre-rendered HTML
- [ ] App loads and hydrates correctly
- [ ] All existing features work
- [ ] No console errors

### After Phase 2 (Kokoro TTS)
- [ ] Voice toggle appears in header
- [ ] Download flow works
- [ ] All three voices work
- [ ] Fallback to Web Speech works
- [ ] Preferences persist

### After Phase 3 (UI)
- [ ] Difficulty button is obviously clickable
- [ ] Tooltip shows on hover
- [ ] Works on mobile

### After Phase 4 (Bug Fixes)
- [ ] No memory leaks (check DevTools)
- [ ] Drag operations are smooth
- [ ] Error boundary catches errors
- [ ] Keyboard navigation works
- [ ] Speech works reliably in Chrome

---

## Resources

### Vike Documentation
- [Pre-rendering](https://vike.dev/pre-rendering)
- [React Integration](https://vike.dev/react)

### Kokoro TTS
- [kokoro-js npm](https://www.npmjs.com/package/kokoro-js)
- [Kokoro-82M model](https://huggingface.co/hexgrad/Kokoro-82M)

### Reference Implementation
- bchat browser/kokoro for working Kokoro example
