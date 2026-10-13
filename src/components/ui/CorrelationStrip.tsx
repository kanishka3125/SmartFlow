import React from 'react';

export interface CorrelationItem {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  unit?: string;
  hint?: React.ReactNode;
}

/** Bordered card with 3 inline stats, tiny icons, separated by vertical dividers. */
export const CorrelationStrip: React.FC<{ title?: string; items: CorrelationItem[]; className?: string }> = ({
  title,
  items,
  className = '',
}) => (
  <div className={`bg-card border border-line rounded-2xl shadow-2xs ${className}`}>
    {title && <div className="px-5 pt-4 text-[11px] font-medium text-ink-2">{title}</div>}
    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line">
      {items.map((it) => (
        <div key={it.label} className="px-5 py-4 flex items-center gap-3 min-w-0">
          <span className="w-7 h-7 rounded-full bg-canvas border border-line flex items-center justify-center text-ink-2 shrink-0">
            {it.icon}
          </span>
          <div className="min-w-0">
            <div className="text-[11px] text-ink-3 truncate">{it.label}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-ink tabular-nums leading-tight">{it.value}</span>
              {it.unit && <span className="text-[11px] text-ink-3">{it.unit}</span>}
            </div>
            {it.hint && <div className="text-[10px] text-ink-3 truncate">{it.hint}</div>}
          </div>
        </div>
      ))}
    </div>
  </div>
);
