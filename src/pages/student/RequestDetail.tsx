import React from 'react';
import { useApp } from '../../app/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import {
  ArrowLeft,
  Clock,
  Building2,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  Calendar,
} from 'lucide-react';
import { SUPPORT_DOMAINS } from '../../data/supportCatalog';

export const RequestDetail: React.FC = () => {
  const { state, dispatch, activeCase } = useApp();

  if (!activeCase) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-sm text-slate-500">No request selected.</p>
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'student-requests' } })}
          className="mt-4 px-4 py-2 bg-navy-900 text-white rounded-lg text-xs font-semibold"
        >
          Back to My Requests
        </button>
      </div>
    );
  }

  const { triageResult, routing, timeline } = activeCase;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 space-y-6 animate-fadeIn">
      {/* Back button */}
      <div>
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'student-requests' } })}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to My Requests</span>
        </button>
      </div>

      {/* Main Status Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-lg text-navy-950">{activeCase.id}</span>
              <StatusBadge status={activeCase.status} />
              <PriorityBadge priority={activeCase.priority} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Submitted on {new Date(activeCase.createdAt).toLocaleDateString()} at{' '}
              {new Date(activeCase.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Quick status message box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs">
            <span className="font-semibold text-slate-800">Current Status: </span>
            {activeCase.status === 'open' && (
              <span className="text-blue-700">Awaiting initial staff intake review.</span>
            )}
            {activeCase.status === 'under_review' && (
              <span className="text-amber-800 font-medium">Assigned to support staff; care plan in progress.</span>
            )}
            {activeCase.status === 'resolved' && (
              <span className="text-emerald-700 font-medium">Support actions coordinated and confirmed.</span>
            )}
            {activeCase.status === 'closed' && (
              <span className="text-slate-600">Case completed and archived.</span>
            )}
          </div>
        </div>

        {/* Coordinated Pathway Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Coordinated Service Route
            </span>
            <div className="flex items-center gap-2 text-sm font-bold text-navy-950">
              <Building2 size={16} className="text-brand-600" />
              <span>{routing.primaryRoute}</span>
            </div>
            {routing.additionalRoutes.length > 0 && (
              <p className="text-xs text-slate-600">
                Liaising with: <span className="font-medium">{routing.additionalRoutes.join(', ')}</span>
              </p>
            )}
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Next Step for this Request
            </span>
            <p className="text-xs font-medium text-slate-800 leading-relaxed">
              {activeCase.nextBestAction.action}
            </p>
          </div>
        </div>
      </div>

      {/* Two Columns: Intake details & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: What you told us vs understood */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
            <h3 className="font-bold text-sm text-navy-950 pb-2 border-b border-slate-100">
              Intake Record
            </h3>

            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1">
                Concerns Selected:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeCase.selectedConcerns.map((c, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs rounded-md bg-slate-100 text-slate-800 font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {activeCase.freeText && (
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">
                  Your Note:
                </span>
                <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-lg italic">
                  "{activeCase.freeText}"
                </p>
              </div>
            )}

            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1.5">
                Identified Needs:
              </span>
              <div className="flex flex-wrap gap-2">
                {triageResult.needs.map((need) => (
                  <span
                    key={need.domain}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-semibold border ${
                      SUPPORT_DOMAINS[need.domain]?.colorTheme.badge || 'bg-slate-100'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {need.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-brand-50/60 rounded-lg border border-brand-100 text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-brand-950 block mb-1">Why this plan:</span>
              {routing.whyThisPlan}
            </div>
          </div>
        </div>

        {/* Right Column: Case Timeline */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="font-bold text-sm text-navy-950 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Activity Timeline</span>
              <span className="text-[10px] font-semibold text-slate-500">
                {timeline.length} updates
              </span>
            </h3>

            <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {timeline.map((evt) => (
                <div key={evt.id} className="relative">
                  <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-brand-600 ring-4 ring-white" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{evt.title}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{evt.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span>{new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span>{evt.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
