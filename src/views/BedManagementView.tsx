import React, { useState } from 'react';
import {
  BedDouble,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Brush,
  X,
  Check,
  Plus,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import {
  Badge,
  DepartmentCard,
  HeroCard,
  IconButton,
  PageHeader,
  PillButton,
  PillSelect,
  StatusDot,
  Tabs,
} from '../components/ui';
import { Bed, BedStatus, BedType, EquipmentTag } from '../types/hospital';
import { recommendBedsForPatient, BedAllocationRecommendation } from '../services/bedAllocation';

export const BedManagementView: React.FC = () => {
  const {
    beds,
    departments,
    queueItems,
    allocateBed,
    updateBedStatus,
    startBedCleaning,
    completeBedCleaning,
    setSelectedPatientId,
    role,
    totalBeds,
    occupiedBeds,
    availableBeds,
    cleaningBeds,
    reservedBeds,
    occupancyRate,
  } = useHospital();

  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Allocation Modal State
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [selectedQueueItemId, setSelectedQueueItemId] = useState<string>('');
  const [requiredEquipment, setRequiredEquipment] = useState<EquipmentTag[]>([]);
  const [requiresIsolation, setRequiresIsolation] = useState(false);
  const [recommendations, setRecommendations] = useState<BedAllocationRecommendation[]>([]);

  // Per-ward occupancy from the live bed ledger
  const wardOccupancy = departments
    .filter((d) => beds.some((b) => b.departmentId === d.id))
    .map((d) => {
      const wardBeds = beds.filter((b) => b.departmentId === d.id);
      const inUse = wardBeds.filter((b) => ['occupied', 'reserved', 'discharge_pending'].includes(b.status)).length;
      return {
        id: d.id as string,
        ward: d.shortName,
        total: wardBeds.length,
        inUse,
        available: wardBeds.filter((b) => b.status === 'available').length,
        turnover: wardBeds.filter((b) => b.status === 'awaiting_cleaning' || b.status === 'cleaning_in_progress').length,
        occupancy: Math.round((inUse / wardBeds.length) * 100),
      };
    });

  // Filtered beds
  const filteredBeds = beds.filter((b) => {
    const matchesDept = deptFilter === 'all' || b.departmentId === deptFilter;
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesType = typeFilter === 'all' || b.type === typeFilter;
    return matchesDept && matchesStatus && matchesType;
  });

  // Open Allocation Engine
  const openAllocationEngine = (defaultQueueId?: string) => {
    const targetQueueId = defaultQueueId || queueItems.find((q) => q.status === 'admission_pending')?.id || queueItems[0]?.id || '';
    setSelectedQueueItemId(targetQueueId);

    const queueItem = queueItems.find((q) => q.id === targetQueueId);
    if (queueItem) {
      // Auto-detect needed equipment from complaint
      let eq: EquipmentTag[] = [];
      if (queueItem.chiefComplaint.toLowerCase().includes('telemetry') || queueItem.chiefComplaint.toLowerCase().includes('troponin') || queueItem.chiefComplaint.toLowerCase().includes('chest')) {
        eq = ['telemetry'];
      } else if (queueItem.chiefComplaint.toLowerCase().includes('hypox') || queueItem.chiefComplaint.toLowerCase().includes('copd')) {
        eq = ['oxygen_high_flow'];
      }
      setRequiredEquipment(eq);
      setRequiresIsolation(queueItem.chiefComplaint.toLowerCase().includes('isolation'));

      const recs = recommendBedsForPatient(queueItem, beds, eq, false);
      setRecommendations(recs);
    }

    setIsAllocationModalOpen(true);
  };

  const handleQueueChange = (queueId: string) => {
    setSelectedQueueItemId(queueId);
    const queueItem = queueItems.find((q) => q.id === queueId);
    if (queueItem) {
      let eq: EquipmentTag[] = [];
      if (queueItem.chiefComplaint.toLowerCase().includes('telemetry') || queueItem.chiefComplaint.toLowerCase().includes('troponin') || queueItem.chiefComplaint.toLowerCase().includes('chest')) {
        eq = ['telemetry'];
      }
      setRequiredEquipment(eq);
      const recs = recommendBedsForPatient(queueItem, beds, eq, requiresIsolation);
      setRecommendations(recs);
    }
  };

  const handleEquipmentToggle = (tag: EquipmentTag) => {
    const updated = requiredEquipment.includes(tag)
      ? requiredEquipment.filter((t) => t !== tag)
      : [...requiredEquipment, tag];
    setRequiredEquipment(updated);
    const queueItem = queueItems.find((q) => q.id === selectedQueueItemId);
    if (queueItem) {
      setRecommendations(recommendBedsForPatient(queueItem, beds, updated, requiresIsolation));
    }
  };

  const handleIsolationToggle = (val: boolean) => {
    setRequiresIsolation(val);
    const queueItem = queueItems.find((q) => q.id === selectedQueueItemId);
    if (queueItem) {
      setRecommendations(recommendBedsForPatient(queueItem, beds, requiredEquipment, val));
    }
  };

  const handleConfirmAllocation = (bedId: string) => {
    const success = allocateBed(selectedQueueItemId, bedId);
    if (success) {
      setIsAllocationModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inpatient Capacity & Wards"
        title="Bed Management"
        description="Real-time ward telemetry, clinical equipment compatibility verification, and closed-loop bed turnover orchestration."
        actions={
          <>
            <PillSelect
              value={deptFilter}
              onChange={setDeptFilter}
              label="Ward"
              options={[
                { value: 'all', label: 'All departments' },
                ...departments.filter((d) => d.totalBeds > 0).map((d) => ({ value: d.id as string, label: d.name })),
              ]}
            />
            <PillButton variant="dark" icon={<Sparkles className="w-3.5 h-3.5" />} onClick={() => openAllocationEngine()}>
              Recommend & allocate
            </PillButton>
            <IconButton label="Recommend & allocate a bed" variant="accent" onClick={() => openAllocationEngine()}>
              <Plus className="w-5 h-5" />
            </IconButton>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HeroCard
          eyebrow="Inpatient bed occupancy"
          value={occupancyRate}
          unit="%"
          caption={`${occupiedBeds} occupied and ${reservedBeds} reserved or discharging across ${totalBeds} beds.`}
          status={
            <Badge tone={occupancyRate > 85 ? 'critical' : 'ok'} className="!bg-white/10 !border-white/10 !text-white">
              {availableBeds} free
            </Badge>
          }
          data={wardOccupancy}
          xKey="ward"
          yKey="occupancy"
          yLabel="Ward occupancy %"
          footer={
            <div className="flex items-center justify-between">
              <span>Occupancy by ward</span>
              <span className="text-white font-semibold tabular-nums">{cleaningBeds} in turnover</span>
            </div>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
          {wardOccupancy.map((w) => (
            <DepartmentCard
              key={w.id}
              icon={<BedDouble className="w-4 h-4" />}
              name={w.ward}
              subtitle={`${w.available} available · ${w.turnover} turnover`}
              percent={w.occupancy}
              detail={`${w.inUse}/${w.total} beds`}
              tone={w.occupancy >= 90 ? 'critical' : w.occupancy >= 80 ? 'warning' : 'ok'}
              actions={[{ label: 'Show only this ward', onClick: () => setDeptFilter(w.id) }]}
            />
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Tabs
            size="sm"
            value={statusFilter}
            onChange={setStatusFilter}
            items={[
              { id: 'all', label: 'All statuses' },
              { id: 'available', label: 'Available' },
              { id: 'occupied', label: 'Occupied' },
              { id: 'discharge_pending', label: 'Discharge pending' },
              { id: 'awaiting_cleaning', label: 'Awaiting cleaning' },
              { id: 'cleaning_in_progress', label: 'Cleaning' },
              { id: 'reserved', label: 'Reserved' },
            ]}
          />
          <PillSelect
            variant="light"
            value={typeFilter}
            onChange={setTypeFilter}
            label="Type"
            options={[
              { value: 'all', label: 'All bed types' },
              { value: 'general', label: 'General' },
              { value: 'icu', label: 'ICU' },
              { value: 'stepdown', label: 'Stepdown' },
              { value: 'isolation_negative_pressure', label: 'Negative pressure isolation' },
              { value: 'post_op', label: 'Post-op' },
            ]}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-ink-2">
          <span className="flex items-center gap-1.5"><StatusDot tone="ok" />Available</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-ink inline-block" />Occupied</span>
          <span className="flex items-center gap-1.5"><StatusDot tone="warning" />Discharge pending</span>
          <span className="flex items-center gap-1.5"><StatusDot tone="info" />Cleaning turnover</span>
        </div>
      </div>

      {/* Ward & Bed Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {filteredBeds.map((bed) => {
          const isAvailable = bed.status === 'available';
          const isOccupied = bed.status === 'occupied';
          const isDischargePending = bed.status === 'discharge_pending';
          const isAwaitingCleaning = bed.status === 'awaiting_cleaning';
          const isCleaningInProgress = bed.status === 'cleaning_in_progress';
          const isReserved = bed.status === 'reserved';

          return (
            <div
              key={bed.id}
              className="bg-card border border-line hover:border-slate-300 rounded-2xl p-4 flex flex-col justify-between transition-colors shadow-2xs"
            >
              <div>
                {/* Bed ID & Status Indicator */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-xs font-mono">{bed.id}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isAvailable
                        ? 'bg-emerald-500'
                        : isOccupied
                        ? 'bg-ink'
                        : isDischargePending
                        ? 'bg-amber-500'
                        : isCleaningInProgress
                        ? 'bg-accent'
                        : isAwaitingCleaning
                        ? 'bg-accent-pink'
                        : 'bg-slate-300'
                    }`}
                  />
                </div>

                <div className="text-[11px] text-slate-500">
                  {bed.ward} · Room {bed.roomNumber} ({bed.bedLabel})
                </div>

                {/* Bed Type & Isolation Badge */}
                <div className="mt-2 text-[10px] text-slate-600 font-medium">
                  <span className="capitalize">{bed.type.replace(/_/g, ' ')}</span>
                  {bed.isolation && (
                    <span className="ml-1 text-sky-800 font-semibold bg-sky-50 px-1.5 py-px rounded-full border border-sky-200">
                      ISO
                    </span>
                  )}
                </div>

                {/* Equipment */}
                <div className="mt-1 text-[10px] text-slate-500">
                  {bed.equipment.length > 0 && bed.equipment[0] !== 'none' ? (
                    <span className="text-sky-800 font-medium">{bed.equipment.join(', ')}</span>
                  ) : (
                    <span>Standard Monitoring</span>
                  )}
                </div>

                {/* Occupant or State Detail */}
                <div className="mt-2 pt-2 border-t border-slate-100 text-[11px]">
                  {bed.currentPatientId ? (
                    <button
                      onClick={() => setSelectedPatientId(bed.currentPatientId!)}
                      className="text-slate-900 font-semibold hover:text-sky-800 hover:underline cursor-pointer truncate block w-full text-left"
                    >
                      Patient: {bed.currentPatientId}
                    </button>
                  ) : isAwaitingCleaning ? (
                    <span className="text-orange-700 font-medium">Awaiting EVS Turnover</span>
                  ) : isCleaningInProgress ? (
                    <span className="text-sky-700 font-medium">
                      EVS: {bed.assignedCleaner || 'Active Clean'}
                    </span>
                  ) : isAvailable ? (
                    <span className="text-emerald-700 font-medium">Ready For Allocation</span>
                  ) : (
                    <span className="text-slate-500 capitalize">{bed.status.replace(/_/g, ' ')}</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                {isAwaitingCleaning && (
                  <button
                    onClick={() => startBedCleaning(bed.id, 'EVS Specialist ' + (role === 'admin' ? 'Admin Dispatched' : 'Staff'))}
                    className="w-full text-center text-[11px] font-semibold bg-ink hover:bg-slate-800 text-white py-1.5 rounded-full cursor-pointer"
                  >
                    Dispatch EVS
                  </button>
                )}

                {isCleaningInProgress && (
                  <button
                    onClick={() => completeBedCleaning(bed.id)}
                    className="w-full text-center text-[11px] font-semibold bg-ink hover:bg-slate-800 text-white py-1.5 rounded-full cursor-pointer"
                  >
                    Verify Ready
                  </button>
                )}

                {isAvailable && (
                  <button
                    onClick={() => openAllocationEngine()}
                    className="w-full text-center text-[11px] font-semibold bg-ink hover:bg-slate-800 text-white py-1.5 rounded-full cursor-pointer"
                  >
                    Assign
                  </button>
                )}

                {isOccupied && (
                  <span className="text-[10px] text-slate-400 italic w-full text-center">
                    In Service
                  </span>
                )}

                {isDischargePending && (
                  <span className="text-[10px] text-amber-700 font-semibold w-full text-center">
                    Discharge Pending
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bed Allocation Recommendation Modal */}
      {isAllocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-xs p-4">
          <div className="bg-card rounded-2xl shadow-2xl border border-line w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full accent-gradient flex items-center justify-center text-ink shrink-0">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Smart Bed Allocation Recommendation Engine
                  </h3>
                  <div className="text-[11px] text-slate-500">
                    Matches patients against available beds, clinical equipment, isolation rules & ward compatibility
                  </div>
                </div>
              </div>
              <IconButton label="Close" size="sm" onClick={() => setIsAllocationModalOpen(false)}>
                <X className="w-4 h-4" />
              </IconButton>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Patient Selection */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Select Waiting Patient to Place:
                </label>
                <select
                  value={selectedQueueItemId}
                  onChange={(e) => handleQueueChange(e.target.value)}
                  className="w-full border border-slate-200 rounded-md p-2 bg-white text-slate-800 font-medium"
                >
                  {queueItems.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.patientName} ({q.age}y {q.gender}) — {q.chiefComplaint} [{q.departmentId} · {q.waitingMinutes}m wait]
                    </option>
                  ))}
                </select>
              </div>

              {/* Required Equipment Checklist */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  Clinical Equipment & Isolation Requirements:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { tag: 'telemetry' as EquipmentTag, label: 'Telemetry Monitoring' },
                    { tag: 'oxygen_high_flow' as EquipmentTag, label: 'High-Flow Oxygen' },
                    { tag: 'ventilator' as EquipmentTag, label: 'Mechanical Ventilator' },
                    { tag: 'bipap' as EquipmentTag, label: 'BiPAP / NIV' },
                  ].map((item) => (
                    <button
                      key={item.tag}
                      onClick={() => handleEquipmentToggle(item.tag)}
                      className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                        requiredEquipment.includes(item.tag)
                          ? 'bg-sky-50 border-sky-300 text-sky-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {requiredEquipment.includes(item.tag) ? '✓ ' : '+ '}
                      {item.label}
                    </button>
                  ))}

                  <button
                    onClick={() => handleIsolationToggle(!requiresIsolation)}
                    className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                      requiresIsolation
                        ? 'bg-purple-50 border-purple-300 text-purple-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {requiresIsolation ? '✓ ' : '+ '}
                    Negative Pressure Isolation
                  </button>
                </div>
              </div>

              {/* Recommendation Results */}
              <div className="space-y-3 pt-2">
                <div className="font-semibold text-slate-900 text-xs flex items-center justify-between">
                  <span>Ranked Bed Options ({recommendations.length} Candidate Beds):</span>
                  <span className="text-slate-400 font-normal">Ranked by compatibility score</span>
                </div>

                {recommendations.length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-center text-slate-500">
                    No available beds currently match these exact requirements. Expediting pending discharges or bed turnover is required.
                  </div>
                ) : (
                  recommendations.map((rec) => (
                    <div
                      key={rec.bed.id}
                      className="p-4 bg-canvas border border-line rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-mono text-sm">{rec.bed.id}</span>
                          <span className="text-xs text-slate-600 font-medium">
                            {rec.bed.ward} · Room {rec.bed.roomNumber}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                              rec.matchConfidence === 'Exact Match'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-sky-50 text-sky-700 border border-sky-200'
                            }`}
                          >
                            {rec.score}% Match ({rec.matchConfidence})
                          </span>
                        </div>

                        <ul className="text-[11px] text-slate-500 list-disc list-inside space-y-0.5">
                          {rec.rationale.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => handleConfirmAllocation(rec.bed.id)}
                        className="px-3.5 py-1.5 bg-ink hover:bg-slate-800 text-white rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
                      >
                        Confirm Allocation
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-line flex justify-end">
              <PillButton onClick={() => setIsAllocationModalOpen(false)}>Cancel</PillButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
