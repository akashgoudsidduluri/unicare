import React from 'react';
import { useApp } from '../../app/AppContext';
import { StudentAvatar } from './StudentAvatar';
import { StudentSelectorDropdown } from './StudentSelectorDropdown';
import {
  Compass,
  LayoutDashboard,
  Inbox,
  FileBarChart,
  Settings as SettingsIcon,
  RotateCcw,
  Sparkles,
  Shield,
  LifeBuoy,
  FileText,
  User,
} from 'lucide-react';

export const NavBar: React.FC = () => {
  const { state, dispatch, activeStudent } = useApp();

  const isStaff = state.currentRole === 'staff';

  const myCasesCount = state.cases.filter((c) => c.studentId === state.currentStudentId).length;
  const pendingStaffCount = state.cases.filter(
    (c) => c.status === 'open' || c.status === 'under_review'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Track Identifier */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                if (isStaff) {
                  dispatch({ type: 'NAVIGATE', payload: { view: 'staff-dashboard' } });
                } else {
                  dispatch({ type: 'NAVIGATE', payload: { view: 'student-intake' } });
                }
              }}
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-navy-900 flex items-center justify-center text-white shadow-xs group-hover:bg-navy-800 transition-colors">
                <LifeBuoy className="w-5 h-5 text-brand-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-navy-950 tracking-tight">UniCare</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 rounded border border-slate-200">
                    Orchestration
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Find the right support. Without navigating the maze.
                </p>
              </div>
            </button>

            {/* Navigation tabs depending on active role */}
            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-200">
              {isStaff ? (
                <>
                  <button
                    onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'staff-dashboard' } })}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      state.activeView === 'staff-dashboard'
                        ? 'bg-navy-50 text-navy-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard size={15} />
                    Overview
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'staff-queue' } })}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors relative ${
                      state.activeView === 'staff-queue' || state.activeView === 'staff-detail'
                        ? 'bg-navy-50 text-navy-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Inbox size={15} />
                    Triage Queue
                    {pendingStaffCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-navy-800 text-white rounded-full">
                        {pendingStaffCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'staff-reports' } })}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      state.activeView === 'staff-reports'
                        ? 'bg-navy-50 text-navy-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <FileBarChart size={15} />
                    Reports
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'staff-settings' } })}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      state.activeView === 'staff-settings'
                        ? 'bg-navy-50 text-navy-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <SettingsIcon size={15} />
                    Settings
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'student-intake' } })}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      state.activeView === 'student-intake'
                        ? 'bg-brand-50 text-brand-800 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Compass size={15} />
                    Get Support
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'NAVIGATE', payload: { view: 'student-requests' } })}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors relative ${
                      state.activeView === 'student-requests' || state.activeView === 'student-detail'
                        ? 'bg-brand-50 text-brand-800 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <FileText size={15} />
                    My Requests
                    {myCasesCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-brand-600 text-white rounded-full">
                        {myCasesCount}
                      </span>
                    )}
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Right Controls: Role Switcher & Student Switcher */}
          <div className="flex items-center gap-3">
            {/* Reset Demo State button */}
            <button
              onClick={() => {
                if (window.confirm('Reset demo state to clean defaults?')) {
                  dispatch({ type: 'RESET_DEMO_DATA' });
                }
              }}
              title="Reset all demo cases and local storage"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              <RotateCcw size={15} />
            </button>

            {/* Mode Switcher Pill */}
            <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex items-center">
              <button
                onClick={() => dispatch({ type: 'SET_ROLE', payload: 'student' })}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  !isStaff
                    ? 'bg-white text-navy-950 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student View
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_ROLE', payload: 'staff' })}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  isStaff
                    ? 'bg-navy-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Staff Console
              </button>
            </div>

            {/* User Profile / Active Student context */}
            {isStaff ? (
              <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-navy-100 text-navy-800 flex items-center justify-center font-bold text-xs border border-navy-200">
                  SJ
                </div>
                <div className="text-left text-xs">
                  <div className="font-semibold text-slate-800 leading-tight">Sarah Jenkins</div>
                  <div className="text-[10px] text-slate-500">Triage Lead</div>
                </div>
              </div>
            ) : (
              <div className="pl-2 border-l border-slate-200">
                <StudentSelectorDropdown
                  students={state.students}
                  activeStudent={activeStudent}
                  onSelectStudent={(id) => dispatch({ type: 'SET_ACTIVE_STUDENT', payload: id })}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
