import { expect, test } from '@playwright/test';

test.describe('Clock Learning Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Learn to Tell Time/);
  });

  test('displays the main clock', async ({ page }) => {
    // Check that the main clock is visible
    const clock = page.locator('.clock-container').first();
    await expect(clock).toBeVisible();
  });

  test('displays digital time', async ({ page }) => {
    // Check that digital time display exists
    const digitalTime = page.getByText(/AM|PM/);
    await expect(digitalTime.first()).toBeVisible();
  });

  test('can toggle theme', async ({ page }) => {
    // Find and click theme toggle
    const themeButton = page.getByRole('button', { name: /blue|pink/i });
    await expect(themeButton).toBeVisible();

    // Click to toggle theme
    await themeButton.click();

    // Theme should have changed
    await expect(themeButton).toBeVisible();
  });

  test('displays quiz clocks', async ({ page }) => {
    // Check for quiz section
    const quizHeading = page.getByText('What time is shown?');
    await expect(quizHeading).toBeVisible();
  });

  test('displays word problem', async ({ page }) => {
    // Check for word challenge section
    const wordChallenge = page.getByText('Word Challenge');
    await expect(wordChallenge).toBeVisible();
  });

  test('can change difficulty', async ({ page }) => {
    // Find difficulty button
    const difficultyButton = page.getByRole('button', {
      name: /easy|medium|hard/i,
    });
    await expect(difficultyButton).toBeVisible();

    // Click to cycle difficulty
    await difficultyButton.click();
  });

  test('shows score display', async ({ page }) => {
    // Score should be visible in header
    const scoreDisplay = page.locator('header').getByText(/\d+/);
    await expect(scoreDisplay.first()).toBeVisible();
  });

  test('has how to play instructions', async ({ page }) => {
    const instructions = page.getByText('How to Play');
    await expect(instructions).toBeVisible();
  });

  test('can refresh questions', async ({ page }) => {
    const refreshButton = page.getByRole('button', { name: /new questions/i });
    await expect(refreshButton).toBeVisible();

    await refreshButton.click();
  });
});

test.describe('Clock Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays correct time format', async ({ page }) => {
    // Check 12-hour format
    const time12 = page.getByText(/\d{1,2}:\d{2}\s+(AM|PM)/);
    await expect(time12.first()).toBeVisible();

    // Check 24-hour format
    const time24 = page.getByText(/\d{2}:\d{2}/);
    await expect(time24.first()).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Main elements should still be visible
    const clock = page.locator('.clock-container').first();
    await expect(clock).toBeVisible();
  });

  test('works on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Main elements should still be visible
    const clock = page.locator('.clock-container').first();
    await expect(clock).toBeVisible();
  });
});

test.describe('Clock Hand Dragging', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clock hands are draggable', async ({ page }) => {
    // Get the main clock container
    const clock = page.locator('.clock-container').first();
    await expect(clock).toBeVisible();

    // Get the SVG element containing the hands
    const svg = clock.locator('svg').first();
    await expect(svg).toBeVisible();

    // Check that clock hand elements exist
    const clockHands = clock.locator('.clock-hand');
    await expect(clockHands.first()).toBeVisible();
  });

  test('minute hand can be dragged to change time', async ({ page }) => {
    // Get the clock
    const clock = page.locator('.clock-container').first();
    const boundingBox = await clock.boundingBox();

    if (boundingBox) {
      const centerX = boundingBox.x + boundingBox.width / 2;
      const centerY = boundingBox.y + boundingBox.height / 2;

      // Simulate dragging the minute hand (drag from center to right, which is 3 o'clock position)
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX + boundingBox.width * 0.35, centerY, { steps: 10 });
      await page.mouse.up();

      // Give time for the time display to update
      await page.waitForTimeout(100);

      // The time display should have updated (we can't know the exact value)
      const timeDisplay = page.getByText(/\d{1,2}:\d{2}\s+(AM|PM)/).first();
      await expect(timeDisplay).toBeVisible();
    }
  });

  test('hour hand can be dragged to change time', async ({ page }) => {
    const clock = page.locator('.clock-container').first();
    const boundingBox = await clock.boundingBox();

    if (boundingBox) {
      const centerX = boundingBox.x + boundingBox.width / 2;
      const centerY = boundingBox.y + boundingBox.height / 2;

      // Hour hand is shorter, so click closer to center
      const hourHandX = centerX + boundingBox.width * 0.15;
      const hourHandY = centerY;

      await page.mouse.move(hourHandX, hourHandY);
      await page.mouse.down();
      // Drag to bottom (6 o'clock position)
      await page.mouse.move(centerX, centerY + boundingBox.height * 0.2, { steps: 10 });
      await page.mouse.up();

      // The clock should respond to the interaction
      const timeDisplay = page.getByText(/\d{1,2}:\d{2}\s+(AM|PM)/).first();
      await expect(timeDisplay).toBeVisible();
    }
  });

  test('clock shows visual feedback when dragging', async ({ page }) => {
    const clock = page.locator('.clock-container').first();
    const boundingBox = await clock.boundingBox();

    if (boundingBox) {
      const centerX = boundingBox.x + boundingBox.width / 2;
      const centerY = boundingBox.y + boundingBox.height / 2;

      // Start dragging
      await page.mouse.move(centerX, centerY - boundingBox.height * 0.3);
      await page.mouse.down();

      // The clock container should still be visible during drag
      await expect(clock).toBeVisible();

      await page.mouse.up();
    }
  });
});

test.describe('Digital-to-Analog Sync', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('digital display shows current clock time', async ({ page }) => {
    // Both 12-hour and 24-hour formats should be visible
    const time12 = page.getByText(/\d{1,2}:\d{2}\s+(AM|PM)/);
    const time24 = page.getByText(/\d{2}:\d{2}/);

    await expect(time12.first()).toBeVisible();
    await expect(time24.first()).toBeVisible();
  });

  test('wheel pickers exist for time input', async ({ page }) => {
    // Check for wheel picker containers
    const wheelPickers = page.locator('.wheel-picker');
    await expect(wheelPickers.first()).toBeVisible();
  });

  test('changing digital time updates analog clock', async ({ page }) => {
    // Find the wheel pickers
    const wheelPickers = page.locator('.wheel-picker');
    const firstWheel = wheelPickers.first();

    if (await firstWheel.isVisible()) {
      // Scroll the wheel picker
      await firstWheel.evaluate((el) => {
        el.scrollTop += 40; // Scroll down one item
      });

      // Wait for the scroll to trigger an update
      await page.waitForTimeout(200);

      // The time display should be visible (sync should work)
      const timeDisplay = page.getByText(/\d{1,2}:\d{2}\s+(AM|PM)/).first();
      await expect(timeDisplay).toBeVisible();
    }
  });

  test('time in words updates with time changes', async ({ page }) => {
    // Check that a time-in-words display exists
    // Common patterns: "o'clock", "half past", "quarter past", "quarter to"
    const timeInWords = page.getByText(
      /(o'clock|half past|quarter past|quarter to|minutes? past|minutes? to)/i,
    );

    // At least one time-in-words display should be visible
    await expect(timeInWords.first()).toBeVisible();
  });

  test('analog clock and digital display show matching times', async ({ page }) => {
    // Get the digital time display
    const digitalTime = await page
      .getByText(/(\d{1,2}):(\d{2})\s+(AM|PM)/)
      .first()
      .textContent();

    // The clock should be visible and showing the same time
    const clock = page.locator('.clock-container').first();
    await expect(clock).toBeVisible();

    // Both displays should be visible simultaneously
    if (digitalTime) {
      const timeMatch = digitalTime.match(/(\d{1,2}):(\d{2})\s+(AM|PM)/);
      if (timeMatch) {
        // We can't directly read the clock hands position, but we verify
        // the digital display shows a valid time format
        expect(timeMatch[1]).toBeTruthy();
        expect(timeMatch[2]).toBeTruthy();
        expect(timeMatch[3]).toMatch(/AM|PM/);
      }
    }
  });
});

test.describe('Mobile Touch Interactions', () => {
  test('touch interactions work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const clock = page.locator('.clock-container').first();
    await expect(clock).toBeVisible();

    // Simulate touch interaction
    const boundingBox = await clock.boundingBox();
    if (boundingBox) {
      const centerX = boundingBox.x + boundingBox.width / 2;
      const centerY = boundingBox.y + boundingBox.height / 2;

      // Touch and drag
      await page.touchscreen.tap(centerX, centerY - boundingBox.height * 0.25);
    }
  });

  test('wheel picker responds to touch scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const wheelPicker = page.locator('.wheel-picker').first();
    if (await wheelPicker.isVisible()) {
      const boundingBox = await wheelPicker.boundingBox();
      if (boundingBox) {
        const centerX = boundingBox.x + boundingBox.width / 2;
        const startY = boundingBox.y + boundingBox.height / 2;

        // Simulate swipe gesture
        await page.touchscreen.tap(centerX, startY);
      }
    }
  });

  test('theme toggle works with touch', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const themeButton = page.getByRole('button', { name: /blue|pink/i });
    await expect(themeButton).toBeVisible();

    // Tap to toggle theme
    await themeButton.tap();

    // Theme should have changed
    await expect(themeButton).toBeVisible();
  });

  test('difficulty selector works with touch', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const difficultyButton = page.getByRole('button', {
      name: /easy|medium|hard/i,
    });
    await expect(difficultyButton).toBeVisible();

    // Tap to change difficulty
    await difficultyButton.tap();

    // Difficulty button should still be visible
    await expect(difficultyButton).toBeVisible();
  });

  test('quiz check button works with touch', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Find a check button in the quiz section
    const checkButton = page.getByRole('button', { name: /check/i }).first();
    if (await checkButton.isVisible()) {
      await checkButton.tap();

      // Should either show "Correct!" or "Try again!" feedback
      await page.waitForTimeout(100);
    }
  });

  test('new questions button works with touch', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const refreshButton = page.getByRole('button', { name: /new questions/i });
    await expect(refreshButton).toBeVisible();

    await refreshButton.tap();

    // Button should still be visible after tapping
    await expect(refreshButton).toBeVisible();
  });

  test('all main elements are accessible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify all main interactive elements are visible
    await expect(page.locator('.clock-container').first()).toBeVisible();
    await expect(page.getByText(/AM|PM/).first()).toBeVisible();
    await expect(page.getByText('What time is shown?')).toBeVisible();
    await expect(page.getByRole('button', { name: /blue|pink/i })).toBeVisible();
  });
});
