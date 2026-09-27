import React, { useState } from 'react';
import { useApp } from '../../app/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { StudentAvatar } from '../../components/common/StudentAvatar';
import { CaseStatus } from '../../types/case';
import { PriorityLevel } from '../../types/triage';
import { SUPPORT_DOMAINS, SUPPORT_SERVICES } from '../../data/supportCatalog';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Edit3,
  Clock,
  MessageSquare,
  Shield,
  Layers,
  Building2,
  FileText,
  User,
  Check,
  X,
  AlertCircle,
  HelpCircle,
  CornerDownRight,
  Send,
} from 'lucide-react';

export const CaseDetail: React.FC = () => {
  const { state, dispatch, activeCase } = useApp();

  // Modals & form state
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [selectedNewRoute, setSelectedNewRoute] = useState('');
  const [routeOverrideReason, setRouteOverrideReason] = useState('');

  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [selectedNewPriority, setSelectedNewPriority] = useState<PriorityLevel>('normal');
  const [priorityOverrideReason, setPriorityOverrideReason] = useState('');

  const [newNoteContent, setNewNoteContent] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(true);

  if (!activeCase) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-sm text-slate-500">No case selected for staff inspection.</p>
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'staff-queue' } })}
          className="mt-4 px-4 py-2 bg-navy-900 text-white rounded-lg text-xs font-semibold"
        >
          Return to Queue
        </button>
      </div>
    );
  }

  const student = state.students.find((s) => s.id === activeCase.studentId);
  const { triageResult, routing, timeline, notes } = activeCase;

  // Handlers
  const handleAcceptPlan = () => {
    dispatch({
      type: 'ACCEPT_PLAN',
      payload: { caseId: activeCase.id },
    });
  };

  const handleStatusChange = (newStatus: CaseStatus) => {
    dispatch({
      type: 'UPDATE_STATUS',
      payload: {
        caseId: activeCase.id,
        status: newStatus,
        reason: `Status manually updated to ${newStatus.replace('_', ' ').toUpperCase()} by triage staff.`,
      },
    });
  };

  const handleOpenRouteModal = () => {
    setSelectedNewRoute(routing.primaryRoute);
    setRouteOverrideReason('');
    setIsRouteModalOpen(true);
  };

  const handleSaveRouteOverride = () => {
    if (!selectedNewRoute || !routeOverrideReason.trim()) return;
    dispatch({
      type: 'UPDATE_ROUTING',
      payload: {
        caseId: activeCase.id,
        primaryRoute: selectedNewRoute,
        additionalRoutes: routing.additionalRoutes,
        reason: routeOverrideReason.trim(),
      },
    });
    setIsRouteModalOpen(false);
  };

  const handleOpenPriorityModal = () => {
    setSelectedNewPriority(activeCase.priority);
    setPriorityOverrideReason('');
    setIsPriorityModalOpen(true);
  };

  const handleSavePriorityOverride = () => {
    if (!priorityOverrideReason.trim()) return;
    dispatch({
      type: 'UPDATE_PRIORITY',
      payload: {
        caseId: activeCase.id,
        priority: selectedNewPriority,
        reason: priorityOverrideReason.trim(),
      },
    });
    setIsPriorityModalOpen(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    dispatch({
      type: 'ADD_NOTE',
      payload: {
        caseId: activeCase.id,
        content: newNoteContent.trim(),
        isInternalOnly: isInternalNote,
      },
    });
    setNewNoteContent('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Back to Queue Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'staff-queue' } })}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Triage Queue</span>
        </button>

        {/* Human Review Status Indicator */}
        <div className="flex items-center gap-2">
          {routing.planAccepted ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>Plan Accepted by {routing.planAcceptedBy || 'Staff'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <AlertTriangle size={13} className="text-amber-600" />
              <span>Human Review Required</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Header / Case Snapshot */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <StudentAvatar
              gender={student?.avatarGender || 'neutral'}
              name={student?.name}
              size="lg"
            />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xl font-bold text-navy-950">{activeCase.id}</span>
                <StatusBadge status={activeCase.status} />
                <PriorityBadge priority={activeCase.priority} />
                {routing.isOverridden && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    Staff Override Active
                  </span>
                )}
              </div>

              <div className="mt-1 text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-semibold text-slate-900">{student?.name}</span>
                <span>•</span>
                <span className="font-mono">{activeCase.studentId}</span>
                <span>•</span>
                <span>{student?.program}</span>
                <span>•</span>
                <span>Year {student?.yearOfStudy}</span>
                <span>•</span>
                <span>{student?.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons for Staff */}
          <div className="flex flex-wrap items-center gap-2">
            {!routing.planAccepted && activeCase.status !== 'resolved' && activeCase.status !== 'closed' && (
              <button
                type="button"
                onClick={handleAcceptPlan}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-900 text-white rounded-lg text-xs font-semibold hover:bg-navy-800 shadow-xs transition-colors cursor-pointer"
              >
                <Check size={14} />
                <span>Accept Support Plan</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenRouteModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Building2 size={13} className="text-slate-500" />
              <span>Change Route</span>
            </button>

            <button
              type="button"
              onClick={handleOpenPriorityModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <AlertTriangle size={13} className="text-slate-500" />
              <span>Change Priority</span>
            </button>

            {/* Status Dropdown */}
            <div className="relative inline-block">
              <select
                value={activeCase.status}
                onChange={(e) => handleStatusChange(e.target.value as CaseStatus)}
                className="py-2 pl-3 pr-8 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 hover:border-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 cursor-pointer"
              >
                <option value="open">Status: Open</option>
                <option value="under_review">Status: Under Review</option>
                <option value="resolved">Status: Resolved</option>
                <option value="closed">Status: Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Operational Next Best Action Banner */}
        <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded bg-brand-100 text-brand-800 flex items-center justify-center shrink-0">
              <Clock size={16} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Next Best Action
              </span>
              <p className="text-xs font-semibold text-slate-900 mt-0.5">
                {activeCase.nextBestAction.action}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] font-semibold text-slate-500 block">Assigned Role</span>
            <span className="text-xs font-medium text-navy-900">
              {activeCase.nextBestAction.suggestedRole}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Care Context & Notes vs Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Care Context, What student said, Identified Needs, Why this route */}
        <div className="lg:col-span-2 space-y-6">
          {/* Actionable Care Context Details */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-navy-950 flex items-center gap-2">
                <FileText size={16} className="text-brand-600" />
                <span>Actionable Care Context Card</span>
              </h3>
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Triage basis: Student-selected + contextual signals
              </span>
            </div>

            {/* Situation Summary */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Triage Situation Summary
              </span>
              <p className="text-sm font-semibold text-navy-950 leading-relaxed">
                {triageResult.summary}
              </p>
            </div>

            {/* Student Request: Selections & Free Text */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Student Request & Stated Concerns
              </span>
              <div className="flex flex-wrap gap-2">
                {activeCase.selectedConcerns.map((concern, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs rounded-md bg-slate-100 text-slate-800 font-medium"
                  >
                    {concern}
                  </span>
                ))}
              </div>

              {activeCase.freeText && (
                <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-lg italic leading-relaxed">
                  "{activeCase.freeText}"
                </div>
              )}
            </div>

            {/* Identified Needs Breakdown */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Identified Support Domains ({triageResult.needs.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {triageResult.needs.map((need) => {
                  const meta = SUPPORT_DOMAINS[need.domain];
                  return (
                    <div
                      key={need.domain}
                      className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold border ${
                            meta?.colorTheme.badge || 'bg-slate-100'
                          }`}
                        >
                          {need.label}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          Direct concern
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{need.rationale}</p>
                      {need.signals.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {need.signals.map((sig, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 text-[9px] bg-slate-100 text-slate-600 rounded font-mono"
                            >
                              {sig}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Coordinated Routing Details */}
            <div className="p-4 bg-navy-50/60 rounded-xl border border-navy-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-950 flex items-center gap-1.5">
                  <Building2 size={15} className="text-brand-600" />
                  Primary Route: {routing.primaryRoute}
                </span>
                {routing.isOverridden && (
                  <span className="text-[10px] text-amber-800 font-semibold bg-amber-100 px-1.5 py-0.5 rounded">
                    Overridden by {routing.overriddenBy}
                  </span>
                )}
              </div>

              {routing.additionalRoutes.length > 0 && (
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Additional Liaisons: </span>
                  {routing.additionalRoutes.join(', ')}
                </div>
              )}

              <div className="text-xs text-slate-700 pt-2 border-t border-navy-100/70">
                <span className="font-semibold text-navy-950 block mb-0.5">Why this route:</span>
                {routing.whyThisPlan}
              </div>

              {routing.overrideReason && (
                <div className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded border border-amber-200">
                  <span className="font-bold">Staff override note: </span>
                  {routing.overrideReason}
                </div>
              )}
            </div>
          </div>

          {/* Staff Case Notes Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="font-bold text-sm text-navy-950 flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="flex items-center gap-2">
                <MessageSquare size={16} className="text-brand-600" />
                <span>Staff Case Notes</span>
              </span>
              <span className="text-xs text-slate-400 font-normal">
                {notes.length} note{notes.length === 1 ? '' : 's'}
              </span>
            </h3>

            {/* Add note input */}
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={2}
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Add operational notes, student contact outcomes, or faculty referral updates..."
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none leading-relaxed"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={(e) => setIsInternalNote(e.target.checked)}
                    className="rounded border-slate-300 text-brand-600"
                  />
                  <span>Internal Staff Only</span>
                </label>

                <button
                  type="submit"
                  disabled={!newNoteContent.trim()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy-900 text-white rounded-lg text-xs font-semibold hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={13} />
                  <span>Add Note</span>
                </button>
              </div>
            </form>

            {/* Notes list */}
            {notes.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{note.author}</span>
                        <span className="text-slate-400 text-[10px]">({note.role})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {note.isInternalOnly && (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                            Internal
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Timeline & Audit Trail */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="font-bold text-sm text-navy-950 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock size={16} className="text-brand-600" />
                <span>Audit & Activity Timeline</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {timeline.length} events
              </span>
            </h3>

            <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {timeline.map((evt) => (
                <div key={evt.id} className="relative">
                  <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-navy-800 ring-4 ring-white" />
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

      {/* MODAL 1: Change Route Override */}
      {isRouteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-navy-950">Change Primary Service Route</h4>
              <button
                onClick={() => setIsRouteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                Select Destination Department:
              </label>
              <select
                value={selectedNewRoute}
                onChange={(e) => setSelectedNewRoute(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
              >
                {SUPPORT_SERVICES.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.domain})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                Staff Override Rationale (Required):
              </label>
              <textarea
                rows={3}
                value={routeOverrideReason}
                onChange={(e) => setRouteOverrideReason(e.target.value)}
                placeholder="e.g. Student confirmed priority is emergency hardship grant before academic extensions..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-brand-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsRouteModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRouteOverride}
                disabled={!selectedNewRoute || !routeOverrideReason.trim()}
                className="px-4 py-1.5 bg-navy-900 text-white rounded-lg text-xs font-semibold hover:bg-navy-800 disabled:opacity-40"
              >
                Confirm Route Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Change Priority Override */}
      {isPriorityModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-navy-950">Modify Case Priority</h4>
              <button
                onClick={() => setIsPriorityModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                Priority Level:
              </label>
              <select
                value={selectedNewPriority}
                onChange={(e) => setSelectedNewPriority(e.target.value as PriorityLevel)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="normal">Normal</option>
                <option value="priority">Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                Justification for Priority Change:
              </label>
              <textarea
                rows={3}
                value={priorityOverrideReason}
                onChange={(e) => setPriorityOverrideReason(e.target.value)}
                placeholder="e.g. Student reported looming eviction deadline within 24 hours..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-brand-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsPriorityModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePriorityOverride}
                disabled={!priorityOverrideReason.trim()}
                className="px-4 py-1.5 bg-navy-900 text-white rounded-lg text-xs font-semibold hover:bg-navy-800 disabled:opacity-40"
              >
                Update Priority
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
