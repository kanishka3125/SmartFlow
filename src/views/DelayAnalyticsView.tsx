import React, { useState } from 'react';
import {
  BarChart3,
  Clock,
  DollarSign,
  TrendingDown,
  Layers,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Badge,
  Card,
  CardHeader,
  ChartDefs,
  ChartLegend,
  ChartTooltip,
  CorrelationStrip,
  HeroCard,
  PageHeader,
  StatCard,
  axisProps,
  chartColors,
  gridProps,
} from '../components/ui';

export const DelayAnalyticsView: React.FC = () => {
  const [costPerHour, setCostPerHour] = useState(125); // Configurable hospital bed-hour opportunity cost

  // Bottleneck Delay Metrics Breakdown
  const delayData = [
    { category: 'Central Pharmacy Med-Rec', observedMin: 68, targetMin: 25, delayMin: 43, bedHoursLost: 18.5 },
    { category: 'Insurance Query Response', observedMin: 85, targetMin: 30, delayMin: 55, bedHoursLost: 24.0 },
    { category: 'Environmental Bed Turnover', observedMin: 52, targetMin: 30, delayMin: 22, bedHoursLost: 14.2 },
    { category: 'Billing Item Audit', observedMin: 38, targetMin: 20, delayMin: 18, bedHoursLost: 9.6 },
    { category: 'CT Scanner Decision Latency', observedMin: 48, targetMin: 20, delayMin: 28, bedHoursLost: 12.0 },
    { category: 'Patient Transport Coordination', observedMin: 35, targetMin: 15, delayMin: 20, bedHoursLost: 8.4 },
  ];

  const totalLostBedHours = delayData.reduce((acc, d) => acc + d.bedHoursLost, 0);
  const totalFinancialImpact = Math.round(totalLostBedHours * costPerHour);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operational Efficiency & Fiscal Analytics"
        title="Delay & Cost"
        description="Quantifies operational friction across clinical handoffs, measuring lost bed-hours and opportunity cost resulting from avoidable administrative, pharmacy, and payor processing delays."
        actions={
          <>
            <label className="flex items-center gap-2 rounded-full bg-ink text-white pl-3.5 pr-2 py-1.5 text-xs">
              <span className="text-white/60 font-medium">Bed-hour cost</span>
              <span className="font-semibold">$</span>
              <input
                type="number"
                min="50"
                max="500"
                step="5"
                value={costPerHour}
                onChange={(e) => setCostPerHour(parseInt(e.target.value) || 125)}
                className="w-16 rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-white tabular-nums outline-none"
              />
              <span className="text-white/60 pr-1">/hr</span>
            </label>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HeroCard
          eyebrow="Cumulative lost bed-hours"
          value={totalLostBedHours.toFixed(1)}
          unit="bed-hours"
          caption="Equivalent to ~3.6 full inpatient hospital days lost to avoidable process friction."
          status={<Badge tone="critical" className="!bg-white/10 !border-white/10 !text-white">{delayData.length} workflows</Badge>}
          data={delayData}
          xKey="category"
          yKey="bedHoursLost"
          yLabel="Bed-hours lost"
          footer={
            <div className="flex items-center justify-between">
              <span>Lost bed-hours by workflow</span>
              <span className="text-white font-semibold tabular-nums">${totalFinancialImpact.toLocaleString()}</span>
            </div>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
          <StatCard
            label="Operational opportunity cost"
            icon={<DollarSign className="w-4 h-4" />}
            value={`$${totalFinancialImpact.toLocaleString()}`}
            footer={`At $${costPerHour}/bed-hour benchmark`}
          />
          <StatCard
            label="Largest bottleneck"
            icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
            value={55}
            unit="min avg delay"
            footer="Insurance query response · 24.0 bed-hours"
          />
          <CorrelationStrip
            className="sm:col-span-2"
            items={[
              { icon: <Clock className="w-3.5 h-3.5" />, label: 'Pharmacy med-rec', value: '+43', unit: 'min' },
              { icon: <Layers className="w-3.5 h-3.5" />, label: 'Bed turnover', value: '+22', unit: 'min' },
              { icon: <BarChart3 className="w-3.5 h-3.5" />, label: 'CT decision latency', value: '+28', unit: 'min' },
            ]}
          />
        </div>
      </div>

      {/* Delay Comparison Chart */}
      <Card>
        <CardHeader
          title="Observed duration vs SLA target"
          subtitle="Minutes per workflow; hatched bars are the SLA target, dark bars the observed average"
        />
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={delayData} margin={{ top: 10, right: 8, left: -24, bottom: 0 }} barGap={4} barCategoryGap="24%">
              <ChartDefs idPrefix="delay" />
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="category" {...axisProps} tick={{ fontSize: 10, fill: chartColors.axis }} interval={0} tickFormatter={(v: string) => v.split(' ')[0]} />
              <YAxis unit="m" {...axisProps} />
              <Tooltip cursor={{ fill: 'rgba(17,17,17,0.04)' }} content={<ChartTooltip unit="m" />} />
              <Bar dataKey="targetMin" name="Target SLA" fill="url(#delay-hatch)" stroke={chartColors.violet} radius={[8, 8, 8, 8]} />
              <Bar dataKey="observedMin" name="Observed" fill={chartColors.ink} radius={[8, 8, 8, 8]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3">
          <ChartLegend
            items={[
              { label: 'Observed', color: chartColors.ink },
              { label: 'SLA target', hatch: true },
            ]}
          />
        </div>
      </Card>

      {/* Delay Impact Table */}
      <div className="bg-card border border-line rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-line">
          <h3 className="text-sm font-bold text-slate-900">Workflow Bottleneck Delay & Cost Impact Audit</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-line">
              <tr>
                <th className="py-2.5 px-4">Workflow Process</th>
                <th className="py-2.5 px-4 text-center">Observed Avg</th>
                <th className="py-2.5 px-4 text-center">SLA Benchmark</th>
                <th className="py-2.5 px-4 text-center">Friction Variance</th>
                <th className="py-2.5 px-4 text-right">Lost Bed-Hours</th>
                <th className="py-2.5 px-4 text-right">Fiscal Cost Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {delayData.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-900">{d.category}</td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-800">{d.observedMin}m</td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-500">{d.targetMin}m</td>
                  <td className="py-3 px-4 text-center font-mono font-bold tabular-nums text-rose-700">
                    +{d.delayMin}m
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-slate-900">
                    {d.bedHoursLost} hrs
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                    ${Math.round(d.bedHoursLost * costPerHour).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
