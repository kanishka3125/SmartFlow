import React, { useState } from 'react';
import {
  Building2,
  Users,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import {
  Badge,
  DepartmentCard,
  HeroCard,
  PageHeader,
  ProgressBar,
} from '../components/ui';

export const ResourceUtilizationView: React.FC = () => {
  const { departments, staffMembers, diagnosticEquipment, beds, role } = useHospital();
  const [rebalanceApproved, setRebalanceApproved] = useState(false);

  // Group staff by department
  const staffByDept = departments.map((d) => {
    const activeStaff = staffMembers.filter((s) => s.departmentId === d.id);
    return {
      department: d.name,
      id: d.id,
      head: d.head,
      staffCount: d.activeStaff,
      shiftList: activeStaff,
    };
  });

  const equipmentUtil = diagnosticEquipment.map((eq) => ({
    id: eq.id,
    util: Math.min(100, Math.round((eq.currentCompletedToday / eq.dailyCapacity) * 100)),
  }));
  const avgEquipmentUtil = Math.round(
    equipmentUtil.reduce((s, e) => s + e.util, 0) / Math.max(1, equipmentUtil.length)
  );
  const busyEquipment = diagnosticEquipment.filter((e) => e.status === 'busy').length;
  const totalEquipmentQueue = diagnosticEquipment.reduce((s, e) => s + e.queueLength, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workforce & Asset Optimization"
        title="Resources"
        description="Identifies imbalances between patient demand and active staff/equipment capacity. Recommends qualified cross-coverage reallocations with human supervisory sign-off."
        actions={
          <>
            <Badge tone="ok">Supervisor approval required</Badge>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HeroCard
          eyebrow="Diagnostic equipment utilization"
          value={avgEquipmentUtil}
          unit="%"
          caption={`${diagnosticEquipment.length} monitored devices · ${staffMembers.filter((s) => s.isAvailable).length} of ${staffMembers.length} staff available.`}
          status={<Badge tone={avgEquipmentUtil > 80 ? 'warning' : 'ok'} className="!bg-white/10 !border-white/10 !text-white">{busyEquipment} busy</Badge>}
          data={equipmentUtil}
          xKey="id"
          yKey="util"
          yLabel="Daily capacity used %"
          footer={
            <div className="flex items-center justify-between">
              <span>Daily capacity used by device</span>
              <span className="text-white font-semibold tabular-nums">{totalEquipmentQueue} queued</span>
            </div>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
          {staffByDept
            .filter((d) => d.staffCount > 0)
            .slice(0, 4)
            .map((d) => {
              const onShift = d.shiftList.length;
              const available = d.shiftList.filter((s) => s.isAvailable).length;
              return (
                <DepartmentCard
                  key={d.id}
                  icon={<Users className="w-4 h-4" />}
                  name={d.department}
                  subtitle={`${d.staffCount} active staff`}
                  percent={onShift > 0 ? (available / onShift) * 100 : 0}
                  detail={`${available}/${onShift} available`}
                />
              );
            })}
        </div>
      </div>

      {/* Resource Balancing Recommendation Card */}
      <div className="bg-card border border-line rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge tone="warning">Pending review</Badge>
              <span className="text-xs text-slate-600 font-semibold">
                Central Inpatient Pharmacy & Float Nursing
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900">
              Reassign Outpatient Float Pharmacist to Floor Discharge Reconciliation
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              Central Dispensary discharge reconciliation duration currently averages 68 mins (target: 25 mins), delaying 3 inpatient bed releases.
              Outpatient Pharmacy volume is currently 35% below peak. Reallocating Pharmacist Aaliyah Washington creates immediate discharge throughput for General Medicine.
            </p>
          </div>

          <div className="shrink-0">
            {!rebalanceApproved ? (
              <button
                onClick={() => setRebalanceApproved(true)}
                className="px-4 py-2 bg-ink hover:bg-slate-800 text-white rounded-full text-xs font-semibold cursor-pointer shadow-xs whitespace-nowrap"
              >
                Approve Reallocation
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-xs font-bold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Reallocation Approved & Active</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Staff Coverage and Equipment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Department Staffing Coverage */}
        <div className="bg-card border border-line rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Staff Coverage & Roster Availability
              </h3>
            </div>
            <span className="text-xs text-slate-500">{staffMembers.length} Active On Shift</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {staffMembers.map((staff) => (
              <div key={staff.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{staff.name}</div>
                  <div className="text-[11px] text-slate-500 capitalize">
                    {staff.role.replace(/_/g, ' ')} · {staff.departmentId} · Ext: {staff.contactExt}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-600 font-medium">{staff.shift} Shift</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      staff.isAvailable ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    title={staff.isAvailable ? 'Available for tasks' : 'Assigned / Busy'}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Diagnostic Equipment Utilization */}
        <div className="bg-card border border-line rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Diagnostic Equipment Capacity & Uptime
              </h3>
            </div>
            <span className="text-xs text-slate-500">6 Monitored Devices</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {diagnosticEquipment.map((eq) => {
              const utilPercent = Math.min(100, Math.round((eq.currentCompletedToday / eq.dailyCapacity) * 100));

              return (
                <div key={eq.id} className="py-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900">{eq.name}</span>
                      <span className="ml-2 font-mono text-[11px] text-slate-500">({eq.id})</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase ${
                        eq.status === 'busy' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {eq.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Queue: {eq.queueLength} studies · Turnaround: {eq.avgTurnaroundMinutes}m</span>
                    <span className="font-mono font-medium text-slate-800">{utilPercent}% Daily Capacity</span>
                  </div>

                  <ProgressBar value={utilPercent} label={`${eq.name} utilization`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
