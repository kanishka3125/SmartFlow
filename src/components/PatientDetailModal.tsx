import React from 'react';
import { X, User, Activity, FileText, ShieldCheck, BedDouble, AlertCircle } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Badge, IconButton, PillButton } from './ui';

interface PatientDetailModalProps {
  patientId: string;
  onClose: () => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patientId, onClose }) => {
  const { patients, beds, accounts, insuranceClaims, dischargeRecords, departments } = useHospital();

  const patient = patients.find((p) => p.id === patientId);
  const bed = beds.find((b) => b.id === patient?.bedId);
  const account = accounts[patientId];
  const claim = insuranceClaims[patientId];
  const discharge = dischargeRecords[patientId];
  const dept = departments.find((d) => d.id === patient?.departmentId);

  if (!patient) return null;

  const totalCharges = account?.charges.reduce((sum, c) => (c.status !== 'reversed' ? sum + c.amount : sum), 0) || 0;
  const totalPaid = account?.payments.reduce((sum, p) => sum + p.amount, 0) || 0;
  const outstanding = Math.max(0, totalCharges - totalPaid - (claim?.approvedAmount || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-xs p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl shadow-2xl border border-line w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${patient.fullName} profile`}
      >
        {/* Header */}
        <div className="p-5 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full accent-gradient flex items-center justify-center text-ink font-semibold text-sm">
              {patient.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{patient.fullName}</h3>
                <span className="text-xs font-mono text-slate-500">{patient.mrn}</span>
              </div>
              <div className="text-xs text-slate-500">
                {patient.age}y {patient.gender} · Admitted {new Date(patient.admissionDate).toLocaleDateString()} · {dept?.name || patient.departmentId}
              </div>
            </div>
          </div>
          <IconButton label="Close profile" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </IconButton>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Clinical Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
              <div className="text-slate-500 text-[11px] font-medium">Admitting Diagnosis</div>
              <div className="font-semibold text-slate-900 mt-1">{patient.admittingDiagnosis}</div>
              <div className="text-[11px] text-slate-500 mt-1">Attending: {patient.primaryPhysician}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
              <div className="text-slate-500 text-[11px] font-medium">Assigned Bed & Ward</div>
              <div className="font-semibold text-slate-900 mt-1 flex items-center gap-1.5">
                <BedDouble className="w-4 h-4 text-sky-700" />
                <span>{bed ? `${bed.id} (${bed.ward} - Room ${bed.roomNumber})` : 'Unassigned'}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Status: {bed?.status || 'N/A'}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
              <div className="text-slate-500 text-[11px] font-medium">Clinical & Triage Status</div>
              <div className="font-semibold text-slate-900 mt-1 capitalize">{patient.clinicalStatus.replace(/_/g, ' ')}</div>
              <div className="text-[11px] text-slate-500 mt-1">Acuity Score: {patient.acuityScore}/5 ({patient.triageCategory})</div>
            </div>
          </div>

          {/* Discharge Tracker Snapshot */}
          {discharge && (
            <div className="p-3.5 border border-slate-200 rounded-md bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-sky-700" />
                  <span>Discharge Workflow Status</span>
                </span>
                <Badge tone="info">{discharge.currentStage.replace(/_/g, ' ')}</Badge>
              </div>
              <div className="text-xs text-slate-600 mb-2">{discharge.delayExplanation}</div>
              <div className="text-[11px] text-slate-500">
                Est. Completion Window: <strong className="tabular-nums font-mono text-slate-800">{discharge.estimatedCompletionMinutesMin}–{discharge.estimatedCompletionMinutesMax} minutes</strong>
              </div>
            </div>
          )}

          {/* Insurance Overview */}
          {claim && (
            <div className="p-3.5 border border-slate-200 rounded-md bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Insurance Claim Status</span>
                </span>
                <Badge>{claim.status.replace(/_/g, ' ')}</Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <div className="text-slate-400 text-[11px]">Insurer</div>
                  <div className="font-medium text-slate-800">{claim.insurerName}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Policy #</div>
                  <div className="font-mono text-slate-800">{claim.policyNumber}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Requested</div>
                  <div className="font-mono font-medium text-slate-800">${claim.requestedAmount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Approved</div>
                  <div className="font-mono font-semibold text-emerald-700">${claim.approvedAmount.toLocaleString()}</div>
                </div>
              </div>
              {claim.queries.length > 0 && (
                <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md text-amber-900 text-xs">
                  <strong>Pending Insurer Query:</strong> {claim.queries[0].queryText}
                </div>
              )}
            </div>
          )}

          {/* Live Billing Itemized Charges */}
          {account && (
            <div className="border border-slate-200 rounded-md overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-line flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>SmartSettle Live Charges ({account.charges.length} Items)</span>
                </span>
                <div className="text-xs">
                  Total Billed: <strong className="font-mono tabular-nums text-slate-900">${totalCharges.toLocaleString()}</strong>
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 text-slate-500 text-[11px] border-b border-line">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {account.charges.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">
                          {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-2 px-3 uppercase text-[10px] font-semibold text-slate-600">{c.category}</td>
                        <td className="py-2 px-3 text-slate-800">{c.description}</td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-900">${c.amount.toLocaleString()}</td>
                        <td className="py-2 px-3">
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm ${
                            c.status === 'verified' ? 'bg-emerald-50 text-emerald-700' :
                            c.status === 'ordered' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-line flex justify-end">
          <PillButton variant="dark" onClick={onClose}>
            Close profile
          </PillButton>
        </div>
      </div>
    </div>
  );
};
