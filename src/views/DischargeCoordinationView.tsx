import React, { useState } from 'react';
import {
  Layers,
  Clock,
  AlertTriangle,
  CheckCircle2,
  UserCheck,
  Building2,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  BedDouble,
  LogOut,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import {
  Badge,
  HeroCard,
  PageHeader,
  PillSelect,
  ProgressBar,
} from '../components/ui';
import { DischargeTask } from '../types/hospital';

export const DischargeCoordinationView: React.FC = () => {
  const {
    dischargeRecords,
    patients,
    beds,
    updateDischargeTaskStatus,
    authorizeDischarge,
    completePatientDeparture,
    role,
  } = useHospital();

  const [selectedPatientId, setSelectedPatientId] = useState<string>('P-102');

  const recordsList = Object.values(dischargeRecords);
  const currentRecord = dischargeRecords[selectedPatientId] || recordsList[0];
  const patient = patients.find((p) => p.id === currentRecord?.patientId);
  const bed = beds.find((b) => b.id === currentRecord?.bedId);

  const completedTasks = currentRecord ? currentRecord.tasks.filter((t) => t.status === 'completed').length : 0;
  const blockedTasks = currentRecord ? currentRecord.tasks.filter((t) => t.status === 'blocked').length : 0;

  const stages = [
    'Clinical Authorization',
    'Documentation Prep',
    'Pharmacy Reconciliation',
    'Billing Charge Audit',
    'Insurance Clearance',
    'Financial Settlement',
    'Patient Departure',
    'Bed Turnover',
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Multidisciplinary Departure Workflow"
        title="Discharges"
        description="Eliminates avoidable administrative and financial discharge delays while strictly preserving independent clinical governance. Patient departure initiates closed-loop environmental turnover."
        actions={
          <>
            <PillSelect
              value={currentRecord?.patientId ?? ''}
              onChange={setSelectedPatientId}
              label="Patient"
              options={recordsList.map((r) => ({
                value: r.patientId,
                label: `${r.patientName} (${r.bedId})`,
              }))}
            />
          </>
        }
      />

      {currentRecord && (
        <HeroCard
          eyebrow="Est. administrative completion"
          value={`${currentRecord.estimatedCompletionMinutesMin}–${currentRecord.estimatedCompletionMinutesMax}`}
          unit="minutes"
          caption={`${currentRecord.patientName} · Bed ${currentRecord.bedId}. Calculated from pending dependencies.`}
          status={
            <Badge tone={blockedTasks > 0 ? 'critical' : 'ok'} className="!bg-white/10 !border-white/10 !text-white">
              {blockedTasks > 0 ? `${blockedTasks} blocked` : 'No blockers'}
            </Badge>
          }
        >
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-white/60">
              <span className="capitalize">{currentRecord.currentStage.replace(/_/g, ' ')}</span>
              <span className="text-white font-semibold tabular-nums">
                {completedTasks}/{currentRecord.tasks.length} tasks done
              </span>
            </div>
            <ProgressBar tone="accent" value={(completedTasks / Math.max(1, currentRecord.tasks.length)) * 100} label="Discharge progress" />
          </div>
        </HeroCard>
      )}

      {/* Discharge Summary Strip */}
      {currentRecord && (
        <div className="bg-card border border-line rounded-2xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {currentRecord.patientName} · Inpatient Discharge Tracker
                </h3>
                <span className="font-mono text-xs text-slate-500 font-semibold">
                  Bed {currentRecord.bedId}
                </span>
                <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-sm border border-sky-200 uppercase">
                  {currentRecord.currentStage.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Authorized By: <strong>{currentRecord.authorizedClinician || 'Pending Physician Authorization'}</strong>
              </p>
            </div>


          </div>

          {/* Delay Explanation Callout */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Current Delay Diagnostic: </strong>
              <span>{currentRecord.delayExplanation}</span>
            </div>
          </div>

          {/* Interactive Action Bar: Record Patient Departure */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500">
              Clinician authorization: {currentRecord.authorizedAt ? new Date(currentRecord.authorizedAt).toLocaleTimeString() : 'Pending'}
            </div>

            <div className="flex items-center gap-2">
              {!currentRecord.departureTime ? (
                <button
                  onClick={() => completePatientDeparture(currentRecord.patientId)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-semibold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Record Patient Departure & Trigger Bed Turnover</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold bg-slate-100 px-3 py-1.5 rounded-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Patient Departed at {new Date(currentRecord.departureTime).toLocaleTimeString()} · Bed in EVS Cleaning</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Task Tracker & Interactive Dependency Table */}
      {currentRecord && (
        <div className="bg-card border border-line rounded-2xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-line flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Discharge Task Tracker & Dependency Pipeline ({currentRecord.tasks.length} Stages)
            </h3>
            <span className="text-xs text-slate-500">
              Click status to update tasks & recalculate completion window
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-line">
                <tr>
                  <th className="py-2.5 px-4">Task Name</th>
                  <th className="py-2.5 px-4">Department / Role</th>
                  <th className="py-2.5 px-4">Priority</th>
                  <th className="py-2.5 px-4 text-center">Duration</th>
                  <th className="py-2.5 px-4">Dependency / Blocker Status</th>
                  <th className="py-2.5 px-4">Current Status</th>
                  <th className="py-2.5 px-4 text-right">Interactive Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentRecord.tasks.map((task) => {
                  const isBlocked = task.status === 'blocked';
                  const isCompleted = task.status === 'completed';
                  const isInProgress = task.status === 'in_progress';

                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        isBlocked ? 'bg-rose-50/30' : isCompleted ? 'opacity-85' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : isBlocked ? (
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span>{task.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        <div>{task.department}</div>
                        <div className="text-[11px] text-slate-400">{task.assignedRole}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                            task.priority === 'critical'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : task.priority === 'high'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-700">
                        {task.estimatedDurationMinutes}m
                      </td>

                      <td className="py-3 px-4 max-w-xs text-slate-600">
                        {isBlocked ? (
                          <div className="text-rose-700 font-medium">
                            ⚠ Blocked: {task.blockingReason}
                          </div>
                        ) : task.notes ? (
                          <div className="text-slate-500 text-[11px]">{task.notes}</div>
                        ) : (
                          <div className="text-slate-400">Prerequisites satisfied</div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isBlocked
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isInProgress
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {!isCompleted ? (
                          <button
                            onClick={() =>
                              updateDischargeTaskStatus(
                                currentRecord.patientId,
                                task.id,
                                'completed'
                              )
                            }
                            className="px-2.5 py-1 text-[11px] font-semibold bg-ink hover:bg-ink text-white rounded-full cursor-pointer shadow-2xs whitespace-nowrap"
                          >
                            Mark Completed
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              updateDischargeTaskStatus(
                                currentRecord.patientId,
                                task.id,
                                'in_progress'
                              )
                            }
                            className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            Re-open
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
