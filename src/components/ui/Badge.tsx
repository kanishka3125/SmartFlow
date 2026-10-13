import React from 'react';

export type Tone = 'critical' | 'warning' | 'ok' | 'info' | 'neutral';

const toneDot: Record<Tone, string> = {
  critical: 'bg-rose-500',
  warning: 'bg-amber-500',
  ok: 'bg-emerald-500',
  info: 'bg-accent',
  neutral: 'bg-ink-3',
};

const toneText: Record<Tone, string> = {
  critical: 'text-rose-700',
  warning: 'text-amber-700',
  ok: 'text-emerald-700',
  info: 'text-sky-800',
  neutral: 'text-ink-2',
};

/** Small status pill: a colored dot plus label on a neutral background. */
export const Badge: React.FC<{ tone?: Tone; children: React.ReactNode; className?: string }> = ({
  tone = 'neutral',
  children,
  className = '',
}) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-canvas border border-line text-[10px] font-semibold uppercase tracking-tight whitespace-nowrap ${toneText[tone]} ${className}`}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${toneDot[tone]}`} />
    {children}
  </span>
);

export const StatusDot: React.FC<{ tone?: Tone; className?: string }> = ({ tone = 'neutral', className = '' }) => (
  <span className={`inline-block w-2 h-2 rounded-full ${toneDot[tone]} ${className}`} />
);
