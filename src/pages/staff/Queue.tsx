import React, { useState, useMemo } from 'react';
import { useApp } from '../../app/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { StudentAvatar } from '../../components/common/StudentAvatar';
import { PriorityLevel } from '../../types/triage';
import { CaseStatus } from '../../types/case';
import { SUPPORT_DOMAINS } from '../../data/supportCatalog';
import {
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Clock,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const Queue: React.FC = () => {
  const { state, dispatch } = useApp();
  const { cases, students } = state;

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority' | 'student'>('newest');

  // Filtered & sorted cases
  const filteredCases = useMemo(() => {
    return cases
      .filter((c) => {
        // Search filter (Case ID, Student ID, student name, request summary, free text)
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const student = students.find((s) => s.id === c.studentId);
          const studentName = student ? student.name.toLowerCase() : '';
          const matches =
            c.id.toLowerCase().includes(term) ||
            c.studentId.toLowerCase().includes(term) ||
            studentName.includes(term) ||
            c.triageResult.summary.toLowerCase().includes(term) ||
            (c.freeText && c.freeText.toLowerCase().includes(term)) ||
            c.selectedConcerns.some((sc) => sc.toLowerCase().includes(term));
          if (!matches) return false;
        }

        // Priority filter
        if (priorityFilter !== 'all' && c.priority !== priorityFilter) {
          return false;
        }

        // Status filter
        if (statusFilter !== 'all' && c.status !== statusFilter) {
          return false;
        }

        // Domain filter
        if (domainFilter !== 'all') {
          const hasDomain = c.triageResult.needs.some((n) => n.domain === domainFilter);
          if (!hasDomain) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'priority') {
          const weight: Record<PriorityLevel, number> = { urgent: 3, priority: 2, normal: 1 };
          return weight[b.priority] - weight[a.priority];
        }
        if (sortBy === 'student') {
          return a.studentId.localeCompare(b.studentId);
        }
        return 0;
      });
  }, [cases, students, searchTerm, priorityFilter, statusFilter, domainFilter, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setPriorityFilter('all');
    setStatusFilter('all');
    setDomainFilter('all');
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    priorityFilter !== 'all' ||
    statusFilter !== 'all' ||
    domainFilter !== 'all' ||
    sortBy !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Triage Queue & Case Management</h1>
          <p className="text-xs text-slate-600 mt-1">
            Displaying {filteredCases.length} of {cases.length} student cases. Select any case to inspect the Care Context and coordinate action.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw size={13} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student, case ID (UC-2026-...), or concern..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
            />
          </div>

          {/* Priority Filter */}
          <div className="md:col-span-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 focus:border-brand-500 bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="priority">Priority</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 focus:border-brand-500 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="under_review">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Domain Filter */}
          <div className="md:col-span-2">
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 focus:border-brand-500 bg-white"
            >
              <option value="all">All Domains</option>
              <option value="academic">Academic</option>
              <option value="financial">Financial</option>
              <option value="wellbeing">Wellbeing</option>
              <option value="housing">Housing</option>
              <option value="accessibility">Accessibility</option>
              <option value="career">Career</option>
              <option value="digital_admin">Digital & Admin</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 focus:border-brand-500 bg-white font-medium"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="priority">Sort: By Priority</option>
              <option value="student">Sort: By Student ID</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredCases.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-sm font-semibold">No cases found matching the criteria</p>
            <p className="text-xs mt-1">Try resetting search filters or keywords</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3">Case ID</th>
                  <th className="py-3 px-3">Primary Need</th>
                  <th className="py-3 px-3">Additional Needs</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Route</th>
                  <th className="py-3 px-3">Submitted</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCases.map((c) => {
                  const student = students.find((s) => s.id === c.studentId);
                  const primaryNeed = c.triageResult.needs[0];
                  const additionalNeeds = c.triageResult.needs.slice(1);

                  return (
                    <tr
                      key={c.id}
                      onClick={() =>
                        dispatch({ type: 'NAVIGATE', payload: { view: 'staff-detail', caseId: c.id } })
                      }
                      className="hover:bg-brand-50/40 cursor-pointer transition-colors group"
                    >
                      {/* Student */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <StudentAvatar
                            gender={student?.avatarGender || 'neutral'}
                            name={student?.name || c.studentId}
                            size="sm"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 block group-hover:text-brand-700 transition-colors">
                              {student?.name || c.studentId}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {c.studentId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Case ID */}
                      <td className="py-3.5 px-3 font-mono font-bold text-navy-950">{c.id}</td>

                      {/* Primary Need */}
                      <td className="py-3.5 px-3">
                        {primaryNeed ? (
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              SUPPORT_DOMAINS[primaryNeed.domain]?.colorTheme.badge || 'bg-slate-100'
                            }`}
                          >
                            {primaryNeed.label}
                          </span>
                        ) : (
                          <span className="text-slate-400">General</span>
                        )}
                      </td>

                      {/* Additional Needs */}
                      <td className="py-3.5 px-3">
                        {additionalNeeds.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {additionalNeeds.map((n) => (
                              <span
                                key={n.domain}
                                className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 text-slate-700 font-medium"
                              >
                                {n.label.split(' ')[0]}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">— None —</span>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-3">
                        <PriorityBadge priority={c.priority} size="sm" />
                      </td>

                      {/* Route */}
                      <td className="py-3.5 px-3 max-w-xs truncate text-[11px] font-medium text-slate-800">
                        {c.routing.primaryRoute}
                      </td>

                      {/* Submitted Time */}
                      <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap text-[11px]">
                        {new Date(c.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        {new Date(c.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <StatusBadge status={c.status} size="sm" />
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 font-semibold text-brand-600 group-hover:text-brand-800">
                          <span>Open</span>
                          <ChevronRight size={14} />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
