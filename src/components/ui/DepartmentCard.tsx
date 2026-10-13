import React, { useEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { StatusDot, Tone } from './Badge';

export interface DepartmentCardAction {
  label: string;
  onClick: () => void;
}

interface DepartmentCardProps {
  icon: React.ReactNode;
  name: string;
  subtitle?: string;
  percent: number;
  detail?: React.ReactNode;
  tone?: Tone;
  actions?: DepartmentCardAction[];
}

/** Ward / department occupancy tile: icon square, name, kebab menu, percent and hatched progress bar. */
export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  icon,
  name,
  subtitle,
  percent,
  detail,
  tone,
  actions = [],
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  return (
    <div className="bg-card border border-line rounded-2xl p-4 shadow-2xs flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-canvas border border-line flex items-center justify-center text-ink shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-ink truncate flex items-center gap-1.5">
              {name}
              {tone && tone !== 'ok' && tone !== 'neutral' && <StatusDot tone={tone} />}
            </div>
            {subtitle && <div className="text-[11px] text-ink-3 truncate">{subtitle}</div>}
          </div>
        </div>
        {actions.length > 0 && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={`${name} actions`}
              className="w-7 h-7 rounded-full flex items-center justify-center text-ink-3 hover:text-ink hover:bg-canvas cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 z-20 min-w-40 bg-card border border-line rounded-xl shadow-xl py-1">
                {actions.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => {
                      setMenuOpen(false);
                      a.onClick();
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-ink-2 hover:text-ink hover:bg-canvas cursor-pointer"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-1">
          <span className="text-[28px] leading-none font-semibold tracking-tight text-ink tabular-nums">
            {Math.round(percent)}
          </span>
          <span className="text-xs font-medium text-ink-3">%</span>
        </div>
        {detail && <div className="text-[11px] text-ink-3 text-right">{detail}</div>}
      </div>

      <ProgressBar value={percent} label={`${name} utilization`} />
    </div>
  );
};
