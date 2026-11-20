import React from 'react';

interface StressEmblemProps {
  className?: string;
  color?: string;
  title?: string;
}

/**
 * The Fault-Line Seal: enigmatic fractured spire & detached horizon bar
 * extracted from Look 57's woven Forest Pine collar label.
 * Symbolizes silent tectonic tension — composed under pressure.
 */
export const StressEmblem: React.FC<StressEmblemProps> = ({
  className = 'w-6 h-7',
  color = 'currentColor',
  title = 'stress Fault-Line Seal emblem',
}) => {
  return (
    <svg
      viewBox="0 0 64 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      {/* Fractured Ascent: unbroken tension vector deflected under load */}
      <path
        d="M35 8 L17 37 L31.5 37 L35 30 L51 49 L35.5 45.5 L49.5 66"
        stroke={color}
        strokeWidth="4.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* Detached Horizon Bar: quiet composure & what remains unspoken */}
      <line
        x1="10"
        y1="66"
        x2="37"
        y2="66"
        stroke={color}
        strokeWidth="4.4"
        strokeLinecap="butt"
      />
    </svg>
  );
};
