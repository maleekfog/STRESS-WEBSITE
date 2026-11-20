import React from 'react';
import { LogoFinish } from '../types/garment';

interface StressWordmarkProps {
  finish?: LogoFinish;
  className?: string;
  sizeClass?: string;
}

const SIGNATURE_COLORS = ['#1F3D2B', '#4E6236', '#7F7F45', '#A98B5E', '#5B3A29', '#1A1512'];
const LETTERS = ['s', 't', 'r', 'e', 's', 's'];

const FINISH_COLOR_MAP: Record<Exclude<LogoFinish, 'signature'>, string> = {
  obsidian: '#1A1512',
  bone: '#F5F0E6',
  pine: '#1F3D2B',
  ochre: '#A98B5E',
};

export const StressWordmark: React.FC<StressWordmarkProps> = ({
  finish = 'signature',
  className = '',
  sizeClass = 'text-2xl',
}) => {
  return (
    <span
      className={`font-brand-serif lowercase tracking-[0.07em] leading-none select-none inline-flex items-baseline ${sizeClass} ${className}`}
      aria-label="stress"
    >
      {LETTERS.map((char, i) => (
        <span
          key={i}
          style={{
            color:
              finish === 'signature'
                ? SIGNATURE_COLORS[i]
                : FINISH_COLOR_MAP[finish],
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};
