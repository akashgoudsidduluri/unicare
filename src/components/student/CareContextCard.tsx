import React from 'react';
import { TriageResult } from '../../types/triage';
import { Student } from '../../types/student';
import { StudentAvatar } from '../common/StudentAvatar';
import { PriorityBadge } from '../common/PriorityBadge';
import { CareCase } from '../../types/case';
import {
  FileText,
  Shield,
  HelpCircle,
  ArrowRight,
  Edit2,
  CheckCircle,
  Building2,
  ListChecks,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { SUPPORT_DOMAINS } from '../../data/supportCatalog';

interface CareContextCardProps {
  student: Student;
  selectedConcerns: string[];
  clarifications: Record<string, string[]>;
  freeText?: string;
  triageResult: TriageResult;
  onEdit: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  duplicateActiveCase?: CareCase | null;
  onViewExisting?: (caseId: string) => void;
}

export const CareContextCard: React.FC<CareContextCardProps> = ({
  student,
  selectedConcerns,
  clarifications,
  freeText,
  triageResult,
  onEdit,
  onConfirm,
  isSubmitting = false,
  duplicateActiveCase,
  onViewExisting,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
      {/* Header bar */}
      <div className="bg-navy-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-navy-800 text-brand-300 flex items-center justify-center">
            <FileText size={16} />
          </div>
          <div>
            <h3 className="font-semibold text-sm tracking-wide uppercase text-slate-200">
              Care Context & Handoff Summary
            </h3>
            <p className="text-[11px] text-slate-400">
              Actionable context prepared for university support staff
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-navy-800 px-2.5 py-1 rounded border border-navy-700">
            <StudentAvatar gender={student.avatarGender} name={student.name} size="sm" />
            <div className="text-left text-xs">
              <span className="font-semibold text-white">{student.name}</span>
              <span className="text-[10px] text-slate-300 block">{student.id}</span>
            </div>
          </div>
          <PriorityBadge priority={triageResult.priority} size="sm" />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Student Privacy & Transparency Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-start gap-3">
          <Shield size={18} className="text-brand-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-800">Your privacy is respected.</span>{' '}
            Here is what will be shared with the designated support advisors. UniCare does not infer
            medical diagnoses or share private academic transcripts without your explicit consent.
          </div>
        </div>

        {/* Two-Column Comparison: You told us vs We understood */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: You told us */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  What you shared
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Direct Student Input</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Selected Concern Areas:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedConcerns.map((c, i) => (
                      <span
                        key={i}
                        className="inline-block px-2.5 py-1 text-xs rounded-md bg-slate-100 text-slate-800 font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {Object.keys(clarifications).length > 0 && (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Specific Details:
                    </label>
                    <ul className="text-xs text-slate-700 list-disc list-inside space-y-0.5">
                      {Object.values(clarifications)
                        .flat()
                        .map((item, idx) => (
                          <li key={idx} className="capitalize">
                            {item.replace(/^[a-z]+-/, '').replace(/-/g, ' ')}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {freeText && freeText.trim().length > 0 ? (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Your Additional Note:
                    </label>
                    <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 p-2.5 rounded italic">
                      "{freeText}"
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic">No free text provided.</div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: We understood */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  What UniCare understood
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Triage basis: Student-selected + contextual signals</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Situation Summary:
                  </label>
                  <p className="text-xs font-semibold text-navy-950 bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
                    {triageResult.summary}
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Identified Support Domains:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {triageResult.needs.map((n) => (
                      <span
                        key={n.domain}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-semibold border ${
                          SUPPORT_DOMAINS[n.domain]?.colorTheme.badge || 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {n.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Detected Signals:
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {triageResult.signals.slice(0, 5).map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 text-slate-600 rounded font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Recommended Support Plan & Why This Plan */}
        <div className="border border-slate-200 rounded-xl p-5 bg-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recommended Support Plan
            </span>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Human-in-the-Loop Orchestration
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-500 font-medium block">
                  Primary Coordination Route:
                </span>
                <div className="flex items-center gap-2 mt-1 text-sm font-bold text-navy-950">
                  <Building2 size={16} className="text-brand-600" />
                  {triageResult.recommendedPrimaryRoute}
                </div>
              </div>

              {triageResult.recommendedAdditionalRoutes.length > 0 && (
                <div>
                  <span className="text-xs text-slate-500 font-medium block">
                    Additional Coordinated Teams:
                  </span>
                  <ul className="mt-1 text-xs text-slate-700 space-y-1">
                    {triageResult.recommendedAdditionalRoutes.map((route, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                        {route}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <span className="text-xs text-slate-500 font-medium block">
                  Suggested Next Action:
                </span>
                <div className="mt-1 text-xs font-medium text-slate-800 bg-slate-50 p-2.5 rounded border border-slate-200 flex items-start gap-2">
                  <ListChecks size={15} className="text-brand-600 shrink-0 mt-0.5" />
                  <span>{triageResult.suggestedNextAction}</span>
                </div>
              </div>
            </div>

            {/* Explainability: "Why this plan?" */}
            <div className="bg-brand-50/50 border border-brand-100 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-900 mb-2">
                  <HelpCircle size={15} className="text-brand-600" />
                  Why this plan?
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {triageResult.reasoning}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-brand-100 text-[11px] text-slate-500 flex items-center gap-1.5">
                <UserCheck size={14} className="text-brand-700" />
                <span>UniCare recommends a pathway. University staff review and confirm the next step.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Active Notice if already open */}
        {duplicateActiveCase && (
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-900">
                  You already have an active support request covering this issue
                </p>
                <p className="text-xs text-amber-800 mt-0.5">
                  Case <span className="font-mono font-medium">{duplicateActiveCase.id}</span> is currently{' '}
                  <span className="font-semibold capitalize">{duplicateActiveCase.status.replace('_', ' ')}</span>. To prevent redundant queues, UniCare does not create multiple active cases for the same concern.
                </p>
              </div>
            </div>
            {onViewExisting && (
              <button
                type="button"
                onClick={() => onViewExisting(duplicateActiveCase.id)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-200/80 hover:bg-amber-300 rounded-md transition-colors cursor-pointer shrink-0"
              >
                <span>View My Request</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        )}

        {/* Submission Controls */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onEdit}
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 size={14} />
            <span>Edit My Input</span>
          </button>

          {duplicateActiveCase ? (
            <button
              type="button"
              onClick={() => onViewExisting && onViewExisting(duplicateActiveCase.id)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <ArrowRight size={16} />
              <span>View Existing Active Request</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 active:bg-navy-950 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Creating Request...</span>
              ) : (
                <>
                  <CheckCircle size={16} />
                  <span>Create Support Request</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
