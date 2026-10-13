import React, { useState } from 'react';
import {
  BellRing,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Filter,
  Check,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import {
  Badge,
  Card,
  CardHeader,
  HeroCard,
  PageHeader,
  Tabs,
} from '../components/ui';

export const AlertsTasksView: React.FC = () => {
  const { operationalAlerts, acknowledgeAlert, resolveAlert, role } = useHospital();
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const activeCount = operationalAlerts.filter((a) => a.status === 'active').length;
  const severityCounts = (['critical', 'warning', 'info'] as const).map((sev) => ({
    sev,
    count: operationalAlerts.filter((a) => a.severity === sev && a.status !== 'resolved').length,
  }));

  const filteredAlerts = operationalAlerts.filter((a) => {
    const matchesSev = severityFilter === 'all' || a.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSev && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations Dispatch & Incident Response"
        title="Alerts & Tasks"
        description="Consolidated operational alerts generated across bed management, diagnostic imaging, and discharge workflows. Includes triggering measurements, responsible clinical teams, and audit trail."
        actions={
          <>
            <Badge tone="critical">{activeCount} unresolved</Badge>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HeroCard
          eyebrow="Open operational alerts"
          value={activeCount}
          unit="active"
          caption="Alerts raised across bed management, diagnostic imaging and discharge workflows."
          status={<Badge tone={activeCount > 0 ? 'critical' : 'ok'} className="!bg-white/10 !border-white/10 !text-white">{operationalAlerts.length} total</Badge>}
        >
          <div className="grid grid-cols-3 gap-3 mt-6">
            {severityCounts.map(({ sev, count }) => (
              <div key={sev} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-[11px] text-white/60 capitalize">{sev}</div>
                <div className="text-2xl font-semibold tabular-nums mt-1">{count}</div>
              </div>
            ))}
          </div>
        </HeroCard>
        <Card className="flex flex-col justify-between gap-4">
          <CardHeader title="Filter queue" subtitle="Narrow by severity and workflow status" />
          <div className="space-y-3">
            <Tabs
              size="sm"
              value={severityFilter}
              onChange={setSeverityFilter}
              items={[
                { id: 'all', label: 'All severities' },
                { id: 'critical', label: 'Critical' },
                { id: 'warning', label: 'Warning' },
                { id: 'info', label: 'Info' },
              ]}
            />
            <Tabs
              size="sm"
              value={statusFilter}
              onChange={setStatusFilter}
              items={[
                { id: 'all', label: 'All statuses' },
                { id: 'active', label: 'Active' },
                { id: 'acknowledged', label: 'Acknowledged' },
                { id: 'resolved', label: 'Resolved' },
              ]}
            />
          </div>
          <div className="text-[11px] text-ink-3">
            Audited under role: <strong className="text-ink uppercase">{role}</strong>
          </div>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'critical';
          const isWarning = alert.severity === 'warning';
          const isActive = alert.status === 'active';
          const isAcknowledged = alert.status === 'acknowledged';
          const isResolved = alert.status === 'resolved';

          return (
            <div
              key={alert.id}
              className={`bg-card border border-line rounded-2xl p-5 shadow-2xs transition-all ${isResolved ? 'opacity-70' : ''}`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                        isCritical
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : isWarning
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-sky-50 text-sky-700 border border-sky-200'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="font-mono text-slate-400">{alert.id}</span>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <span className="font-semibold text-slate-700">{alert.departmentId}</span>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <span className="text-slate-400 font-mono">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className={`text-sm font-bold text-slate-900 ${isResolved ? 'line-through text-slate-500' : ''}`}>
                    {alert.title}
                  </h3>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md font-mono text-[11px] text-slate-800">
                    <span className="text-slate-500 font-sans font-semibold">Trigger: </span>
                    {alert.measurements}
                  </div>

                  <div className="text-slate-600 leading-relaxed pt-1">
                    <strong>Cause: </strong>{alert.probableCause}
                  </div>

                  <div className="text-slate-600">
                    <strong>Downstream Impact: </strong>{alert.downstreamImpact}
                  </div>

                  <div className="text-slate-800 font-medium">
                    <strong>Recommended Action: </strong>{alert.recommendedAction}
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 flex flex-wrap items-center gap-4">
                    <span>Responsible Team: <strong>{alert.responsibleTeam}</strong></span>
                    {alert.acknowledgedBy && (
                      <span>Acknowledged By: <strong>{alert.acknowledgedBy}</strong></span>
                    )}
                    {alert.resolvedAt && (
                      <span className="text-emerald-700 font-medium">
                        Resolved: {new Date(alert.resolvedAt).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status & Action Buttons */}
                <div className="flex md:flex-col items-end justify-between md:justify-start gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                      isResolved
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isAcknowledged
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {alert.status}
                  </span>

                  {!isResolved && (
                    <div className="flex md:flex-col gap-1.5 pt-2">
                      {isActive && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-3 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-full text-slate-700 text-xs font-medium cursor-pointer whitespace-nowrap"
                        >
                          Acknowledge
                        </button>
                      )}
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap"
                      >
                        Resolve Alert
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
