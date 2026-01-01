# Clock Learning Game - Implementation Gaps

Analysis comparing `docs/plan.md` to current codebase, plus new feature requests.

## Summary

| Category | Gap Count |
|----------|-----------|
| Missing Decorations | 5 |
| Missing Sounds | 1 |
| Missing Features | 1 |
| New Feature Requests | 1 |
| Minor Differences | 3 |
| **Total Items** | **11** |

---

## 1. Missing Decorations

### Blue Theme (BlueThemeDecorations.tsx)

**Currently has:** Rocket, Star, Car

**Missing:**
- [ ] **Dinosaurs** - Plan specifies dinosaurs as key decoration
- [ ] **Sports balls** - Plan mentions sports balls

### Pink Theme (PinkThemeDecorations.tsx)

**Currently has:** Heart, Flower, Star

**Missing:**
- [ ] **Butterflies** - Plan lists butterflies first
- [ ] **Unicorns** - Key kid-friendly decoration
- [ ] **Rainbows** - Mentioned in plan

**Implementation notes:**
- Lucide React has limited icon options for these
- May need custom SVG components or find alternative icon library
- Consider: `react-icons` has more variety (GiDinosaur, GiUnicorn, etc.)

---

## 2. Missing Sounds

### "Whoosh" Sound for New Questions

**Plan says:**
> | New questions | Whoosh |

**Current state:**
- `useSound.ts` only has: tick, correct, incorrect, click
- No sound plays when "New Questions" button is clicked

**Implementation:**
```typescript
// Add to useSound.ts
case 'whoosh':
  // Quick frequency sweep
  playTone(600, 0.1, 'sine');
  setTimeout(() => playTone(400, 0.1, 'sine'), 50);
  setTimeout(() => playTone(300, 0.15, 'sine'), 100);
  break;
```

---

## 3. New Feature Request: Read Time Aloud

**Request:** Add ability to read out the time using text-to-speech

**Proposed implementation:**

### Option A: Web Speech API (Recommended)
- Built into modern browsers
- No external dependencies
- Free, works offline

```typescript
// src/hooks/useSpeech.ts
export function useSpeech() {
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for kids
    utterance.pitch = 1.1; // Slightly higher pitch
    speechSynthesis.speak(utterance);
  };

  return { speak };
}
```

### UI Integration Options:
1. **Speaker button next to time display** - Click to hear current time
2. **Auto-read on change** - Optional setting to read time when clock changes
3. **Quiz hints** - Button to hear the word problem read aloud

### Accessibility benefits:
- Helps children who are still learning to read
- Reinforces audio-visual learning connection
- Useful for visually impaired users

---

## 4. Minor Differences from Plan

### Difficulty Labels
| Plan | Current |
|------|---------|
| Beginner | Easy |
| Learning | Medium |
| Expert | Hard |

**Decision needed:** Keep current or change to kid-friendly labels?

### Missing Utility File
- Plan shows `src/utils/wordsToTime.ts` (parse English to time)
- Not implemented - currently not needed since we generate time then convert to words
- Could be useful for future "type the time in words" feature

### Separate Animation Components
Plan shows:
- `src/components/Feedback/CorrectAnimation.tsx`
- `src/components/Feedback/IncorrectAnimation.tsx`

Current: Animations are inline in `QuizCard.tsx` and `MiniClock.tsx`

**Decision needed:** Extract to separate components for reusability?

---

## 5. Infrastructure

### GitHub Actions Workflows
- `.github/workflows/` directory exists but is empty
- Workflow files created but cannot be pushed (lacks workflow permission)
- **Manual action required:** Add workflow files via GitHub web interface or with proper permissions

---

## Priority Ranking

### High Priority (Core UX)
1. [ ] Read time aloud (new feature) - Major learning aid
2. [ ] Add whoosh sound - Completes sound design

### Medium Priority (Polish)
3. [ ] Add missing blue theme decorations (dinosaurs, sports balls)
4. [ ] Add missing pink theme decorations (butterflies, unicorns, rainbows)

### Low Priority (Nice to have)
5. [ ] Change difficulty labels to kid-friendly versions
6. [ ] Extract animation components
7. [ ] Implement wordsToTime utility

### Deferred
8. [ ] GitHub Actions - Requires manual intervention for permissions

---

## 6. Code Review Checkpoint

After each batch of changes, perform code review to ensure:

### Quality Criteria
- [ ] **No god functions/classes** - Functions should do one thing well
- [ ] **Functional patterns** - Prefer pure functions, composition over inheritance
- [ ] **Small, focused components** - Each component has single responsibility
- [ ] **Proper separation of concerns** - Hooks for logic, components for UI
- [ ] **Type safety** - Proper TypeScript types, no `any`
- [ ] **Test coverage** - New functionality has corresponding tests

### Review Checklist
1. Review new hooks for:
   - Single responsibility
   - Proper memoization (useCallback, useMemo where needed)
   - No side effects leaking

2. Review components for:
   - Props interface clarity
   - No business logic in render
   - Proper event handler naming

3. Add missing tests for:
   - New utility functions
   - New hooks (if testable in isolation)
   - Component behavior changes

---

## Next Steps

1. Implement text-to-speech feature (`useSpeech` hook + UI buttons)
2. Add whoosh sound to `useSound.ts`
3. **Code review checkpoint** - Review new code, add tests
4. Find/create SVG icons for missing decorations
5. Update decoration components
6. **Final code review** - Ensure all changes are clean

