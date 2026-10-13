import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import {
  Badge,
  HeroCard,
  PageHeader,
  PillButton,
  ProgressBar,
} from '../components/ui';
import { DiagnosticOrder, DiagnosticEquipment } from '../types/hospital';

export const DiagnosticOperationsView: React.FC = () => {
  const { diagnosticEquipment, diagnosticOrders, departments } = useHospital();
  const [equipmentList, setEquipmentList] = useState<DiagnosticEquipment[]>(diagnosticEquipment);
  const [ordersList, setOrdersList] = useState<DiagnosticOrder[]>(diagnosticOrders);
  const [notification, setNotification] = useState<string | null>(null);

  const totalQueue = equipmentList.reduce((s, e) => s + e.queueLength, 0);
  const avgTurnaround = Math.round(
    equipmentList.reduce((s, e) => s + e.avgTurnaroundMinutes, 0) / Math.max(1, equipmentList.length)
  );
  const urgentOpen = ordersList.filter((o) => o.isUrgent && o.status !== 'completed').length;

  // Rebalance workload action
  const handleRebalanceCT = () => {
    setEquipmentList((prev) =>
      prev.map((eq) => {
        if (eq.id === 'RAD-CT-01') {
          return { ...eq, queueLength: 3, avgTurnaroundMinutes: 30 };
        }
        if (eq.id === 'RAD-CT-02') {
          return { ...eq, queueLength: 5, avgTurnaroundMinutes: 32 };
        }
        return eq;
      })
    );

    setNotification('Workload rebalanced! Shifted 3 routine head/chest CT studies from CT-01 to CT-02. Urgent trauma backlog cleared.');
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Clinical Diagnostics & Throughput"
        title="Diagnostics"
        description="Monitors high-demand modalities (CT scanners, 3T MRI, automated chemistry analyzers). Prevents acute emergency clinical bottlenecks through automated workload rebalancing."
        actions={
          <>
            <PillButton variant="dark" icon={<Sparkles className="w-3.5 h-3.5" />} onClick={handleRebalanceCT}>
              Rebalance CT-01 / CT-02
            </PillButton>
          </>
        }
      />

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600 text-xs">
            Dismiss
          </button>
        </div>
      )}

      <HeroCard
        eyebrow="Diagnostic backlog"
        value={totalQueue}
        unit="studies queued"
        caption={`${equipmentList.length} modalities monitored · ${urgentOpen} urgent studies still open.`}
        status={<Badge tone={totalQueue > 15 ? 'warning' : 'ok'} className="!bg-white/10 !border-white/10 !text-white">{avgTurnaround}m avg turnaround</Badge>}
        data={equipmentList.map((e) => ({ id: e.id, queue: e.queueLength }))}
        xKey="id"
        yKey="queue"
        yLabel="Queue"
        footer={
          <div className="flex items-center justify-between">
            <span>Queue length by modality</span>
            <span className="text-white font-semibold">{equipmentList.filter((e) => e.status === 'busy').length} busy</span>
          </div>
        }
      />

      {/* Equipment Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipmentList.map((eq) => {
          const isBusy = eq.status === 'busy';
          const isHighQueue = eq.queueLength >= 5;

          return (
            <div
              key={eq.id}
              className="bg-card border border-line rounded-2xl p-4 space-y-3 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-900">{eq.id}</span>
                  <div className="text-xs font-semibold text-slate-800 mt-0.5">{eq.name}</div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                    eq.status === 'busy'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {eq.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                <div>
                  <div className="text-slate-500 text-[11px]">Current Queue</div>
                  <div className="font-bold text-slate-900 font-mono tabular-nums text-sm">
                    {eq.queueLength} orders
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Avg Turnaround</div>
                  <div className={`font-bold font-mono tabular-nums text-sm ${eq.avgTurnaroundMinutes > 35 ? 'text-amber-700' : 'text-slate-900'}`}>
                    {eq.avgTurnaroundMinutes} mins
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                <span>Completed Today: {eq.currentCompletedToday}/{eq.dailyCapacity}</span>
                <span className="font-medium text-slate-700">
                  {Math.round((eq.currentCompletedToday / eq.dailyCapacity) * 100)}% Capacity
                </span>
              </div>
              <ProgressBar value={(eq.currentCompletedToday / eq.dailyCapacity) * 100} label={`${eq.name} capacity`} />
            </div>
          );
        })}
      </div>

      {/* Live Diagnostic Orders Table */}
      <div className="bg-card border border-line rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-line flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Active Urgent Diagnostic Study Queue ({ordersList.length} Studies)
          </h3>
          <span className="text-xs text-slate-500">Prioritizes emergency resuscitation and trauma imaging</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-line">
              <tr>
                <th className="py-2.5 px-4">Order ID</th>
                <th className="py-2.5 px-4">Patient Name</th>
                <th className="py-2.5 px-4">Requested Study</th>
                <th className="py-2.5 px-4">Assigned Scanner</th>
                <th className="py-2.5 px-4">Urgency</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ordersList.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-800">{ord.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{ord.patientName}</td>
                  <td className="py-3 px-4 text-slate-800 font-medium">{ord.testName}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{ord.equipmentId}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                        ord.isUrgent ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {ord.isUrgent ? 'STAT / Trauma' : 'Routine'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                        ord.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ord.status === 'in_progress'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {ord.status !== 'completed' && (
                      <button
                        onClick={() => {
                          setOrdersList((prev) =>
                            prev.map((o) => (o.id === ord.id ? { ...o, status: 'completed', completedAt: new Date().toISOString() } : o))
                          );
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-full cursor-pointer shadow-2xs"
                      >
                        Complete Scan
                      </button>
                    )}
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
