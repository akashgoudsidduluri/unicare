import React from 'react';
import { useApp } from '../../app/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Clock, PlusCircle, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

export const MyRequests: React.FC = () => {
  const { state, dispatch, activeStudent } = useApp();

  const studentCases = state.cases.filter((c) => c.studentId === state.currentStudentId);
  const activeCase = studentCases.find((c) => c.status === 'open' || c.status === 'under_review');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">My Support Requests</h1>
          <p className="text-xs text-slate-600 mt-1">
            Track status, review recommendations, and view staff coordination progress for{' '}
            <span className="font-semibold text-slate-900">{activeStudent.name}</span> ({activeStudent.id}).
          </p>
        </div>

        {activeCase ? (
          <button
            onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'student-intake' } })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer self-start sm:self-center"
          >
            <PlusCircle size={14} />
            <span>Submit Different Concern</span>
          </button>
        ) : (
          <button
            onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'student-intake' } })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-lg text-xs font-semibold hover:bg-navy-800 transition-colors shadow-xs cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>New Support Request</span>
          </button>
        )}
      </div>

      {/* Active Case Banner */}
      {activeCase && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs animate-fadeIn">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">Active Request In Progress</span>
            </div>
            <h3 className="text-sm font-semibold text-amber-950">
              You already have an active support request
            </h3>
            <p className="text-xs text-amber-800">
              Case <span className="font-mono font-medium">{activeCase.id}</span> is currently{' '}
              <span className="font-semibold capitalize">{activeCase.status.replace('_', ' ')}</span> ({activeCase.routing.primaryRoute}).
            </p>
          </div>
          <button
            onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'student-detail', caseId: activeCase.id } })}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <span>View My Request</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {studentCases.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FileText size={24} />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No requests submitted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            If you need assistance with coursework, fees, wellbeing, or accommodation, start a guided intake.
          </p>
          <button
            onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'student-intake' } })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-lg text-xs font-semibold hover:bg-navy-800"
          >
            <span>Start Guided Intake</span>
            <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {studentCases.map((c) => (
            <div
              key={c.id}
              onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'student-detail', caseId: c.id } })}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-brand-500 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-navy-900">{c.id}</span>
                  <StatusBadge status={c.status} size="sm" />
                  <PriorityBadge priority={c.priority} size="sm" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock size={13} />
                  <span>Submitted {new Date(c.createdAt).toLocaleDateString()} at {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">
                    {c.triageResult.summary}
                  </p>
                  <p className="text-xs text-slate-500">
                    Primary Route:{' '}
                    <span className="font-medium text-slate-700">{c.routing.primaryRoute}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-brand-700 group-hover:translate-x-0.5 transition-transform self-end sm:self-center">
                  <span>View Details</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
