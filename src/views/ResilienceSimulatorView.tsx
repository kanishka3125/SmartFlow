import React, { useState } from 'react';
import {
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  ShieldAlert,
  ArrowRight,
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
  HeroCard,
  IconButton,
  PageHeader,
  PillButton,
  StatCard,
  axisProps,
  chartColors,
  gridProps,
} from '../components/ui';
import { SimulationParams, SimulationResult } from '../types/hospital';
import { runHospitalSimulation } from '../services/simulatorEngine';

export const ResilienceSimulatorView: React.FC = () => {
  const defaultParams: SimulationParams = {
    arrivalVolumeMultiplier: 1.0,
    availableBedsOffset: 0,
    staffAvailabilityPercent: 100,
    diagnosticUptimePercent: 100,
    dischargeEfficiencyMultiplier: 1.0,
    pharmacyDelayMinutes: 25,
    billingDelayMinutes: 20,
    insuranceQueryDelayMinutes: 30,
    cleaningDurationMinutes: 30,
  };

  const [params, setParams] = useState<SimulationParams>(defaultParams);
  const [simulationResult, setSimulationResult] = useState<SimulationResult>(
    runHospitalSimulation(defaultParams)
  );

  const handleRun = () => {
    const result = runHospitalSimulation(params);
    setSimulationResult(result);
  };

  const handleReset = () => {
    setParams(defaultParams);
    setSimulationResult(runHospitalSimulation(defaultParams));
  };

  // Presets
  const applyPreset = (presetName: string) => {
    let p = { ...defaultParams };
    if (presetName === 'surge') {
      p = {
        ...defaultParams,
        arrivalVolumeMultiplier: 1.45,
        diagnosticUptimePercent: 90,
      };
    } else if (presetName === 'radiology_outage') {
      p = {
        ...defaultParams,
        diagnosticUptimePercent: 60,
      };
    } else if (presetName === 'insurance_delay') {
      p = {
        ...defaultParams,
        insuranceQueryDelayMinutes: 90,
        billingDelayMinutes: 50,
      };
    } else if (presetName === 'staff_shortage') {
      p = {
        ...defaultParams,
        staffAvailabilityPercent: 70,
        cleaningDurationMinutes: 65,
      };
    } else if (presetName === 'discharge_accelerator') {
      p = {
        ...defaultParams,
        dischargeEfficiencyMultiplier: 1.6,
        pharmacyDelayMinutes: 10,
        billingDelayMinutes: 10,
        insuranceQueryDelayMinutes: 10,
        availableBedsOffset: 4,
      };
    }

    setParams(p);
    setSimulationResult(runHospitalSimulation(p));
  };

  const { baseline, scenario, comparisonNotes, departmentForecast } = simulationResult;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Resilience & Scenario Stress Testing"
        title="What-If Simulator"
        description="Stress-test emergency boarding risk, discharge velocity, and clinical equipment disruptions before they happen in practice. Simulations preserve historical baselines for transparent side-by-side comparison."
        actions={
          <>
            <PillButton variant="dark" icon={<Play className="w-3.5 h-3.5 fill-white" />} onClick={handleRun}>
              Run simulation
            </PillButton>
            <IconButton label="Reset baseline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </IconButton>
          </>
        }
      />

      {/* Preset Crisis Buttons */}
      <div>
        <div className="text-[11px] font-medium text-ink-3 uppercase tracking-wider mb-2">Stress scenarios</div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => applyPreset('surge')}
            className="px-4 py-2 bg-card hover:border-slate-300 border border-line rounded-full text-ink font-medium cursor-pointer"
          >
            Mass Casualty Surge Event (+45% arrivals)
          </button>
          <button
            onClick={() => applyPreset('radiology_outage')}
            className="px-4 py-2 bg-card hover:border-slate-300 border border-line rounded-full text-ink font-medium cursor-pointer"
          >
            CT Scanner Unscheduled Outage (60% uptime)
          </button>
          <button
            onClick={() => applyPreset('insurance_delay')}
            className="px-4 py-2 bg-card hover:border-slate-300 border border-line rounded-full text-ink font-medium cursor-pointer"
          >
            Insurer Pre-Auth Clearinghouse Latency (+90m)
          </button>
          <button
            onClick={() => applyPreset('staff_shortage')}
            className="px-4 py-2 bg-card hover:border-slate-300 border border-line rounded-full text-ink font-medium cursor-pointer"
          >
            Nursing & EVS Turnover Shortage (70% staffing)
          </button>
          <button
            onClick={() => applyPreset('discharge_accelerator')}
            className="px-4 py-2 accent-gradient text-ink rounded-full font-semibold cursor-pointer"
          >
            ★ SmartFlow Discharge Accelerator (+60% flow)
          </button>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Control Sliders */}
        <div className="bg-card border border-line rounded-2xl p-5 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-line">
            Scenario Operational Levers
          </h3>

          {/* Slider 1: Arrival Volume */}
          <div>
            <div className="flex justify-between font-semibold text-slate-800 mb-1">
              <span>Patient Intake Multiplier:</span>
              <span className="font-mono text-sky-800">{Math.round((params.arrivalVolumeMultiplier - 1) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={params.arrivalVolumeMultiplier}
              onChange={(e) => setParams({ ...params, arrivalVolumeMultiplier: parseFloat(e.target.value) })}
              className="w-full accent-sky-700 cursor-pointer"
            />
          </div>

          {/* Slider 2: Bed Offset */}
          <div>
            <div className="flex justify-between font-semibold text-slate-800 mb-1">
              <span>Active Bed Availability Offset:</span>
              <span className="font-mono text-sky-800">{params.availableBedsOffset > 0 ? `+${params.availableBedsOffset}` : params.availableBedsOffset} beds</span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={params.availableBedsOffset}
              onChange={(e) => setParams({ ...params, availableBedsOffset: parseInt(e.target.value) })}
              className="w-full accent-sky-700 cursor-pointer"
            />
          </div>

          {/* Slider 3: Staffing % */}
          <div>
            <div className="flex justify-between font-semibold text-slate-800 mb-1">
              <span>Floor Staffing Coverage:</span>
              <span className="font-mono text-sky-800">{params.staffAvailabilityPercent}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              step="5"
              value={params.staffAvailabilityPercent}
              onChange={(e) => setParams({ ...params, staffAvailabilityPercent: parseInt(e.target.value) })}
              className="w-full accent-sky-700 cursor-pointer"
            />
          </div>

          {/* Slider 4: Diagnostic Uptime */}
          <div>
            <div className="flex justify-between font-semibold text-slate-800 mb-1">
              <span>Radiology Equipment Uptime:</span>
              <span className="font-mono text-sky-800">{params.diagnosticUptimePercent}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={params.diagnosticUptimePercent}
              onChange={(e) => setParams({ ...params, diagnosticUptimePercent: parseInt(e.target.value) })}
              className="w-full accent-sky-700 cursor-pointer"
            />
          </div>

          {/* Slider 5: Discharge Efficiency */}
          <div>
            <div className="flex justify-between font-semibold text-slate-800 mb-1">
              <span>Discharge Flow Velocity:</span>
              <span className="font-mono text-sky-800">{params.dischargeEfficiencyMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={params.dischargeEfficiencyMultiplier}
              onChange={(e) => setParams({ ...params, dischargeEfficiencyMultiplier: parseFloat(e.target.value) })}
              className="w-full accent-sky-700 cursor-pointer"
            />
          </div>

          {/* Slider 6: Pharmacy Delay */}
          <div>
            <div className="flex justify-between font-semibold text-slate-800 mb-1">
              <span>Discharge Pharmacy Delay:</span>
              <span className="font-mono text-sky-800">{params.pharmacyDelayMinutes} mins</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={params.pharmacyDelayMinutes}
              onChange={(e) => setParams({ ...params, pharmacyDelayMinutes: parseInt(e.target.value) })}
              className="w-full accent-sky-700 cursor-pointer"
            />
          </div>

          {/* Slider 7: Insurance Latency */}
          <div>
            <div className="flex justify-between font-semibold text-slate-800 mb-1">
              <span>Insurance Query Latency:</span>
              <span className="font-mono text-sky-800">{params.insuranceQueryDelayMinutes} mins</span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              step="10"
              value={params.insuranceQueryDelayMinutes}
              onChange={(e) => setParams({ ...params, insuranceQueryDelayMinutes: parseInt(e.target.value) })}
              className="w-full accent-sky-700 cursor-pointer"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleRun}
              className="w-full py-2.5 bg-ink hover:bg-slate-800 text-white rounded-full text-xs font-semibold cursor-pointer"
            >
              Recalculate Scenario Model
            </button>
          </div>
        </div>

        {/* Right (2 spans): Dual Comparative Results & Department Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Comparative Metric Cards */}
          <HeroCard
            eyebrow="Scenario bed occupancy"
            value={scenario.bedOccupancyRate}
            unit="%"
            caption={`Baseline ${baseline.bedOccupancyRate}% · ${scenario.bedOccupancyRate > 90 ? 'critical capacity' : 'nominal band'} under this scenario.`}
            status={
              <Badge tone={scenario.bedOccupancyRate > 90 ? 'critical' : 'ok'} className="!bg-white/10 !border-white/10 !text-white">
                {scenario.bedOccupancyRate > 90 ? 'Critical' : 'Nominal'}
              </Badge>
            }
            data={departmentForecast}
            xKey="department"
            yKey="scenarioWait"
            yLabel="Scenario wait (min)"
            footer={
              <div className="flex items-center justify-between">
                <span>Scenario wait by department</span>
                <span className="text-white font-semibold tabular-nums">{scenario.edBoardingCount} boarding</span>
              </div>
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard
              label="Avg admission wait"
              value={scenario.avgWaitMinutes}
              unit="min"
              delta={{
                value: `${Math.abs(scenario.avgWaitMinutes - baseline.avgWaitMinutes)}m`,
                direction: scenario.avgWaitMinutes > baseline.avgWaitMinutes ? 'up' : 'down',
                good: scenario.avgWaitMinutes <= baseline.avgWaitMinutes,
              }}
              footer={`${baseline.avgWaitMinutes}m baseline`}
            />
            <StatCard
              label="ED boarding"
              value={scenario.edBoardingCount}
              unit="patients"
              delta={{
                value: Math.abs(scenario.edBoardingCount - baseline.edBoardingCount),
                direction: scenario.edBoardingCount > baseline.edBoardingCount ? 'up' : 'down',
                good: scenario.edBoardingCount <= baseline.edBoardingCount,
              }}
              footer={`${baseline.edBoardingCount} baseline`}
            />
            <StatCard
              label="Diagnostic backlog"
              value={scenario.diagnosticBacklogCount}
              unit="studies"
              delta={{
                value: Math.abs(scenario.diagnosticBacklogCount - baseline.diagnosticBacklogCount),
                direction: scenario.diagnosticBacklogCount > baseline.diagnosticBacklogCount ? 'up' : 'down',
                good: scenario.diagnosticBacklogCount <= baseline.diagnosticBacklogCount,
              }}
              footer={`Turnaround: ${params.diagnosticUptimePercent < 80 ? 'delayed' : 'nominal'}`}
            />
          </div>

          {/* Department Comparison Chart */}
          <Card>
            <CardHeader
              title="Department wait · baseline vs scenario"
              subtitle="Estimated admission and intake wait across acute services (minutes)"
            />
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentForecast} margin={{ top: 10, right: 8, left: -24, bottom: 0 }} barGap={4} barCategoryGap="24%">
                  <ChartDefs idPrefix="sim" />
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="department" {...axisProps} tick={{ fontSize: 10, fill: chartColors.axis }} />
                  <YAxis unit="m" {...axisProps} />
                  <Tooltip cursor={{ fill: 'rgba(17,17,17,0.04)' }} content={<ChartTooltip unit="m" />} />
                  <Bar dataKey="baselineWait" name="Baseline" fill={chartColors.ink} radius={[8, 8, 8, 8]} />
                  <Bar dataKey="scenarioWait" name="Scenario" fill="url(#sim-violet)" radius={[8, 8, 8, 8]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3">
              <ChartLegend
                items={[
                  { label: 'Baseline', color: chartColors.ink },
                  { label: 'Scenario', color: chartColors.violet },
                ]}
              />
            </div>
          </Card>

          {/* Operational Impact Analysis Callout */}
          <div className="bg-card border border-line rounded-2xl p-5 text-xs space-y-2 shadow-2xs">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Simulator Deductions & Insights:
            </div>
            <ul className="space-y-1 text-slate-700 list-disc pl-5 leading-relaxed">
              {comparisonNotes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
