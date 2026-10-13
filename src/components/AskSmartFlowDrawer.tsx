import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, CheckCircle2, AlertCircle } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { askSmartFlow, AIResponse } from '../services/geminiService';
import { IconButton } from './ui';

interface AskSmartFlowDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskSmartFlowDrawer: React.FC<AskSmartFlowDrawerProps> = ({ isOpen, onClose }) => {
  const {
    totalBeds,
    occupiedBeds,
    availableBeds,
    occupancyRate,
    edBoardingCount,
    blockedDischargesCount,
    departments,
    queueItems,
    operationalAlerts,
    bottlenecks,
  } = useHospital();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; text: string; source?: string; metrics?: string[] }[]
  >([
    {
      role: 'assistant',
      text: "Hello! I am SmartFlow's Grounded Operational Assistant. I analyze real-time hospital queues, bed turnover, diagnostic backlogs, and discharge blockers. How can I help optimize operations today?",
      source: 'system',
    },
  ]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Which ward is approaching critical capacity?',
    'What is causing the largest operational bottleneck?',
    'What is the current Emergency boarding status?',
    'Which discharges are blocked by billing or pharmacy?',
    'What top actions should shift administrators review?',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend.trim();
    setInputQuery('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const context = {
      totalBeds,
      occupiedBeds,
      availableBeds,
      occupancyRate,
      edBoardingCount,
      delayedDischarges: blockedDischargesCount,
      departments: departments.map((d) => ({
        name: d.name,
        beds: d.totalBeds,
        queue: d.currentQueue,
        wait: d.avgWaitMinutes,
      })),
      topQueues: queueItems.slice(0, 5).map((q) => ({
        patient: q.patientName,
        dept: q.departmentId,
        wait: q.waitingMinutes,
        complaint: q.chiefComplaint,
      })),
      activeBottlenecks: bottlenecks.map((b) => ({
        title: b.title,
        measurements: b.measurements,
        action: b.recommendedNextAction,
      })),
      alerts: operationalAlerts.filter((a) => a.status === 'active').map((a) => a.title),
    };

    try {
      const response: AIResponse = await askSmartFlow(userMsg, context);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: response.answer,
          source: response.source,
          metrics: response.groundingMetrics,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'An operational analysis error occurred while evaluating telemetry. Please verify hospital data connection.',
          source: 'error',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/30 backdrop-blur-xs transition-opacity sm:p-3" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-card h-full shadow-2xl flex flex-col border border-line sm:rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Ask SmartFlow"
      >
        {/* Header */}
        <div className="p-5 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full accent-gradient text-ink flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">Ask SmartFlow</h2>
              <div className="text-[11px] text-slate-500">Grounded Operations Intelligence</div>
            </div>
          </div>
          <IconButton label="Close assistant" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </IconButton>
        </div>

        {/* Quick Prompts */}
        <div className="px-5 py-3 border-b border-line">
          <div className="text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            Suggested Operational Queries
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                disabled={loading}
                className="text-left text-[11px] px-3 py-1.5 bg-canvas border border-line rounded-full text-ink-2 hover:text-ink hover:border-slate-300 transition-colors cursor-pointer disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, index) => (
            <div
              key={index}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-ink text-white font-medium rounded-br-md'
                    : 'bg-canvas text-ink border border-line rounded-bl-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                {m.metrics && m.metrics.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-line text-[10px] text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Grounded in: {m.metrics.join(' · ')}</span>
                  </div>
                )}
                {m.source === 'deterministic_engine' && (
                  <div className="mt-1 text-[10px] text-slate-400 italic">
                    Grounded rule engine analysis
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
              <Bot className="w-4 h-4 animate-spin text-sky-700" />
              <span>Analyzing live telemetry and calculating operational bottlenecks...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-line">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask an operational question (e.g. bed turnover, queues, insurance)..."
              disabled={loading}
              className="flex-1 text-xs px-4 py-2.5 border border-line rounded-full focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink bg-canvas"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="w-10 h-10 flex items-center justify-center accent-gradient text-ink rounded-full hover:brightness-105 transition disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-slate-400 mt-1.5 text-center">
            Zero hallucinations. Operational metrics are strictly tied to real platform records.
          </div>
        </div>
      </div>
    </div>
  );
};
