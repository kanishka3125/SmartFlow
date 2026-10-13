import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({ padded = true, className = '', children, ...rest }) => (
  <div
    className={`bg-card border border-line rounded-2xl shadow-2xs ${padded ? 'p-5' : ''} ${className}`}
    {...rest}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, icon, action, className = '' }) => (
  <div className={`flex items-start justify-between gap-3 mb-4 ${className}`}>
    <div className="flex items-start gap-2.5 min-w-0">
      {icon && (
        <div className="w-8 h-8 rounded-xl bg-canvas border border-line flex items-center justify-center text-ink shrink-0">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-ink tracking-tight">{title}</h3>
        {subtitle && <p className="text-[11px] text-ink-3 mt-0.5 leading-relaxed">{subtitle}</p>}
      </div>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
