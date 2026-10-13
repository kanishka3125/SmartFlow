import React from 'react';

type PillVariant = 'dark' | 'light' | 'accent' | 'ghost' | 'success' | 'danger';
type PillSize = 'sm' | 'md';

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PillVariant;
  size?: PillSize;
  icon?: React.ReactNode;
  active?: boolean;
}

const variantClasses: Record<PillVariant, string> = {
  dark: 'bg-ink text-white hover:bg-slate-800 border border-ink',
  light: 'bg-card text-ink border border-line hover:border-slate-300',
  accent: 'accent-gradient text-ink border border-transparent hover:brightness-105',
  ghost: 'bg-transparent text-ink-2 hover:text-ink border border-transparent',
  success: 'bg-emerald-700 text-white hover:bg-emerald-800 border border-emerald-700',
  danger: 'bg-rose-700 text-white hover:bg-rose-800 border border-rose-700',
};

const sizeClasses: Record<PillSize, string> = {
  sm: 'px-3 py-1 text-[11px] gap-1',
  md: 'px-4 py-2 text-xs gap-1.5',
};

export const PillButton: React.FC<PillButtonProps> = ({
  variant = 'light',
  size = 'md',
  icon,
  active,
  className = '',
  children,
  type = 'button',
  ...rest
}) => {
  const v = active === undefined ? variant : active ? 'dark' : 'light';
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[v]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
};
