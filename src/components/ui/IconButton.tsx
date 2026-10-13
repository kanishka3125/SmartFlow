import React from 'react';

type IconVariant = 'light' | 'dark' | 'accent';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconVariant;
  size?: 'sm' | 'md';
  label: string;
  badge?: number;
}

const variantClasses: Record<IconVariant, string> = {
  light: 'bg-card text-ink border border-line hover:border-slate-300',
  dark: 'bg-ink text-white border border-ink hover:bg-slate-800',
  accent: 'accent-gradient text-ink border border-transparent hover:brightness-105',
};

export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'light',
  size = 'md',
  label,
  badge,
  className = '',
  children,
  type = 'button',
  ...rest
}) => (
  <button
    type={type}
    aria-label={label}
    title={label}
    className={`relative inline-flex items-center justify-center rounded-full transition-colors cursor-pointer shrink-0 ${
      size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
    } ${variantClasses[variant]} ${className}`}
    {...rest}
  >
    {children}
    {badge !== undefined && badge > 0 && (
      <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
        {badge}
      </span>
    )}
  </button>
);
