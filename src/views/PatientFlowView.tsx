import React, { useState } from 'react';
import {
  Users,
  Clock,
  ShieldAlert,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  BedDouble,
  Search,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import {
  Badge,
  Card,
  CardHeader,
  HeroCard,
  PageHeader,
  PillButton,
  Tabs,
} from '../components/ui';
import { NavTabId } from '../components/navigation';

interface PatientFlowViewProps {
  setActiveTab: (tab: NavTabId) => void;
}

export const PatientFlowView: React.FC<PatientFlowViewProps> = ({ setActiveTab }) => {
  const { queueItems, departments, beds, setSelectedPatientId } = useHospital();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const edBoardingItems = queueItems.filter((q) => q.departmentId === 'ED' && q.status === 'admission_pending');

  const filteredQueue = queueItems.filter((item) => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch =
      searchTerm === '' ||
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Patient Intake & Queue Monitoring"
        title="Patient Flow"
        description="Monitor real-time patient progression from Emergency intake through clinical assessment, inpatient bed allocation, and transfer. Predict and eliminate emergency boarding risks caused by downstream bed turnaround delays."
        actions={
          <>
            <PillButton variant="dark" icon={<BedDouble className="w-3.5 h-3.5" />} onClick={() => setActiveTab('bed-management')}>
              Allocate beds
            </PillButton>
            <PillButton onClick={() => setActiveTab('autopilot')}>Expedite discharge plan</PillButton>
          </>
        }
      />

      {/* Emergency Boarding Prevention Callout Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HeroCard
          eyebrow="Emergency boarding risk"
          value={edBoardingItems.length}
          unit="patients boarding"
          caption="Admitted ED patients holding in hallway bays because target units have no ready beds."
          status={<Badge tone="critical" className="!bg-white/10 !border-white/10 !text-white">High alert</Badge>}
          data={queueItems.map((q) => ({ name: q.patientName.split(' ')[0], wait: q.waitingMinutes }))}
          xKey="name"
          yKey="wait"
          yLabel="Wait (min)"
          footer={
            <div className="flex items-center justify-between">
              <span>Wait minutes across the live queue</span>
              <span className="text-white font-semibold tabular-nums">{queueItems.length} in queue</span>
            </div>
          }
        />
      <Card>
        <CardHeader title="Boarding patients" subtitle="Longest holds first" icon={<ShieldAlert className="w-4 h-4" />} />
        {/* Boarding Queue Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...edBoardingItems].sort((x, y) => y.waitingMinutes - x.waitingMinutes).map((b) => (
            <div key={b.id} className="p-3 bg-canvas border border-line rounded-xl text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{b.patientName}</span>
                <span className="text-[10px] font-mono tabular-nums text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded-sm border border-rose-200">
                  {b.waitingMinutes}m wait
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Target: <strong>{b.targetWard}</strong>
              </div>
              <p className="text-[11px] text-slate-600 mt-1.5 line-clamp-2 italic">
                "{b.chiefComplaint}"
              </p>
            </div>
          ))}
        </div>
      </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Tabs
          size="sm"
          value={statusFilter}
          onChange={setStatusFilter}
          items={[
            { id: 'all', label: 'All patients' },
            { id: 'admission_pending', label: 'Admission pending' },
            { id: 'in_assessment', label: 'In assessment' },
            { id: 'waiting', label: 'Waiting triage' },
            { id: 'allocated', label: 'Bed allocated' },
          ]}
        />

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient or symptom..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-line rounded-full focus:outline-none focus:ring-1 focus:ring-ink bg-card"
          />
        </div>
      </div>

      {/* Central Queue Table */}
      <div className="bg-card border border-line rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Live Intake Queue ({filteredQueue.length} Active Records)
            </h3>
          </div>
          <div className="text-xs text-slate-500">
            Sorted by clinical triage priority and wait duration
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-line">
              <tr>
                <th className="py-2.5 px-4">Patient Name & Age</th>
                <th className="py-2.5 px-4">Triage Priority</th>
                <th className="py-2.5 px-4">Chief Complaint / Condition</th>
                <th className="py-2.5 px-4">Target Ward</th>
                <th className="py-2.5 px-4">Wait Time</th>
                <th className="py-2.5 px-4">Workflow Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQueue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedPatientId(item.patientId)}
                      className="font-bold text-slate-900 hover:text-sky-800 hover:underline text-left cursor-pointer"
                    >
                      {item.patientName}
                    </button>
                    <div className="text-[11px] text-slate-500">
                      {item.age}y {item.gender} · ID: {item.patientId}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tight ${
                        item.triageCategory === 'P1_resuscitation'
                          ? 'bg-rose-100 text-rose-800'
                          : item.triageCategory === 'P2_emergency'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : item.triageCategory === 'P3_urgent'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.triageCategory.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-medium text-slate-800 truncate">{item.chiefComplaint}</div>
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-700">
                    {item.targetWard}
                  </td>

                  <td className="py-3 px-4 font-mono tabular-nums">
                    <span className={item.waitingMinutes > 60 ? 'text-rose-700 font-bold' : 'text-slate-700'}>
                      {item.waitingMinutes} min
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`text-[11px] font-medium capitalize ${
                      item.status === 'admission_pending' ? 'text-rose-700' :
                      item.status === 'allocated' ? 'text-emerald-700' : 'text-slate-600'
                    }`}>
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    {item.status === 'admission_pending' ? (
                      <button
                        onClick={() => setActiveTab('bed-management')}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-ink hover:bg-ink text-white rounded-full transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
                      >
                        Allocate Bed
                      </button>
                    ) : item.assignedBedId ? (
                      <span className="text-[11px] text-emerald-700 font-medium font-mono">
                        Assigned: {item.assignedBedId}
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedPatientId(item.patientId)}
                        className="text-[11px] text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        Details →
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
