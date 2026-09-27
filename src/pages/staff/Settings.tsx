import React from 'react';
import { useApp } from '../../app/AppContext';
import { SUPPORT_DOMAINS, SUPPORT_SERVICES } from '../../data/supportCatalog';
import {
  Cpu,
  ShieldCheck,
  Layers,
  Sliders,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Info,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { dispatch } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-navy-950">System Configuration & Governance</h1>
        <p className="text-xs text-slate-600 mt-1">
          Review operational support domains, priority thresholds, deterministic triage parameters, and compliance policies.
        </p>
      </div>

      {/* Section 1: AI Engine & Classification Status */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center">
              <Cpu size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-navy-950">Classification & Triage Engine</h3>
              <p className="text-xs text-slate-500">Inference mechanism and rule execution</p>
            </div>
          </div>

          {/* Genuine AI Status Badge (Non-negotiable requirement) */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Local Fallback Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-800 block">Execution Mode:</span>
            <p className="text-slate-600 leading-relaxed">
              Deterministic offline pattern matching & keyword semantic weighting. Zero dependence on external cloud LLM APIs ensures 100% offline availability and student data containment.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-800 block">Human-in-the-Loop Safeguard:</span>
            <p className="text-slate-600 leading-relaxed">
              Staff review is mandatory for all recommended support plans. Staff can override primary routes, additional liaisons, and case priority levels with full audit trail logging.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Priority Threshold Rules */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center">
              <Sliders size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-navy-950">Configured Priority Rules</h3>
              <p className="text-xs text-slate-500">Thresholds triggering automated escalation</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/50 flex items-start gap-3">
            <div className="px-2 py-0.5 rounded font-bold bg-rose-600 text-white text-[10px] mt-0.5">
              URGENT
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-rose-950">Immediate Safeguarding & Danger Signals</p>
              <p className="text-rose-800">
                Triggered if student mentions immediate physical safety hazards, self-harm signals, eviction on current night, or extreme violence. Bypasses regular queue directly to Urgent Response Duty Dean.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50 flex items-start gap-3">
            <div className="px-2 py-0.5 rounded font-bold bg-amber-600 text-white text-[10px] mt-0.5">
              PRIORITY
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-amber-950">Multi-Need Compounding Concerns</p>
              <p className="text-amber-800">
                Triggered when two or more distinct domains intersect (e.g. Academic + Financial or Financial + Housing), or when impending academic exclusion / fee census deadlines are detected.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3">
            <div className="px-2 py-0.5 rounded font-bold bg-slate-500 text-white text-[10px] mt-0.5">
              NORMAL
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-slate-900">Standard Departmental Intake</p>
              <p className="text-slate-600">
                Standard single-domain inquiries routed directly to specialist advisors (Academic Hub, Financial Aid, Careers, etc.) with normal 24-48h SLA response.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Registered Support Domains Catalog */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center">
              <Layers size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-navy-950">Configured Support Domains</h3>
              <p className="text-xs text-slate-500">7 primary non-overlapping university service domains</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(Object.keys(SUPPORT_DOMAINS) as Array<keyof typeof SUPPORT_DOMAINS>).map(
            (domainKey) => {
              const meta = SUPPORT_DOMAINS[domainKey];
              return (
                <div
                  key={domainKey}
                  className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-navy-950">{meta.label}</span>
                    <span className="text-[10px] font-mono text-slate-400">domain:{meta.id}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                    {meta.description}
                  </p>
                  <p className="text-[10px] text-brand-700 font-medium pt-1">
                    Primary: {meta.primaryDepartment}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Section 4: Non-Diagnostic & Student Privacy Statement */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <ShieldCheck size={18} className="text-brand-600" />
          <h3 className="font-bold text-sm text-navy-950">
            University Privacy & Non-Diagnostic Principles
          </h3>
        </div>

        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>
            <strong>1. No Clinical Diagnosis:</strong> UniCare strictly identifies operational support needs and observable behaviors (such as missing coursework or financial strain). The platform never infers, records, or displays clinical psychological labels.
          </p>
          <p>
            <strong>2. Clear Data Separation:</strong> Intake responses distinguish between student-reported statements and system-derived classifications. Students are shown exactly what will be shared prior to case creation.
          </p>
          <p>
            <strong>3. Controlled Coordination:</strong> Cross-departmental coordination is restricted to designated triage staff. Sensitive notes can be flagged as internal-only.
          </p>
        </div>
      </div>

      {/* Reset Demo Data */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-800">Demo State Reset</h4>
          <p className="text-[11px] text-slate-500">
            Restore initial demo cases, fictional student profiles, and clear browser local storage.
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Reset all cases to initial demo state?')) {
              dispatch({ type: 'RESET_DEMO_DATA' });
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <RotateCcw size={13} />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </div>
  );
};
