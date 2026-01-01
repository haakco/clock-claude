import { useRef, useEffect, useLayoutEffect, useCallback } from 'react';
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
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRepositioningRef = useRef(false);
  const isUserScrollingRef = useRef(false);

  // Create a tripled list for infinite scroll effect
  const extendedItems = [...items, ...items, ...items];
  const middleOffset = items.length;

  const currentIndex = items.indexOf(value);
  const targetScrollTop = (currentIndex + middleOffset) * itemHeight;

  // Set scroll position before browser paint to avoid visible animation
  useLayoutEffect(() => {
    if (containerRef.current && !isUserScrollingRef.current) {
      containerRef.current.scrollTop = targetScrollTop;
    }
  }, [value, targetScrollTop]);

  const snapToNearest = useCallback(() => {
    if (!containerRef.current || isRepositioningRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const snappedScrollTop = index * itemHeight;

    // Only animate if we need to move
    if (Math.abs(scrollTop - snappedScrollTop) > 1) {
      containerRef.current.scrollTo({
        top: snappedScrollTop,
        behavior: 'smooth',
      });
    }

    isUserScrollingRef.current = false;
  }, [itemHeight]);

  const handleInfiniteLoop = useCallback(() => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const totalHeight = items.length * itemHeight;

    // Check if we need to reposition for infinite loop
    if (scrollTop < totalHeight * 0.5) {
      isRepositioningRef.current = true;
      containerRef.current.scrollTop = scrollTop + totalHeight;
      // Small delay to let the reposition complete before allowing snap
      requestAnimationFrame(() => {
        isRepositioningRef.current = false;
      });
    } else if (scrollTop > totalHeight * 2.5) {
      isRepositioningRef.current = true;
      containerRef.current.scrollTop = scrollTop - totalHeight;
      requestAnimationFrame(() => {
        isRepositioningRef.current = false;
      });
    }
  }, [items.length, itemHeight]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || isRepositioningRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const actualIndex = ((index % items.length) + items.length) % items.length;
    const newValue = items[actualIndex];

    if (newValue !== value) {
      onChange(newValue);
    }

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set new timeout for scroll end detection
    scrollTimeoutRef.current = setTimeout(() => {
      handleInfiniteLoop();
      snapToNearest();
    }, 100);
  }, [items, itemHeight, value, onChange, handleInfiniteLoop, snapToNearest]);

  const handleScrollStart = useCallback(() => {
    isUserScrollingRef.current = true;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

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
        onTouchStart={handleScrollStart}
        onMouseDown={handleScrollStart}
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
