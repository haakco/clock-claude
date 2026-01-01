import { useRef, useEffect, useState, useCallback } from 'react';
import { useThemeStore } from '../../stores/themeStore';
import { getTheme } from '../../themes';

interface WheelPickerProps {
  items: string[];
  value: string;
  onChange: (value: string) => void;
  height?: number;
  itemHeight?: number;
}

export function WheelPicker({
  items,
  value,
  onChange,
  height = 150,
  itemHeight = 40,
}: WheelPickerProps) {
  const theme = useThemeStore((state) => state.theme);
  const colors = getTheme(theme).colors;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Create a tripled list for infinite scroll effect
  const extendedItems = [...items, ...items, ...items];
  const middleOffset = items.length;

  const currentIndex = items.indexOf(value);
  const targetScrollTop = (currentIndex + middleOffset) * itemHeight;

  // Scroll to the current value on mount and when value changes
  useEffect(() => {
    if (containerRef.current && !isDragging) {
      containerRef.current.scrollTop = targetScrollTop;
    }
  }, [value, targetScrollTop, isDragging]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const actualIndex = index % items.length;
    const newValue = items[actualIndex];

    if (newValue !== value) {
      onChange(newValue);
    }

    // Reset scroll position for infinite loop effect
    if (scrollTop < itemHeight * items.length * 0.5) {
      containerRef.current.scrollTop = scrollTop + items.length * itemHeight;
    } else if (scrollTop > itemHeight * items.length * 2.5) {
      containerRef.current.scrollTop = scrollTop - items.length * itemHeight;
    }
  }, [items, itemHeight, value, onChange]);

  const handleScrollEnd = useCallback(() => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const snappedScrollTop = index * itemHeight;

    containerRef.current.scrollTo({
      top: snappedScrollTop,
      behavior: 'smooth',
    });

    setIsDragging(false);
  }, [itemHeight]);

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{
        height,
        background: `linear-gradient(to bottom,
          ${colors.background} 0%,
          transparent 30%,
          transparent 70%,
          ${colors.background} 100%)`,
      }}
    >
      {/* Selection highlight */}
      <div
        className="absolute left-0 right-0 pointer-events-none z-10 rounded-lg"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          height: itemHeight,
          background: `${colors.primary}20`,
          borderTop: `2px solid ${colors.primary}`,
          borderBottom: `2px solid ${colors.primary}`,
        }}
      />

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto wheel-picker scrollbar-hide"
        style={{
          paddingTop: (height - itemHeight) / 2,
          paddingBottom: (height - itemHeight) / 2,
        }}
        onScroll={handleScroll}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={handleScrollEnd}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={handleScrollEnd}
        onMouseLeave={() => isDragging && handleScrollEnd()}
      >
        {extendedItems.map((item, index) => {
          const actualIndex = index % items.length;
          const isSelected = items[actualIndex] === value;

          return (
            <div
              key={index}
              className="flex items-center justify-center transition-all duration-150"
              style={{
                height: itemHeight,
                fontSize: isSelected ? '1.5rem' : '1.1rem',
                fontWeight: isSelected ? 'bold' : 'normal',
                color: isSelected ? colors.primary : colors.numbers,
                opacity: isSelected ? 1 : 0.5,
              }}
              onClick={() => onChange(item)}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}
