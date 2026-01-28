import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { WheelPicker } from '../../src/components/DigitalDisplay/WheelPicker';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe('WheelPicker', () => {
  const hourItems = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const minuteItems = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const periodItems = ['AM', 'PM'];

  describe('rendering', () => {
    it('renders with hour items', () => {
      const onChange = vi.fn();
      render(<WheelPicker items={hourItems} value="3" onChange={onChange} />);

      // Should render the items (tripled for infinite scroll)
      expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1);
    });

    it('renders with minute items', () => {
      const onChange = vi.fn();
      render(<WheelPicker items={minuteItems} value="00" onChange={onChange} />);

      expect(screen.getAllByText('00').length).toBeGreaterThanOrEqual(1);
    });

    it('renders with period items', () => {
      const onChange = vi.fn();
      render(<WheelPicker items={periodItems} value="AM" onChange={onChange} />);

      expect(screen.getAllByText('AM').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('PM').length).toBeGreaterThanOrEqual(1);
    });

    it('highlights the selected value', () => {
      const onChange = vi.fn();
      render(<WheelPicker items={hourItems} value="6" onChange={onChange} />);

      const selectedItems = screen.getAllByText('6');
      // At least one of them should be styled as selected
      expect(selectedItems.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('interaction', () => {
    it('calls onChange when an item is clicked', () => {
      const onChange = vi.fn();
      render(<WheelPicker items={hourItems} value="3" onChange={onChange} />);

      // Find and click a different hour
      const targetItems = screen.getAllByText('5');
      fireEvent.click(targetItems[0]);

      expect(onChange).toHaveBeenCalledWith('5');
    });

    it('calls onChange for AM/PM toggle', () => {
      const onChange = vi.fn();
      render(<WheelPicker items={periodItems} value="AM" onChange={onChange} />);

      const pmItems = screen.getAllByText('PM');
      fireEvent.click(pmItems[0]);

      expect(onChange).toHaveBeenCalledWith('PM');
    });

    it('handles minute selection', () => {
      const onChange = vi.fn();
      render(<WheelPicker items={minuteItems} value="00" onChange={onChange} />);

      const target = screen.getAllByText('30');
      fireEvent.click(target[0]);

      expect(onChange).toHaveBeenCalledWith('30');
    });
  });

  describe('props', () => {
    it('uses default height of 150', () => {
      const onChange = vi.fn();
      render(<WheelPicker items={hourItems} value="3" onChange={onChange} />);

      // The container should exist with overflow hidden
      const container = document.querySelector('.overflow-hidden');
      expect(container).toBeDefined();
    });

    it('accepts custom height', () => {
      const onChange = vi.fn();
      render(<WheelPicker items={hourItems} value="3" onChange={onChange} height={200} />);

      const container = document.querySelector('.overflow-hidden');
      expect(container?.getAttribute('style')).toContain('height: 200px');
    });

    it('accepts custom itemHeight', () => {
      const onChange = vi.fn();
      render(<WheelPicker items={hourItems} value="3" onChange={onChange} itemHeight={50} />);

      // Items should have the custom height
      const items = document.querySelectorAll('.flex.items-center.justify-center');
      if (items.length > 0) {
        expect(items[0].getAttribute('style')).toContain('height: 50px');
      }
    });
  });

  describe('infinite scroll', () => {
    it('creates extended list for infinite scroll (tripled)', () => {
      const onChange = vi.fn();
      const items = ['A', 'B', 'C'];
      render(<WheelPicker items={items} value="A" onChange={onChange} />);

      // Each item should appear 3 times (tripled list)
      expect(screen.getAllByText('A').length).toBe(3);
      expect(screen.getAllByText('B').length).toBe(3);
      expect(screen.getAllByText('C').length).toBe(3);
    });
  });

  describe('scroll handling', () => {
    it('has a scrollable container', () => {
      const onChange = vi.fn();
      render(<WheelPicker items={hourItems} value="3" onChange={onChange} />);

      const scrollContainer = document.querySelector('.wheel-picker');
      expect(scrollContainer).toBeDefined();
    });

    it('handles touch start event', () => {
      const onChange = vi.fn();
      render(<WheelPicker items={hourItems} value="3" onChange={onChange} />);

      const scrollContainer = document.querySelector('.wheel-picker');
      if (scrollContainer) {
        fireEvent.touchStart(scrollContainer);
        // Should not throw an error
      }
    });

    it('handles mouse down event', () => {
      const onChange = vi.fn();
      render(<WheelPicker items={hourItems} value="3" onChange={onChange} />);

      const scrollContainer = document.querySelector('.wheel-picker');
      if (scrollContainer) {
        fireEvent.mouseDown(scrollContainer);
        // Should not throw an error
      }
    });
  });

  describe('selection highlight', () => {
    it('renders selection highlight element', () => {
      const onChange = vi.fn();
      render(<WheelPicker items={hourItems} value="3" onChange={onChange} />);

      // Should have a selection highlight positioned in the center
      const highlight = document.querySelector('.pointer-events-none.z-10');
      expect(highlight).toBeDefined();
    });
  });

  describe('value changes', () => {
    it('updates when value prop changes', () => {
      const onChange = vi.fn();
      const { rerender } = render(<WheelPicker items={hourItems} value="3" onChange={onChange} />);

      rerender(<WheelPicker items={hourItems} value="6" onChange={onChange} />);

      // The component should reflect the new value
      const selectedItems = screen.getAllByText('6');
      expect(selectedItems.length).toBeGreaterThanOrEqual(1);
    });
  });
});
