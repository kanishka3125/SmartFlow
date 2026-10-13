import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface StatNumberProps {
  value: React.ReactNode;
  unit?: React.ReactNode;
  label?: React.ReactNode;
  delta?: { value: React.ReactNode; direction: 'up' | 'down'; good?: boolean };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'text-2xl',
  md: 'text-[32px]',
  lg: 'text-[44px]',
};

/** Big semibold number with a small unit beside it and an optional green/red delta badge. */
export const StatNumber: React.FC<StatNumberProps> = ({ value, unit, label, delta, size = 'md', className = '' }) => {
  const good = delta ? (delta.good ?? delta.direction === 'down') : false;
  return (
    <div className={className}>
      {label && <div className="text-[11px] font-medium text-ink-2">{label}</div>}
      <div className="flex items-baseline gap-1.5 mt-1">
        <span className={`${sizeClasses[size]} leading-none font-semibold tracking-tight text-ink tabular-nums`}>{value}</span>
        {unit && <span className="text-xs font-medium text-ink-3">{unit}</span>}
        {delta && (
          <span
            className={`ml-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold tabular-nums ${
              good ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {delta.direction === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {delta.value}
          </span>
        )}
      </div>
    </div>
  );
};

interface StatCardProps extends StatNumberProps {
  icon?: React.ReactNode;
  footer?: React.ReactNode;
}

/** Card wrapper around StatNumber, used for KPI rows. */
export const StatCard: React.FC<StatCardProps> = ({ icon, footer, label, className = '', ...rest }) => (
  <div className={`bg-card border border-line rounded-2xl p-4 shadow-2xs flex flex-col justify-between ${className}`}>
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-medium text-ink-2">{label}</span>
      {icon && <span className="text-ink-3">{icon}</span>}
    </div>
    <StatNumber {...rest} size={rest.size ?? 'sm'} className="mt-2" />
    {footer && <div className="mt-2 text-[11px] text-ink-3">{footer}</div>}
  </div>
);
