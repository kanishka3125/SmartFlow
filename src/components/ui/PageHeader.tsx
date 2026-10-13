import React from 'react';
import { ChevronDown } from 'lucide-react';

interface PageHeaderProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

/** Large title on the left; dark pill controls, round icon buttons and a primary action on the right. */
export const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, description, actions }) => (
  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
    <div className="min-w-0">
      {eyebrow && <div className="text-[11px] font-medium text-ink-3 uppercase tracking-wider mb-1.5">{eyebrow}</div>}
      <h1 className="text-[32px] sm:text-[40px] leading-[1.05] font-semibold tracking-tight text-ink">{title}</h1>
      {description && <p className="text-xs text-ink-2 mt-2 max-w-2xl leading-relaxed">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
  </div>
);

interface PillSelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  icon?: React.ReactNode;
  variant?: 'dark' | 'light';
  label?: string;
  className?: string;
}

/** Native select styled as a pill, dark by default for header controls. */
export function PillSelect<T extends string>({
  value,
  onChange,
  options,
  icon,
  variant = 'dark',
  label,
  className = '',
}: PillSelectProps<T>) {
  const dark = variant === 'dark';
  return (
    <label
      className={`relative inline-flex items-center gap-1.5 rounded-full pl-3.5 pr-8 py-2 text-xs font-semibold cursor-pointer max-w-full ${
        dark ? 'bg-ink text-white' : 'bg-card text-ink border border-line'
      } ${className}`}
    >
      {icon}
      {label && <span className={dark ? 'text-white/60 font-medium' : 'text-ink-3 font-medium'}>{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        aria-label={label}
        className={`appearance-none bg-transparent border-0 outline-none cursor-pointer truncate min-w-0 ${dark ? 'text-white' : 'text-ink'}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-ink bg-card">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className={`w-3.5 h-3.5 absolute right-3 pointer-events-none ${dark ? 'text-white/60' : 'text-ink-3'}`} />
    </label>
  );
}
