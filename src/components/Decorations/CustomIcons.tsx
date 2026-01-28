interface IconProps {
  size?: number;
  className?: string;
}

// Simple dinosaur (T-Rex silhouette)
export function Dinosaur({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18 4c-1 0-2 .5-2.5 1.5-.3.6-.5 1.5-.5 2.5 0 .5.1 1 .2 1.5H12c-1 0-2 .5-2 1.5v1c0 .5.2 1 .5 1.3L8 16v2l2-1v2h2v-3l2-2h2v1l3 2v-2l-1-1v-2c1-.5 2-1.5 2-3V6c0-1-1-2-2-2zm1 4c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1-.5 1-1 1z" />
    </svg>
  );
}

// Football/Soccer ball
export function SoccerBall({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2c1.5 2 2.5 4 2.5 6s-1 4-2.5 6c-1.5-2-2.5-4-2.5-6s1-4 2.5-6z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M2 12c2-1.5 4-2.5 6-2.5s4 1 6 2.5c-2 1.5-4 2.5-6 2.5s-4-1-6-2.5z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

// Butterfly
export function Butterfly({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <ellipse cx="7" cy="9" rx="5" ry="6" opacity="0.8" />
      <ellipse cx="17" cy="9" rx="5" ry="6" opacity="0.8" />
      <ellipse cx="7" cy="16" rx="4" ry="5" opacity="0.6" />
      <ellipse cx="17" cy="16" rx="4" ry="5" opacity="0.6" />
      <rect x="11" y="5" width="2" height="14" rx="1" />
      <path
        d="M10 5c-1-2-2-3-3-3M14 5c1-2 2-3 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

// Unicorn head
export function Unicorn({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l2 6h-4l2-6z" opacity="0.8" />
      <ellipse cx="12" cy="14" rx="7" ry="8" />
      <ellipse cx="9" cy="12" rx="1" ry="1.5" fill="white" opacity="0.8" />
      <circle cx="9" cy="12" r="0.5" fill="black" />
      <path d="M8 17c1.5 1 3.5 1 5 0" stroke="white" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M4 10c-1-2 0-4 2-5" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M20 10c1-2 0-4-2-5" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

// Rainbow arc
export function Rainbow({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M2 18 A10 10 0 0 1 22 18" stroke="#ef4444" strokeWidth="2" fill="none" />
      <path d="M4 18 A8 8 0 0 1 20 18" stroke="#f97316" strokeWidth="2" fill="none" />
      <path d="M6 18 A6 6 0 0 1 18 18" stroke="#eab308" strokeWidth="2" fill="none" />
      <path d="M8 18 A4 4 0 0 1 16 18" stroke="#22c55e" strokeWidth="2" fill="none" />
      <path d="M10 18 A2 2 0 0 1 14 18" stroke="#3b82f6" strokeWidth="2" fill="none" />
    </svg>
  );
}
