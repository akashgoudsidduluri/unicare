import React from 'react';
import { TriageResult } from '../../types/triage';
import { Sparkles, ArrowRight, ShieldCheck, Layers, GitMerge } from 'lucide-react';
import { SUPPORT_DOMAINS } from '../../data/supportCatalog';

interface DotsConnectedCardProps {
  triageResult: TriageResult;
  onProceed: () => void;
  onBack?: () => void;
}

export const DotsConnectedCard: React.FC<DotsConnectedCardProps> = ({
  triageResult,
  onProceed,
  onBack,
}) => {
  const domainLabels = triageResult.needs.map((n) => n.label.replace(' Support', ''));
  const joinedDomainNames =
    domainLabels.length > 1
      ? `${domainLabels.slice(0, -1).join(', ')} and ${domainLabels.slice(-1)}`
      : domainLabels[0] || 'support';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 animate-fadeIn">
      {/* Header Badge & Title */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
          <GitMerge size={14} className="text-brand-600" />
          Multi-Need Synthesis
        </span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight">
        We've connected the dots.
      </h2>

      <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
        Your concerns span multiple areas. UniCare recommends a{' '}
        <span className="font-semibold text-navy-900">coordinated support pathway</span> so you don't
        have to figure out which support office to approach first.
      </p>

      {/* Visual Relationship Diagram */}
      <div className="mt-8 mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Recommended Support Orchestration Flow
          </div>
          <span className="text-[11px] font-medium text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
            Student Intake → Connected Needs → Coordinated Hub
          </span>
        </div>

        {/* Student Source Pill */}
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-700 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-navy-600"></span>
          <span className="font-semibold text-navy-950">Student Intake</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500">Identified {triageResult.needs.length} intersecting concern{triageResult.needs.length > 1 ? 's' : ''}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
          {/* Left: Input Nodes */}
          <div className="md:col-span-4 flex flex-col gap-2.5">
            {triageResult.needs.map((need) => {
              return (
                <div
                  key={need.domain}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800">{need.label}</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    Directly selected concern
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile Connector Arrow */}
          <div className="flex md:hidden justify-center py-1 text-slate-400">
            <div className="w-7 h-7 rounded-full bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center shadow-xs">
              <span className="text-xs font-bold">↓</span>
            </div>
          </div>

          {/* Desktop Center: Connecting Flow Indicator */}
          <div className="hidden md:flex md:col-span-2 flex-col items-center justify-center text-slate-400">
            <div className="h-0.5 w-full bg-slate-200 relative flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center shadow-xs">
                <ArrowRight size={14} />
              </div>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 mt-2">Unified Care</span>
          </div>

          {/* Right: Coordinated Hub */}
          <div className="md:col-span-6 bg-white p-4 sm:p-5 rounded-xl border-2 border-brand-500 shadow-xs relative">
            <div className="absolute -top-3 left-4 px-2 py-0.5 bg-brand-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">
              Primary Coordination Hub
            </div>
            <div className="flex items-start gap-3 mt-1">
              <div className="w-10 h-10 rounded-lg bg-navy-900 text-white flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-brand-200" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-navy-950">
                  {triageResult.recommendedPrimaryRoute}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Single primary point of contact coordinating with{' '}
                  <span className="font-semibold text-slate-800">
                    {triageResult.recommendedAdditionalRoutes.join(' & ')}
                  </span>
                  .
                </p>
                <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                  <ShieldCheck size={13} />
                  <span>One case file. No repeating your situation.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action footer */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 px-3 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ← Modify Selections
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={onProceed}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-navy-900 text-white font-medium text-sm hover:bg-navy-800 active:bg-navy-950 shadow-xs transition-colors cursor-pointer"
        >
          <span>View Coordinated Support Plan</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
