import React from 'react';

export interface TabItem<T extends string> {
  id: T;
  label: React.ReactNode;
  badge?: React.ReactNode;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}

/** Pill-shaped segmented tabs: white pills, active = dark pill with white text. */
export function Tabs<T extends string>({ items, value, onChange, size = 'md', className = '' }: TabsProps<T>) {
  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar ${className}`} role="tablist">
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={`inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer border ${
              size === 'sm' ? 'px-3 py-1 text-[11px]' : 'px-4 py-2 text-xs'
            } ${
              active
                ? 'bg-ink text-white border-ink'
                : 'bg-card text-ink-2 border-line hover:text-ink hover:border-slate-300'
            }`}
          >
            {item.label}
            {item.badge}
          </button>
        );
      })}
    </div>
  );
}
