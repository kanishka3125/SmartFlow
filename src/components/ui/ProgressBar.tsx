import React from 'react';

interface ProgressBarProps {
  value: number; // 0–100
  tone?: 'dark' | 'accent';
  height?: number;
  className?: string;
  label?: string;
}

/** Thin bar: filled part dark (or violet), unfilled part diagonal hatch. The accent tone is meant for the dark hero card. */
export const ProgressBar: React.FC<ProgressBarProps> = ({ value, tone = 'dark', height = 8, className = '', label }) => {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`w-full rounded-full overflow-hidden ${tone === 'accent' ? 'hatch-dark' : 'hatch'} ${className}`}
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${tone === 'accent' ? 'accent-gradient' : 'bg-ink'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};
