import React, { useState } from 'react';
import {
  FileText,
  PlusCircle,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  Receipt,
  Plus,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import {
  Badge,
  HeroCard,
  IconButton,
  PageHeader,
  PillSelect,
  StatCard,
  Tabs,
} from '../components/ui';
import { BillingChargeCategory, BillingCharge } from '../types/hospital';

export const SmartSettleView: React.FC = () => {
  const {
    accounts,
    patients,
    insuranceClaims,
    addBillingCharge,
    verifyBillingCharge,
    reverseBillingCharge,
    recordPayment,
    role,
  } = useHospital();

  const [selectedPatientId, setSelectedPatientId] = useState<string>('P-101');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'warn'; msg: string } | null>(null);

  // New Charge Modal State
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);
  const [chargeCategory, setChargeCategory] = useState<BillingChargeCategory>('pharmacy');
  const [chargeDesc, setChargeDesc] = useState('');
  const [chargeAmount, setChargeAmount] = useState(180);

  // Reversal Prompt State
  const [reversingChargeId, setReversingChargeId] = useState<string | null>(null);
  const [reversalReason, setReversalReason] = useState('Service order cancelled prior to administration');

  const currentPatient = patients.find((p) => p.id === selectedPatientId);
  const currentAccount = accounts[selectedPatientId];
  const currentClaim = insuranceClaims[selectedPatientId];

  if (!currentAccount) {
    return <div className="p-8 text-center text-slate-500">No billing account found.</div>;
  }

  const charges = currentAccount.charges;
  const filteredCharges = categoryFilter === 'all' ? charges : charges.filter((c) => c.category === categoryFilter);

  const totalCharges = charges.reduce((sum, c) => (c.status !== 'reversed' ? sum + c.amount : sum), 0);
  const totalVerified = charges.filter((c) => c.status === 'verified').reduce((sum, c) => sum + c.amount, 0);
  const totalPendingVerification = charges.filter((c) => c.status === 'ordered').reduce((sum, c) => sum + c.amount, 0);
  const totalDisputed = charges.filter((c) => c.status === 'disputed').reduce((sum, c) => sum + c.amount, 0);

  const totalPayments = currentAccount.payments.reduce((sum, p) => sum + p.amount, 0);
  const approvedInsurance = currentClaim ? currentClaim.approvedAmount : 0;
  const provisionalPatientBalance = Math.max(0, totalCharges - approvedInsurance - totalPayments);

  const runningTotal = [...charges]
    .filter((c) => c.status !== 'reversed')
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    .reduce<{ time: string; total: number }[]>((acc, c) => {
      const prev = acc.length ? acc[acc.length - 1].total : 0;
      acc.push({
        time: new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        total: prev + c.amount,
      });
      return acc;
    }, []);

  // Simulate charge event helper
  const handleQuickSimulate = (cat: BillingChargeCategory, desc: string, amt: number) => {
    const res = addBillingCharge(selectedPatientId, {
      category: cat,
      description: desc,
      amount: amt,
      status: 'ordered',
      departmentId: currentPatient?.departmentId || 'MED',
    });

    if (res.duplicateWarn) {
      setNotification({ type: 'warn', msg: res.message });
    } else {
      setNotification({ type: 'success', msg: res.message });
    }
    setTimeout(() => setNotification(null), 5000);
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chargeDesc.trim() || chargeAmount <= 0) return;

    const res = addBillingCharge(selectedPatientId, {
      category: chargeCategory,
      description: chargeDesc.trim(),
      amount: chargeAmount,
      status: 'ordered',
      departmentId: currentPatient?.departmentId || 'MED',
    });

    setIsSimulateModalOpen(false);
    setChargeDesc('');
    if (res.duplicateWarn) {
      setNotification({ type: 'warn', msg: res.message });
    } else {
      setNotification({ type: 'success', msg: res.message });
    }
    setTimeout(() => setNotification(null), 5000);
  };

  const handleExecuteReversal = (chargeId: string) => {
    reverseBillingCharge(selectedPatientId, chargeId, reversalReason);
    setReversingChargeId(null);
    setNotification({ type: 'success', msg: `Charge reversed and credit memo posted to ledger.` });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Financial Coordination & Settlement"
        title="SmartSettle Billing"
        description="Continuous real-time charge capture across pharmacy, clinical laboratory, operating theaters, and room tariffs. Eliminates end-of-stay billing bottlenecks with automatic duplicate detection and idempotent auditing."
        actions={
          <>
            <PillSelect
              value={selectedPatientId}
              onChange={setSelectedPatientId}
              label="Account"
              options={patients.map((p) => ({ value: p.id, label: `${p.fullName} (${p.mrn})` }))}
            />
            <IconButton label="Add custom charge" variant="accent" onClick={() => setIsSimulateModalOpen(true)}>
              <Plus className="w-5 h-5" />
            </IconButton>
          </>
        }
      />

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
            notification.type === 'warn'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'warn' ? (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
            <span>{notification.msg}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600 text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Financial Settlement Snapshot Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HeroCard
          eyebrow="Total billed charges"
          value={`$${totalCharges.toLocaleString()}`}
          caption={`${charges.length} line items on ${currentPatient?.fullName ?? 'this account'}'s running ledger.`}
          status={
            <Badge tone={totalDisputed > 0 ? 'warning' : 'ok'} className="!bg-white/10 !border-white/10 !text-white">
              {totalDisputed > 0 ? `$${totalDisputed.toLocaleString()} disputed` : 'No disputes'}
            </Badge>
          }
          data={runningTotal}
          xKey="time"
          yKey="total"
          yLabel="Running total ($)"
          footer={
            <div className="flex items-center justify-between">
              <span>Cumulative charges over the stay</span>
              <span className="text-white font-semibold tabular-nums">${provisionalPatientBalance.toLocaleString()} co-pay</span>
            </div>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
          <StatCard
            label="Verified / audited"
            value={`$${totalVerified.toLocaleString()}`}
            footer={
              totalPendingVerification > 0 ? (
                <Badge tone="warning">${totalPendingVerification.toLocaleString()} unverified</Badge>
              ) : (
                '100% verified'
              )
            }
          />
          <StatCard
            label="Confirmed insurance advance"
            value={`$${approvedInsurance.toLocaleString()}`}
            footer={currentClaim?.insurerName || 'Self-pay account'}
          />
          <StatCard
            className="sm:col-span-2"
            label="Provisional patient co-pay"
            value={`$${provisionalPatientBalance.toLocaleString()}`}
            footer={`Paid to date: $${totalPayments.toLocaleString()}`}
          />
        </div>
      </div>

      {/* Charge Simulation Event Bar */}
      <div className="bg-card border border-line rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Department Charge Event Simulator (Hackathon Demo Layer)
            </h3>
            <p className="text-[11px] text-slate-500">
              Trigger real-time charge events from different clinical units to test live ledger synchronization & idempotency
            </p>
          </div>
          <button
            onClick={() => setIsSimulateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Custom Charge</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => handleQuickSimulate('pharmacy', 'Dispense: IV Ceftriaxone 1g & Infusion Set', 185)}
            className="px-4 py-2 bg-card hover:border-slate-300 border border-line rounded-full text-ink font-medium transition-colors cursor-pointer"
          >
            + Pharmacy Dispense ($185)
          </button>

          <button
            onClick={() => handleQuickSimulate('diagnostic', 'Lab: Comprehensive Metabolic Panel (CMP)', 240)}
            className="px-4 py-2 bg-card hover:border-slate-300 border border-line rounded-full text-ink font-medium transition-colors cursor-pointer"
          >
            + Lab Test Performed ($240)
          </button>

          <button
            onClick={() => handleQuickSimulate('procedure', 'Bedside Ultrasound Guided Paracentesis', 650)}
            className="px-4 py-2 bg-card hover:border-slate-300 border border-line rounded-full text-ink font-medium transition-colors cursor-pointer"
          >
            + Procedure Performed ($650)
          </button>

          <button
            onClick={() => handleQuickSimulate('meal', 'Therapeutic Renal Diet Nutrition Tray', 45)}
            className="px-4 py-2 bg-card hover:border-slate-300 border border-line rounded-full text-ink font-medium transition-colors cursor-pointer"
          >
            + Meal Charge ($45)
          </button>

          {/* Test Duplicate Charge detection */}
          <button
            onClick={() => {
              // Intentionally try to add duplicate of first charge to test idempotency
              if (charges.length > 0) {
                const target = charges[0];
                handleQuickSimulate(target.category, target.description, target.amount);
              }
            }}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-full font-medium transition-colors cursor-pointer"
            title="Attempts to submit duplicate charge to demonstrate idempotency guard"
          >
            ⚠ Test Duplicate Submission
          </button>
        </div>
      </div>

      {/* Itemized Charges Ledger Table */}
      <div className="bg-card border border-line rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-sky-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Itemized Charge Ledger ({filteredCharges.length} Transactions)
            </h3>
          </div>

          {/* Category Filter Tabs */}
          <Tabs
            size="sm"
            value={categoryFilter}
            onChange={setCategoryFilter}
            items={['all', 'room', 'pharmacy', 'diagnostic', 'procedure', 'nursing', 'meal'].map((cat) => ({
              id: cat,
              label: <span className="capitalize">{cat}</span>,
            }))}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-line">
              <tr>
                <th className="py-2.5 px-4">TX ID</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Description</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4">Audit Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCharges.map((c) => {
                const isReversed = c.status === 'reversed';
                const isDisputed = c.status === 'disputed';
                const isOrdered = c.status === 'ordered';
                const isVerified = c.status === 'verified';

                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-slate-50/60 transition-colors ${
                      isReversed ? 'bg-slate-50/50 opacity-60 line-through' : isDisputed ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {c.transactionId}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="py-3 px-4 font-semibold text-[11px] uppercase text-slate-600">
                      {c.category}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{c.description}</div>
                      {c.reversalReason && (
                        <div className="text-[10px] text-rose-600 italic">Reversal reason: {c.reversalReason}</div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-slate-900">
                      ${c.amount.toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                          isVerified
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isDisputed
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : isReversed
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {!isReversed && (
                        <div className="flex items-center justify-end gap-1.5">
                          {!isVerified && (
                            <button
                              onClick={() => verifyBillingCharge(selectedPatientId, c.id)}
                              className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full cursor-pointer"
                              title="Verify Charge"
                            >
                              Verify
                            </button>
                          )}
                          <button
                            onClick={() => setReversingChargeId(c.id)}
                            className="px-2 py-0.5 text-[11px] text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-full cursor-pointer"
                            title="Reverse Charge"
                          >
                            Reverse
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reversal Confirmation Modal */}
      {reversingChargeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-xs p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full border border-line shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Confirm Charge Reversal</h3>
            <p className="text-slate-600">
              Provide an audit reason for crediting this transaction. A credit memo will be recorded on the running account ledger.
            </p>
            <textarea
              value={reversalReason}
              onChange={(e) => setReversalReason(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-ink"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReversingChargeId(null)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExecuteReversal(reversingChargeId)}
                className="px-3 py-1.5 bg-rose-700 text-white rounded-full font-semibold hover:bg-rose-800 cursor-pointer"
              >
                Confirm Reversal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Charge Modal */}
      {isSimulateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-xs p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full border border-line shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Add Clinical Charge to Ledger</h3>
            <form onSubmit={handleManualAdd} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  value={chargeCategory}
                  onChange={(e) => setChargeCategory(e.target.value as BillingChargeCategory)}
                  className="w-full p-2 border border-slate-200 rounded-md bg-white text-slate-800"
                >
                  <option value="pharmacy">Pharmacy & Medications</option>
                  <option value="diagnostic">Diagnostic & Pathology</option>
                  <option value="procedure">Surgical & Clinical Procedures</option>
                  <option value="nursing">Specialized Nursing & Monitoring</option>
                  <option value="meal">Clinical Nutrition & Dietary</option>
                  <option value="room">Room & Suite Tariff</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Item Description</label>
                <input
                  type="text"
                  value={chargeDesc}
                  onChange={(e) => setChargeDesc(e.target.value)}
                  placeholder="e.g. IV Ciprofloxacin 400mg Vial"
                  required
                  className="w-full p-2 border border-slate-200 rounded-md text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Amount ($ USD)</label>
                <input
                  type="number"
                  min="1"
                  value={chargeAmount}
                  onChange={(e) => setChargeAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-slate-200 rounded-md text-slate-800 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSimulateModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-ink text-white rounded-full font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  Post Charge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
