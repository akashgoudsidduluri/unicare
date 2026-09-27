import React, { useMemo } from 'react';
import { useApp } from '../../app/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { SUPPORT_DOMAINS } from '../../data/supportCatalog';
import { FileBarChart, PieChart as PieIcon, Layers, TrendingUp } from 'lucide-react';

export const Reports: React.FC = () => {
  const { state } = useApp();
  const { cases } = state;

  // 1. Cases by Priority (from actual cases)
  const priorityData = useMemo(() => {
    const counts = { normal: 0, priority: 0, urgent: 0 };
    cases.forEach((c) => {
      counts[c.priority] = (counts[c.priority] || 0) + 1;
    });
    return [
      { name: 'Normal', count: counts.normal, color: '#64748b' },
      { name: 'Priority', count: counts.priority, color: '#f59e0b' },
      { name: 'Urgent', count: counts.urgent, color: '#e11d48' },
    ];
  }, [cases]);

  // 2. Cases by Status (from actual cases)
  const statusData = useMemo(() => {
    const counts = { open: 0, under_review: 0, resolved: 0, closed: 0 };
    cases.forEach((c) => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return [
      { name: 'Open', value: counts.open, color: '#3b82f6' },
      { name: 'Under Review', value: counts.under_review, color: '#f59e0b' },
      { name: 'Resolved', value: counts.resolved, color: '#10b981' },
      { name: 'Closed', value: counts.closed, color: '#94a3b8' },
    ];
  }, [cases]);

  // 3. Cases by Support Category / Domain (from actual cases)
  const domainData = useMemo(() => {
    const map: Record<string, number> = {};
    Object.keys(SUPPORT_DOMAINS).forEach((k) => {
      map[k] = 0;
    });

    cases.forEach((c) => {
      c.triageResult.needs.forEach((n) => {
        if (map[n.domain] !== undefined) {
          map[n.domain]++;
        }
      });
    });

    return Object.entries(map).map(([domain, count]) => ({
      name: SUPPORT_DOMAINS[domain as keyof typeof SUPPORT_DOMAINS]?.shortLabel || domain,
      count,
    }));
  }, [cases]);

  // 4. Cases by Primary Route
  const routeData = useMemo(() => {
    const map: Record<string, number> = {};
    cases.forEach((c) => {
      const r = c.routing.primaryRoute;
      map[r] = (map[r] || 0) + 1;
    });

    return Object.entries(map)
      .map(([route, count]) => ({
        route: route.length > 28 ? `${route.substring(0, 26)}...` : route,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [cases]);

  // Multi-need percentage calculation
  const multiNeedCases = cases.filter((c) => c.triageResult.isMultiNeed).length;
  const multiNeedRate = cases.length > 0 ? Math.round((multiNeedCases / cases.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Analytics & Workload Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-bold text-navy-950">University Triage Reports</h1>
          <p className="text-xs text-slate-600 mt-1">
            All charts are computed dynamically from active and archived cases in local state ({cases.length} total cases).
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-lg border border-slate-200 text-xs shadow-xs">
          <Layers size={16} className="text-indigo-600" />
          <span>
            Multi-Need Coordination Rate: <strong className="text-navy-950 font-bold">{multiNeedRate}%</strong>
          </span>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Domain Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-navy-950">Demand by Support Domain</h3>
            <span className="text-[10px] text-slate-400 font-mono">Real Case Frequencies</span>
          </div>
          <p className="text-xs text-slate-500">
            Frequency of student needs identified during guided intake.
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" angle={-25} textAnchor="end" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#102A43" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Status Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-navy-950">Operational Case Status</h3>
            <span className="text-[10px] text-slate-400 font-mono">Pipeline Distribution</span>
          </div>
          <p className="text-xs text-slate-500">
            Proportion of cases currently open, actively under review, or resolved.
          </p>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }: any) =>
                    `${name} (${((percent || 0) * 100).toFixed(0)}%)`
                  }
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Priority Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-navy-950">Cases by Priority Level</h3>
            <span className="text-[10px] text-slate-400 font-mono">Triage Severity</span>
          </div>
          <p className="text-xs text-slate-500">
            Urgent cases trigger immediate duty safeguarding; priority triggers joint coordination.
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Primary Routing Allocation */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-navy-950">Primary Routing Destinations</h3>
            <span className="text-[10px] text-slate-400 font-mono">Department Allocation</span>
          </div>
          <p className="text-xs text-slate-500">
            Volume of cases coordinated through each designated department hub.
          </p>
          <div className="space-y-3 pt-2">
            {routeData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{item.route}</span>
                  <span className="font-mono text-slate-500 text-[11px]">{item.count} cases</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-600 h-full rounded-full"
                    style={{
                      width: `${cases.length > 0 ? (item.count / cases.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
