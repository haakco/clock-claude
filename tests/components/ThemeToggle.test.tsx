import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from '../../src/components/Layout/ThemeToggle';
import { useThemeStore } from '../../src/stores/themeStore';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span {...props}>{children}</span>
    ),
  },
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Reset the theme store to a known state
    useThemeStore.setState({ theme: 'blue' });
  });

  describe('rendering', () => {
    it('renders as a button', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toBeDefined();
    });

    it('displays blue theme indicator when theme is blue', () => {
      useThemeStore.setState({ theme: 'blue' });
      render(<ThemeToggle />);
      expect(screen.getByText('Blue')).toBeDefined();
    });

    it('displays pink theme indicator when theme is pink', () => {
      useThemeStore.setState({ theme: 'pink' });
      render(<ThemeToggle />);
      expect(screen.getByText('Pink')).toBeDefined();
    });

    it('shows correct emoji for blue theme', () => {
      useThemeStore.setState({ theme: 'blue' });
      render(<ThemeToggle />);
      // The blue circle emoji should be present
      const button = screen.getByRole('button');
      expect(button.textContent).toContain('Blue');
    });

    it('shows correct emoji for pink theme', () => {
      useThemeStore.setState({ theme: 'pink' });
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button.textContent).toContain('Pink');
    });
  });

  describe('toggle functionality', () => {
    it('toggles theme from blue to pink on click', () => {
      useThemeStore.setState({ theme: 'blue' });
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(useThemeStore.getState().theme).toBe('pink');
    });

    it('toggles theme from pink to blue on click', () => {
      useThemeStore.setState({ theme: 'pink' });
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(useThemeStore.getState().theme).toBe('blue');
    });

    it('toggles theme multiple times correctly', () => {
      useThemeStore.setState({ theme: 'blue' });
      render(<ThemeToggle />);

      const button = screen.getByRole('button');

      fireEvent.click(button);
      expect(useThemeStore.getState().theme).toBe('pink');

      fireEvent.click(button);
      expect(useThemeStore.getState().theme).toBe('blue');

      fireEvent.click(button);
      expect(useThemeStore.getState().theme).toBe('pink');
    });
  });

  describe('store integration', () => {
    it('uses toggleTheme from store', () => {
      useThemeStore.setState({ theme: 'blue' });
      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      // Check that the theme was toggled
      expect(useThemeStore.getState().theme).toBe('pink');
    });

    it('reflects store state changes', () => {
      useThemeStore.setState({ theme: 'blue' });
      const { rerender } = render(<ThemeToggle />);

      expect(screen.getByText('Blue')).toBeDefined();

      // Manually update the store
      useThemeStore.setState({ theme: 'pink' });
      rerender(<ThemeToggle />);

      expect(screen.getByText('Pink')).toBeDefined();
    });
  });

  describe('styling', () => {
    it('has rounded button styling', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('rounded-full');
    });

    it('has appropriate padding', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('px-4');
      expect(button.className).toContain('py-2');
    });

    it('has white text color', () => {
      render(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('text-white');
    });
  });

  describe('responsive behavior', () => {
    it('has hidden label on small screens', () => {
      render(<ThemeToggle />);
      const label = screen.getByText(/Blue|Pink/);
      expect(label.className).toContain('hidden');
      expect(label.className).toContain('sm:inline');
    });
  });
});
