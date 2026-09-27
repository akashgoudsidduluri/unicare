import React from 'react';
import { useApp } from './AppContext';
import { NavBar } from '../components/common/NavBar';
import { ToastContainer } from '../components/common/ToastContainer';

// Student Pages
import { Intake } from '../pages/student/Intake';
import { MyRequests } from '../pages/student/MyRequests';
import { RequestDetail } from '../pages/student/RequestDetail';

// Staff Pages
import { Dashboard } from '../pages/staff/Dashboard';
import { Queue } from '../pages/staff/Queue';
import { CaseDetail } from '../pages/staff/CaseDetail';
import { Reports } from '../pages/staff/Reports';
import { Settings } from '../pages/staff/Settings';

export const AppContent: React.FC = () => {
  const { state } = useApp();

  const renderCurrentView = () => {
    switch (state.activeView) {
      // Student views
      case 'student-intake':
        return <Intake />;
      case 'student-requests':
        return <MyRequests />;
      case 'student-detail':
        return <RequestDetail />;

      // Staff views
      case 'staff-dashboard':
        return <Dashboard />;
      case 'staff-queue':
        return <Queue />;
      case 'staff-detail':
        return <CaseDetail />;
      case 'staff-reports':
        return <Reports />;
      case 'staff-settings':
        return <Settings />;

      default:
        return state.currentRole === 'staff' ? <Dashboard /> : <Intake />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-100 selection:text-brand-900">
      <NavBar />
      <main className="flex-1 pb-16">{renderCurrentView()}</main>
      <ToastContainer />
    </div>
  );
};
