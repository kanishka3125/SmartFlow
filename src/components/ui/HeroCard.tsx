import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { ChartDefs, ChartTooltip } from './chart';

interface HeroCardProps {
  eyebrow: React.ReactNode;
  value: React.ReactNode;
  unit?: React.ReactNode;
  caption?: React.ReactNode;
  status?: React.ReactNode;
  data?: Record<string, unknown>[];
  xKey?: string;
  yKey?: string;
  children?: React.ReactNode;
  yLabel?: string;
  footer?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/** The single dark card per view: big number + optional violet → pink wave chart. */
export const HeroCard: React.FC<HeroCardProps> = ({
  eyebrow,
  value,
  unit,
  caption,
  status,
  data,
  xKey,
  yKey,
  yLabel,
  footer,
  action,
  children,
  className = '',
}) => (
  <div className={`relative overflow-hidden rounded-2xl bg-hero text-white p-6 flex flex-col ${className}`}>
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-[11px] font-medium text-white/60 uppercase tracking-wider">{eyebrow}</div>
        <div className="flex items-baseline gap-1.5 mt-3">
          <span className="text-[48px] leading-none font-semibold tracking-tight tabular-nums">{value}</span>
          {unit && <span className="text-sm font-medium text-white/50">{unit}</span>}
        </div>
        {caption && <div className="text-xs text-white/60 mt-2 max-w-xs leading-relaxed">{caption}</div>}
      </div>
      <div className="flex flex-col items-end gap-2">
        {status}
        {action}
      </div>
    </div>

    {children}

    {data && xKey && yKey && (
    <div className="h-36 -mx-6 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
          <ChartDefs idPrefix="hero" />
          <XAxis dataKey={xKey} hide />
          <Tooltip
            cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
            content={<ChartTooltip />}
          />
          <Area
            type="monotone"
            dataKey={yKey}
            name={yLabel ?? yKey}
            stroke="url(#hero-stroke)"
            strokeWidth={2.5}
            fill="url(#hero-area)"
            connectNulls
            dot={false}
            activeDot={{ r: 4, fill: '#f0abfc', stroke: '#151515', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    )}

    {footer && <div className="pt-4 mt-auto border-t border-white/10 text-[11px] text-white/60">{footer}</div>}
  </div>
);
