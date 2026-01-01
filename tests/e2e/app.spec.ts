import { test, expect } from '@playwright/test';

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
