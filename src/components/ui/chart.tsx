import React from 'react';

/** Shared Recharts styling: small grey axis labels, no heavy grid, dark rounded tooltip. */
export const chartColors = {
  ink: '#111111',
  muted: '#d6d3cc',
  axis: '#9a9a9a',
  violet: '#a78bfa',
  violetSoft: '#c4b5fd',
  pink: '#f0abfc',
  threshold: '#e11d48',
};

export const axisProps = {
  tick: { fontSize: 11, fill: chartColors.axis },
  axisLine: false,
  tickLine: false,
} as const;

export const gridProps = {
  stroke: '#e6e4df',
  strokeDasharray: '2 6',
  vertical: false,
} as const;

/**
 * SVG <defs> to drop inside any Recharts chart.
 * - url(#sf-hatch): diagonal hatch for forecast / predicted bars
 * - url(#sf-violet): vertical violet → pink bar gradient
 * - url(#sf-area): violet → pink area fill fading to transparent
 */
export const ChartDefs: React.FC<{ idPrefix?: string }> = ({ idPrefix = 'sf' }) => (
  <defs>
    <pattern id={`${idPrefix}-hatch`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" fill="#f4f3f0" />
      <line x1="0" y1="0" x2="0" y2="6" stroke="#a78bfa" strokeWidth="2" />
    </pattern>
    <linearGradient id={`${idPrefix}-violet`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={chartColors.pink} />
      <stop offset="100%" stopColor={chartColors.violet} />
    </linearGradient>
    <linearGradient id={`${idPrefix}-area`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={chartColors.violet} stopOpacity={0.7} />
      <stop offset="60%" stopColor={chartColors.pink} stopOpacity={0.25} />
      <stop offset="100%" stopColor={chartColors.pink} stopOpacity={0} />
    </linearGradient>
    <linearGradient id={`${idPrefix}-stroke`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor={chartColors.violet} />
      <stop offset="100%" stopColor={chartColors.pink} />
    </linearGradient>
  </defs>
);

interface TooltipEntry {
  name?: React.ReactNode;
  value?: unknown;
  color?: string;
  dataKey?: unknown;
  payload?: Record<string, unknown>;
}

interface ChartTooltipProps {
  active?: boolean;
  label?: React.ReactNode;
  payload?: readonly TooltipEntry[];
  unit?: string;
  colorMap?: Record<string, string>;
}

/** Dark rounded tooltip with small colored legend dots. Pass as <Tooltip content={<ChartTooltip />} />. */
export const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, label, payload, unit = '', colorMap = {} }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl bg-hero text-white px-3 py-2 text-[11px] shadow-xl min-w-32">
      {label !== undefined && <div className="text-white/60 mb-1">{label}</div>}
      <div className="space-y-0.5">
        {payload
          .filter((p) => p.value !== null && p.value !== undefined)
          .map((p, i) => {
            const key = String(p.dataKey ?? i);
            const dot = colorMap[key] ?? (p.color && !p.color.startsWith('url') ? p.color : chartColors.violet);
            return (
              <div key={key} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
                  {p.name}
                </span>
                <span className="font-semibold tabular-nums">
                  {String(p.value)}
                  {unit}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

/** Inline legend with small dots, used under/above charts instead of Recharts' Legend. */
export const ChartLegend: React.FC<{ items: { label: string; color?: string; hatch?: boolean; dashed?: boolean }[] }> = ({
  items,
}) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink-2">
    {items.map((it) => (
      <span key={it.label} className="inline-flex items-center gap-1.5">
        {it.dashed ? (
          <span className="w-3 border-t border-dashed" style={{ borderColor: it.color }} />
        ) : (
          <span
            className={`w-2 h-2 rounded-full ${it.hatch ? 'hatch border border-accent' : ''}`}
            style={it.hatch ? undefined : { background: it.color }}
          />
        )}
        {it.label}
      </span>
    ))}
  </div>
);
