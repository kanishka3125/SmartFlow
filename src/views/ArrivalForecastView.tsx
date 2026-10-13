import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Info,
  Calendar,
  Clock,
  Layers,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  Badge,
  Card,
  CardHeader,
  ChartDefs,
  ChartLegend,
  ChartTooltip,
  HeroCard,
  PageHeader,
  PillSelect,
  StatCard,
  axisProps,
  chartColors,
  gridProps,
} from '../components/ui';
import { useHospital } from '../context/HospitalContext';
import { calculateArrivalForecast } from '../services/forecasting';
import { DepartmentId } from '../types/hospital';

export const ArrivalForecastView: React.FC = () => {
  const { historicalArrivals, availableBeds } = useHospital();
  const [selectedDept, setSelectedDept] = useState<DepartmentId>('ED');
  const [surgeMultiplier, setSurgeMultiplier] = useState<number>(1.0);

  const forecasts = calculateArrivalForecast(historicalArrivals, selectedDept, surgeMultiplier, availableBeds);

  const chartData = forecasts.map((f) => ({
    hour: f.hourLabel,
    predicted: f.predictedArrivals,
    lower: f.lowerBound,
    upper: f.upperBound,
    capacity: f.availableCapacity,
    risk: f.capacityShortageRisk,
  }));

  const totalDemand = forecasts.reduce((acc, f) => acc + f.predictedArrivals, 0);
  const criticalHours = forecasts.filter((f) => f.capacityShortageRisk === 'critical' || f.capacityShortageRisk === 'high');
  const peak = forecasts.reduce<(typeof forecasts)[number] | undefined>(
    (best, f) => (!best || f.predictedArrivals > best.predictedArrivals ? f : best),
    undefined
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Predictive Operations"
        title="Arrival Forecast"
        description="Transparent statistical model built on 14 days of diurnal intake patterns, day-of-week seasonality and hourly variance."
        actions={
          <>
            <PillSelect
              value={selectedDept}
              onChange={setSelectedDept}
              label="Unit"
              options={[
                { value: 'ED', label: 'Emergency Medicine' },
                { value: 'MED', label: 'General Medicine Admissions' },
              ]}
            />
            <div className="flex items-center gap-2 rounded-full bg-ink text-white pl-3.5 pr-4 py-2 text-xs">
              <Sliders className="w-3.5 h-3.5 text-white/60" />
              <span className="text-white/60 font-medium">Surge</span>
              <span className="font-semibold tabular-nums w-8">{surgeMultiplier.toFixed(1)}x</span>
              <input
                type="range"
                min="0.8"
                max="1.8"
                step="0.1"
                value={surgeMultiplier}
                onChange={(e) => setSurgeMultiplier(parseFloat(e.target.value))}
                aria-label="Surge factor"
                className="w-20 cursor-pointer [accent-color:#c4b5fd]"
              />
            </div>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HeroCard
          eyebrow="12-hour projected intake"
          value={totalDemand}
          unit="patients"
          caption={`~${Math.round(totalDemand / 12)} arrivals per hour against ${availableBeds} beds of turnover capacity.`}
          status={
            <Badge tone={criticalHours.length > 0 ? 'critical' : 'ok'} className="!bg-white/10 !border-white/10 !text-white">
              {criticalHours.length} hrs at risk
            </Badge>
          }
          data={chartData}
          xKey="hour"
          yKey="predicted"
          yLabel="Predicted arrivals"
          footer={
            <div className="flex items-center justify-between">
              <span>
                {chartData[0]?.hour} → {chartData[chartData.length - 1]?.hour}
              </span>
              <span className="text-white font-semibold">95% confidence band</span>
            </div>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
          <StatCard
            label="Capacity deficit risk"
            icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
            value={criticalHours.length}
            unit="hours at risk"
            footer={
              criticalHours.length > 0 ? (
                <Badge tone="critical">
                  {criticalHours[0].hourLabel}–{criticalHours[criticalHours.length - 1].hourLabel} window
                </Badge>
              ) : (
                <Badge tone="ok">Within capacity</Badge>
              )
            }
          />
          <StatCard
            label="Peak hour"
            icon={<Clock className="w-4 h-4" />}
            value={peak?.predictedArrivals ?? 0}
            unit={`at ${peak?.hourLabel ?? '—'}`}
            footer={`Range ${peak?.lowerBound ?? 0}–${peak?.upperBound ?? 0} patients`}
          />
          <Card className="sm:col-span-2">
            <div className="text-[11px] font-medium text-ink-2">Model methodology</div>
            <div className="text-sm font-semibold text-ink mt-1">Diurnal moving average + seasonality</div>
            <div className="text-[11px] text-ink-3 mt-1">Confidence interval: 95% (±1.96 standard deviations)</div>
          </Card>
        </div>
      </div>

      {/* Main Forecast Chart */}
      <Card>
        <CardHeader
          title="Projected intake horizon · next 12 hours"
          subtitle={`Predicted arrivals (hatched) against available bed turnover capacity (${availableBeds} beds/hr, dashed)`}
        />
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 8, left: -24, bottom: 0 }} barCategoryGap="30%">
              <ChartDefs idPrefix="af" />
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="hour" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip cursor={{ fill: 'rgba(17,17,17,0.04)' }} content={<ChartTooltip />} />
              <Area type="monotone" dataKey="upper" name="95% upper bound" stroke="none" fill="url(#af-area)" />
              <Bar dataKey="predicted" name="Predicted arrivals" radius={[8, 8, 8, 8]}>
                {chartData.map((d) => (
                  <Cell
                    key={d.hour}
                    fill={d.risk === 'critical' || d.risk === 'high' ? 'url(#af-violet)' : 'url(#af-hatch)'}
                    stroke={chartColors.violet}
                  />
                ))}
              </Bar>
              <ReferenceLine y={availableBeds} stroke={chartColors.threshold} strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="lower"
                name="95% lower bound"
                stroke={chartColors.ink}
                strokeWidth={1}
                strokeDasharray="2 4"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3">
          <ChartLegend
            items={[
              { label: 'Forecast', hatch: true },
              { label: 'High-risk hour', color: chartColors.pink },
              { label: '95% band', color: chartColors.violetSoft },
              { label: 'Bed capacity', color: chartColors.threshold, dashed: true },
            ]}
          />
        </div>
      </Card>

      {/* Hourly Forecast Breakdown Table */}
      <Card padded={false} className="overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-ink">Hourly demand & capacity risk</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-line">
              <tr>
                <th className="py-2.5 px-4">Time Window</th>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4 text-center">Predicted Arrivals</th>
                <th className="py-2.5 px-4 text-center">95% Range (Lower - Upper)</th>
                <th className="py-2.5 px-4 text-center">Turnover Capacity</th>
                <th className="py-2.5 px-4 text-right">Capacity Shortage Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {forecasts.map((f, i) => (
                <tr key={i} className="hover:bg-slate-50/60 font-sans">
                  <td className="py-2.5 px-4 font-semibold text-slate-900 font-mono">{f.hourLabel}</td>
                  <td className="py-2.5 px-4 text-slate-600">{f.departmentId}</td>
                  <td className="py-2.5 px-4 text-center font-bold font-mono tabular-nums text-ink">
                    {f.predictedArrivals}
                  </td>
                  <td className="py-2.5 px-4 text-center text-slate-500 font-mono tabular-nums">
                    {f.lowerBound} – {f.upperBound}
                  </td>
                  <td className="py-2.5 px-4 text-center text-slate-700 font-mono tabular-nums">
                    {f.availableCapacity} beds
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <Badge
                      tone={
                        f.capacityShortageRisk === 'critical'
                          ? 'critical'
                          : f.capacityShortageRisk === 'high'
                          ? 'warning'
                          : f.capacityShortageRisk === 'moderate'
                          ? 'info'
                          : 'ok'
                      }
                    >
                      {f.capacityShortageRisk}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
