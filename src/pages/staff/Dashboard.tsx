import React from 'react';
import { useApp } from '../../app/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { StudentAvatar } from '../../components/common/StudentAvatar';
import {
  Inbox,
  AlertCircle,
  Clock,
  CheckCircle,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { SUPPORT_DOMAINS } from '../../data/supportCatalog';

export const Dashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const { cases, students } = state;

  // Real calculated metrics from actual cases (NO hardcoded fake numbers!)
  const openCount = cases.filter((c) => c.status === 'open').length;
  const underReviewCount = cases.filter((c) => c.status === 'under_review').length;
  const resolvedCount = cases.filter((c) => c.status === 'resolved').length;
  const priorityCount = cases.filter((c) => c.priority === 'priority').length;

  // Actionable cases (status === 'open') sorted newest first
  const actionableUrgentCases = cases
    .filter((c) => c.priority === 'urgent' && c.status === 'open')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const actionablePriorityCases = cases
    .filter((c) => c.priority === 'priority' && c.status === 'open')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const actionableNormalCases = cases
    .filter((c) => c.priority === 'normal' && c.status === 'open')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Highest-priority actionable case for headline alert
  const headlineCase =
    actionableUrgentCases[0] ||
    actionablePriorityCases[0] ||
    actionableNormalCases[0] ||
    null;

  const headlineStudent = headlineCase
    ? students.find((s) => s.id === headlineCase.studentId)
    : null;

  const actionableUrgentCount = actionableUrgentCases.length;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const casesTodayCount = cases.filter((c) => new Date(c.createdAt).getTime() >= startOfToday).length;

  // Multi-need cases
  const multiNeedCount = cases.filter((c) => c.triageResult.isMultiNeed).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Student Operations Console
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-slate-600">Deterministic Triage Engine Active</span>
          </div>
          <h1 className="text-2xl font-bold text-navy-950">Overview & Case Metrics</h1>
          <p className="text-xs text-slate-600 mt-1">
            Live case tracking across multi-domain intake, case coordination, and support status (demo data).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'staff-queue' } })}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-900 text-white rounded-lg text-xs font-semibold hover:bg-navy-800 transition-colors shadow-xs"
          >
            <Inbox size={15} />
            <span>Open Triage Queue</span>
          </button>
        </div>
      </div>

      {/* Actionable Priority Headline Alert Banner */}
      {headlineCase && (
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn ${
            headlineCase.priority === 'urgent'
              ? 'bg-rose-50 border-rose-200'
              : headlineCase.priority === 'priority'
              ? 'bg-amber-50 border-amber-200'
              : 'bg-blue-50/70 border-blue-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white ${
                headlineCase.priority === 'urgent'
                  ? 'bg-rose-600'
                  : headlineCase.priority === 'priority'
                  ? 'bg-amber-600'
                  : 'bg-navy-900'
              }`}
            >
              {headlineCase.priority === 'urgent' ? (
                <AlertCircle size={20} />
              ) : headlineCase.priority === 'priority' ? (
                <AlertTriangle size={20} />
              ) : (
                <Inbox size={20} />
              )}
            </div>
            <div>
              <p
                className={`text-xs font-bold uppercase tracking-wide ${
                  headlineCase.priority === 'urgent'
                    ? 'text-rose-900'
                    : headlineCase.priority === 'priority'
                    ? 'text-amber-950'
                    : 'text-navy-950'
                }`}
              >
                {headlineCase.priority === 'urgent' &&
                  `IMMEDIATE ACTION REQUIRED (${actionableUrgentCases.length} Urgent Case${
                    actionableUrgentCases.length > 1 ? 's' : ''
                  })`}
                {headlineCase.priority === 'priority' &&
                  `PRIORITY CASE REQUIRES REVIEW (${actionablePriorityCases.length} Priority Case${
                    actionablePriorityCases.length > 1 ? 's' : ''
                  })`}
                {headlineCase.priority === 'normal' &&
                  `CASES AWAITING INITIAL REVIEW (${actionableNormalCases.length} Open Case${
                    actionableNormalCases.length > 1 ? 's' : ''
                  })`}
              </p>
              <p
                className={`text-xs mt-0.5 ${
                  headlineCase.priority === 'urgent'
                    ? 'text-rose-700'
                    : headlineCase.priority === 'priority'
                    ? 'text-amber-800'
                    : 'text-slate-600'
                }`}
              >
                {headlineCase.priority === 'urgent' && (
                  <>
                    <span className="font-semibold text-rose-900">
                      {headlineStudent?.name || headlineCase.studentId} —{' '}
                      {headlineCase.triageResult.needs[0]?.label || 'Urgent Safeguarding'}
                    </span>
                    : Immediate human safeguarding review required.
                  </>
                )}
                {headlineCase.priority === 'priority' && (
                  <>
                    <span className="font-semibold text-amber-950">
                      {headlineStudent?.name || headlineCase.studentId} —{' '}
                      {headlineCase.triageResult.needs.map((n) => n.label.split(' ')[0]).join(' + ')}
                    </span>
                    : Elevated support needs require staff review and care plan coordination.
                  </>
                )}
                {headlineCase.priority === 'normal' && (
                  <>
                    <span className="font-semibold text-navy-900">
                      {headlineStudent?.name || headlineCase.studentId} —{' '}
                      {headlineCase.triageResult.summary}
                    </span>
                    : New student support request awaiting initial review.
                  </>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              dispatch({ type: 'NAVIGATE', payload: { view: 'staff-detail', caseId: headlineCase.id } })
            }
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer text-white ${
              headlineCase.priority === 'urgent'
                ? 'bg-rose-600 hover:bg-rose-700'
                : headlineCase.priority === 'priority'
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-navy-900 hover:bg-navy-800'
            }`}
          >
            {headlineCase.priority === 'urgent' && 'Review Urgent Case'}
            {headlineCase.priority === 'priority' && 'Review Priority Case'}
            {headlineCase.priority === 'normal' && 'Review Open Case'}
          </button>
        </div>
      )}

      {/* Real Calculated KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Open Cases */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Open Cases
            </span>
            <Inbox size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-navy-950 mt-2">{openCount}</div>
          <p className="text-[10px] text-slate-500 mt-1">Pending initial review</p>
        </div>

        {/* Metric 2: Under Review */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Under Review
            </span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-navy-950 mt-2">{underReviewCount}</div>
          <p className="text-[10px] text-slate-500 mt-1">Care plans in action</p>
        </div>

        {/* Metric 3: Priority */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Priority
            </span>
            <AlertTriangle size={16} className="text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-700 mt-2">{priorityCount}</div>
          <p className="text-[10px] text-slate-500 mt-1">Multi-domain & elevated</p>
        </div>

        {/* Metric 4: Urgent */}
        <div className={`p-4 rounded-xl border shadow-xs ${actionableUrgentCount > 0 ? 'bg-rose-50/50 border-rose-200' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${actionableUrgentCount > 0 ? 'text-rose-800' : 'text-slate-500'}`}>
              Urgent
            </span>
            <AlertCircle size={16} className={actionableUrgentCount > 0 ? 'text-rose-600' : 'text-slate-400'} />
          </div>
          <div className={`text-2xl sm:text-3xl font-bold mt-2 ${actionableUrgentCount > 0 ? 'text-rose-700' : 'text-slate-700'}`}>
            {actionableUrgentCount}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {actionableUrgentCount > 0 ? 'Requires immediate contact' : 'All urgent reviewed'}
          </p>
        </div>

        {/* Metric 5: Cases Today */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Cases Today
            </span>
            <Calendar size={16} className="text-brand-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-navy-950 mt-2">{casesTodayCount}</div>
          <p className="text-[10px] text-slate-500 mt-1">Logged past 24 hours</p>
        </div>

        {/* Metric 6: Coordinated (Multi-Need) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Coordinated
            </span>
            <Layers size={16} className="text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-indigo-900 mt-2">{multiNeedCount}</div>
          <p className="text-[10px] text-slate-500 mt-1">Cross-department cases</p>
        </div>
      </div>

      {/* Two Column Layout: Recent Active Cases & System Routing Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Triage Cases Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-navy-950">Active Incoming & Triage Cases</h3>
              <p className="text-xs text-slate-500">Live feed of student intake cases requiring operational oversight</p>
            </div>
            <button
              onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'staff-queue' } })}
              className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
            >
              <span>View All ({cases.length})</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3">Case ID</th>
                  <th className="py-3 px-3">Situation & Primary Need</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {cases.slice(0, 6).map((c) => {
                  const student = students.find((s) => s.id === c.studentId);
                  return (
                    <tr
                      key={c.id}
                      onClick={() =>
                        dispatch({ type: 'NAVIGATE', payload: { view: 'staff-detail', caseId: c.id } })
                      }
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <StudentAvatar
                            gender={student?.avatarGender || 'neutral'}
                            name={student?.name || c.studentId}
                            size="sm"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 block">
                              {student?.name || c.studentId}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {c.studentId}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-navy-900">{c.id}</td>
                      <td className="py-3 px-3 max-w-xs">
                        <p className="font-medium text-slate-800 line-clamp-1">
                          {c.triageResult.summary}
                        </p>
                        <span className="text-[10px] text-slate-500 font-mono block truncate">
                          Route: {c.routing.primaryRoute}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <PriorityBadge priority={c.priority} size="sm" />
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={c.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-xs font-semibold text-brand-600 hover:text-brand-800">
                          Review →
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Support Domain Volume Distribution (Real data!) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <h3 className="font-bold text-sm text-navy-950 pb-2 border-b border-slate-100 mb-4">
              Case Volume by Support Domain
            </h3>

            <div className="space-y-3">
              {(Object.keys(SUPPORT_DOMAINS) as Array<keyof typeof SUPPORT_DOMAINS>).map(
                (domainKey) => {
                  const meta = SUPPORT_DOMAINS[domainKey];
                  const count = cases.filter((c) =>
                    c.triageResult.needs.some((n) => n.domain === domainKey)
                  ).length;
                  const percentage =
                    cases.length > 0 ? Math.round((count / cases.length) * 100) : 0;

                  return (
                    <div key={domainKey} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">{meta.shortLabel}</span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-navy-800 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
              Coordinated routing clusters multi-domain referrals under Student Support for single-point staff review.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
