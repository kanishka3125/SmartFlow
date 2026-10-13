import React, { useState } from 'react';
import {
  BedDouble,
  Clock,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Plus,
  Sliders,
  Bell,
  Calendar,
  Filter,
  Ambulance,
  HeartPulse,
  Stethoscope,
  Bone,
  Scan,
  FlaskConical,
  Activity,
  Scissors,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useHospital } from '../context/HospitalContext';
import { calculateArrivalForecast } from '../services/forecasting';
import { NavTabId } from '../components/navigation';
import { DepartmentId } from '../types/hospital';
import {
  Card,
  CardHeader,
  PageHeader,
  PillSelect,
  PillButton,
  IconButton,
  HeroCard,
  StatCard,
  DepartmentCard,
  CorrelationStrip,
  Badge,
  ChartDefs,
  ChartTooltip,
  ChartLegend,
  axisProps,
  gridProps,
  chartColors,
  Tone,
} from '../components/ui';

interface CommandCenterProps {
  setActiveTab: (tab: NavTabId) => void;
}

const deptIcons: Record<DepartmentId, React.ReactNode> = {
  ED: <Ambulance className="w-4 h-4" />,
  ICU: <Activity className="w-4 h-4" />,
  MED: <Stethoscope className="w-4 h-4" />,
  SURG: <Scissors className="w-4 h-4" />,
  CARD: <HeartPulse className="w-4 h-4" />,
  ORTHO: <Bone className="w-4 h-4" />,
  RAD: <Scan className="w-4 h-4" />,
  LAB: <FlaskConical className="w-4 h-4" />,
};

type RangeId = 'shift' | 'recent';
type DeptFilter = 'all' | 'inpatient' | 'diagnostics';

export const CommandCenter: React.FC<CommandCenterProps> = ({ setActiveTab }) => {
  const {
    totalBeds,
    occupiedBeds,
    availableBeds,
    cleaningBeds,
    occupancyRate,
    patientsWaitingAdmission,
    avgWaitTimeMinutes,
    patientsAwaitingDischarge,
    blockedDischargesCount,
    activeAlertsCount,
    edBoardingCount,
    departments,
    beds,
    diagnosticEquipment,
    autopilotPlans,
    historicalArrivals,
  } = useHospital();

  const [range, setRange] = useState<RangeId>('shift');
  const [deptFilter, setDeptFilter] = useState<DeptFilter>('all');

  // Arrival forecasts for next 8 hours
  const forecasts = calculateArrivalForecast(historicalArrivals, 'ED', 1.0, availableBeds).slice(0, 8);
  const totalPredictedArrivals = forecasts.reduce((sum, f) => sum + f.predictedArrivals, 0);

  // Observed vs forecast ED intake for the current shift
  const arrivalTrendData = [
    { time: '16:00', actual: 6, forecast: 5 },
    { time: '17:00', actual: 8, forecast: 7 },
    { time: '18:00', actual: 11, forecast: 9 },
    { time: '19:00', actual: 12, forecast: 11 },
    { time: '20:00', actual: 14, forecast: 13 },
    { time: '21:00', actual: 15, forecast: 14 },
    { time: '22:00', actual: 13, forecast: 12 },
    { time: '23:00', actual: null, forecast: 10 },
    { time: '00:00', actual: null, forecast: 7 },
    { time: '01:00', actual: null, forecast: 5 },
  ];
  const trendWindow = range === 'shift' ? arrivalTrendData : arrivalTrendData.slice(3);
  const intakeBars = trendWindow.map((d) => ({
    time: d.time,
    arrivals: d.actual ?? d.forecast,
    isForecast: d.actual === null,
  }));
  const heroSeries = arrivalTrendData.map((d) => ({ time: d.time, arrivals: d.actual ?? d.forecast }));

  // Department utilization: bed ledger where available, equipment throughput for diagnostics.
  // ED has no inpatient bed ledger, so it keeps the dashboard's existing ED occupancy figure.
  const ED_OCCUPANCY = 85;
  const deptCards = departments
    .map((d) => {
      const deptBeds = beds.filter((b) => b.departmentId === d.id);
      const deptEquipment = diagnosticEquipment.filter((e) => e.departmentId === d.id);
      let percent: number;
      let detail: string;
      if (deptBeds.length > 0) {
        const inUse = deptBeds.filter((b) => ['occupied', 'reserved', 'discharge_pending'].includes(b.status)).length;
        percent = (inUse / deptBeds.length) * 100;
        detail = `${inUse}/${deptBeds.length} beds`;
      } else if (deptEquipment.length > 0) {
        const done = deptEquipment.reduce((s, e) => s + e.currentCompletedToday, 0);
        const cap = deptEquipment.reduce((s, e) => s + e.dailyCapacity, 0);
        percent = cap > 0 ? (done / cap) * 100 : 0;
        detail = `${deptEquipment.reduce((s, e) => s + e.queueLength, 0)} queued`;
      } else if (d.id === 'ED') {
        percent = ED_OCCUPANCY;
        detail = `${d.currentQueue} in queue`;
      } else {
        percent = 0;
        detail = `${d.currentQueue} in queue`;
      }
      const tone: Tone = percent >= 90 ? 'critical' : percent >= 80 ? 'warning' : 'ok';
      const kind: DeptFilter = d.totalBeds > 0 ? 'inpatient' : 'diagnostics';
      return { dept: d, percent, detail, tone, kind };
    })
    .filter((c) => deptFilter === 'all' || c.kind === deptFilter);

  const diagnosticBacklog = diagnosticEquipment.reduce((s, e) => s + e.queueLength, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Metropolitan Memorial Hospital · Live"
        title="Command Center"
        actions={
          <>
            <PillSelect
              value={range}
              onChange={setRange}
              icon={<Calendar className="w-3.5 h-3.5 text-white/60" />}
              options={[
                { value: 'shift', label: 'This shift' },
                { value: 'recent', label: 'Last 6 hours' },
              ]}
              label="Range"
            />
            <PillSelect
              value={deptFilter}
              onChange={setDeptFilter}
              icon={<Filter className="w-3.5 h-3.5 text-white/60" />}
              options={[
                { value: 'all', label: 'All units' },
                { value: 'inpatient', label: 'Inpatient wards' },
                { value: 'diagnostics', label: 'Diagnostics' },
              ]}
              label="Units"
            />
            <IconButton label="What-if simulator" onClick={() => setActiveTab('simulator')}>
              <Sliders className="w-4 h-4" />
            </IconButton>
            <IconButton label="Alerts & tasks" badge={activeAlertsCount} onClick={() => setActiveTab('alerts')}>
              <Bell className="w-4 h-4" />
            </IconButton>
            <IconButton label="Recommend & allocate a bed" variant="accent" onClick={() => setActiveTab('bed-management')}>
              <Plus className="w-5 h-5" />
            </IconButton>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard
          label="Occupied beds"
          icon={<BedDouble className="w-4 h-4" />}
          value={occupiedBeds}
          unit={`/ ${totalBeds}`}
          footer={`${occupancyRate}% occupancy`}
        />
        <StatCard
          label="Available beds"
          icon={<span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />}
          value={availableBeds}
          footer={`${cleaningBeds} in cleaning turnover`}
        />
        <StatCard
          label="ED boarding"
          icon={<ShieldAlert className="w-4 h-4 text-rose-600" />}
          value={edBoardingCount}
          unit="patients"
          footer={<Badge tone="critical">&gt;90 min hold</Badge>}
        />
        <StatCard
          label="Avg admission wait"
          icon={<Clock className="w-4 h-4" />}
          value={avgWaitTimeMinutes}
          unit="min"
          footer={`${patientsWaitingAdmission} waiting in queue`}
        />
        <StatCard
          label="Arrival forecast · 8h"
          icon={<TrendingUp className="w-4 h-4" />}
          value={`~${totalPredictedArrivals}`}
          unit="arrivals"
          footer={<Badge tone="warning">Deficit projected</Badge>}
        />
        <StatCard
          label="Discharge blockers"
          icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
          value={blockedDischargesCount}
          footer={`${patientsAwaitingDischarge} awaiting discharge`}
        />
      </div>

      {/* Main 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: hero KPI + intake chart */}
        <div className="space-y-6 min-w-0">
          <HeroCard
            eyebrow="Hospital bed occupancy"
            value={occupancyRate}
            unit="%"
            caption={`${occupiedBeds} of ${totalBeds} acute beds occupied or reserved. ED intake trend for this shift shown below.`}
            status={<Badge tone={occupancyRate > 85 ? 'critical' : 'ok'} className="!bg-white/10 !border-white/10 !text-white">
              {occupancyRate > 85 ? 'Critical load' : 'Nominal'}
            </Badge>}
            action={
              <PillButton
                variant="accent"
                size="sm"
                icon={<Sparkles className="w-3.5 h-3.5" />}
                onClick={() => setActiveTab('autopilot')}
              >
                Autopilot · {autopilotPlans.length} plan
              </PillButton>
            }
            data={heroSeries}
            xKey="time"
            yKey="arrivals"
            yLabel="ED arrivals"
            footer={
              <div className="flex items-center justify-between">
                <span>16:00 → 01:00 (forecast after 22:00)</span>
                <span className="text-white font-semibold tabular-nums">{availableBeds} beds free</span>
              </div>
            }
          />

          <Card>
            <CardHeader
              title="ED intake vs capacity"
              subtitle="Observed hourly arrivals with diurnal forecast; dashed line marks available bed turnover"
              action={
                <PillButton size="sm" onClick={() => setActiveTab('arrival-forecast')}>
                  Full forecast <ChevronRight className="w-3.5 h-3.5" />
                </PillButton>
              }
            />
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={intakeBars} margin={{ top: 10, right: 8, left: -24, bottom: 0 }} barCategoryGap="28%">
                  <ChartDefs idPrefix="cc" />
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="time" {...axisProps} />
                  <YAxis {...axisProps} />
                  <Tooltip cursor={{ fill: 'rgba(17,17,17,0.04)' }} content={<ChartTooltip unit=" pts" />} />
                  <ReferenceLine
                    y={availableBeds}
                    stroke={chartColors.threshold}
                    strokeDasharray="4 4"
                    label={{ value: 'Capacity', position: 'insideTopRight', fontSize: 10, fill: chartColors.threshold }}
                  />
                  <Bar dataKey="arrivals" name="Arrivals" radius={[8, 8, 8, 8]}>
                    {intakeBars.map((d) => (
                      <Cell key={d.time} fill={d.isForecast ? 'url(#cc-hatch)' : chartColors.ink} stroke={d.isForecast ? chartColors.violet : 'none'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3">
              <ChartLegend
                items={[
                  { label: 'Observed', color: chartColors.ink },
                  { label: 'Forecast', hatch: true },
                  { label: 'Bed capacity', color: chartColors.threshold, dashed: true },
                ]}
              />
            </div>
          </Card>

          <CorrelationStrip
            title="Flow drag"
            items={[
              { icon: <Clock className="w-3.5 h-3.5" />, label: 'Avg wait', value: avgWaitTimeMinutes, unit: 'min' },
              {
                icon: <Layers className="w-3.5 h-3.5" />,
                label: 'Discharge delay',
                value: blockedDischargesCount,
                unit: 'blocked',
                hint: `${patientsAwaitingDischarge} awaiting`,
              },
              { icon: <Scan className="w-3.5 h-3.5" />, label: 'Diagnostic backlog', value: diagnosticBacklog, unit: 'studies' },
            ]}
          />
        </div>

        {/* Right: department cards + priority panel */}
        <div className="space-y-6 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {deptCards.map(({ dept, percent, detail, tone, kind }) => (
              <DepartmentCard
                key={dept.id}
                icon={deptIcons[dept.id]}
                name={dept.shortName}
                subtitle={`${dept.avgWaitMinutes}m wait · target ${dept.targetWaitMinutes}m`}
                percent={percent}
                detail={detail}
                tone={tone}
                actions={
                  kind === 'inpatient'
                    ? [
                        { label: 'Manage beds', onClick: () => setActiveTab('bed-management') },
                        { label: 'Patient flow', onClick: () => setActiveTab('patient-flow') },
                      ]
                    : [{ label: 'Diagnostic operations', onClick: () => setActiveTab('diagnostics') }]
                }
              />
            ))}
          </div>

          <Card>
            <CardHeader
              title="Operational priorities"
              subtitle="Issues blocking flow right now"
              icon={<AlertTriangle className="w-4 h-4" />}
              action={<Badge tone="critical">Action required</Badge>}
            />
            <div className="divide-y divide-line">
              {[
                {
                  title: 'ED inpatient boarding crisis',
                  tone: 'critical' as Tone,
                  tag: 'Critical',
                  body: '4 admitted patients waiting >90m for inpatient beds. Jonathan Brooks (Troponin+) holding for 109m awaiting Cardiology.',
                  meta: 'Trigger: Med/Card beds at capacity',
                  cta: 'Resolve in Autopilot',
                  tab: 'autopilot' as NavTabId,
                },
                {
                  title: 'Discharge blocked: Pharmacy',
                  tone: 'warning' as Tone,
                  tag: 'Delayed',
                  body: 'Marcus Thorne (Bed MED-101) cleared by Dr. Finch 55m ago. Inhaler med-reconciliation pending in dispensary.',
                  meta: 'Unblocks: Bed MED-101 for ED transfer',
                  cta: 'View discharge task',
                  tab: 'discharge' as NavTabId,
                },
                {
                  title: 'UHC insurance query unanswered',
                  tone: 'warning' as Tone,
                  tag: 'Query',
                  body: 'David Chen (Bed CARD-401) cannot settle final bill. UnitedHealthcare requires Day 3 telemetry necessity addendum.',
                  meta: 'Unblocks: $20,370 claim clearance',
                  cta: 'Open insurance',
                  tab: 'insurance' as NavTabId,
                },
              ].map((issue) => (
                <div key={issue.title} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-ink">{issue.title}</span>
                    <Badge tone={issue.tone}>{issue.tag}</Badge>
                  </div>
                  <p className="text-[11px] text-ink-2 mt-1 leading-relaxed">{issue.body}</p>
                  <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-ink-3">{issue.meta}</span>
                    <button
                      onClick={() => setActiveTab(issue.tab)}
                      className="inline-flex items-center gap-0.5 font-semibold text-ink hover:underline cursor-pointer whitespace-nowrap"
                    >
                      {issue.cta} <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
