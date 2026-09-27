import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CareCase, CaseStatus } from '../types/case';
import { Student } from '../types/student';
import { PriorityLevel } from '../types/triage';
import {
  loadStoredCases,
  saveStoredCases,
  loadStoredStudents,
  saveStoredStudents,
  loadActiveStudentId,
  saveActiveStudentId,
  resetToDemoDefaults,
} from '../services/storage';
import {
  createNewCase,
  findDuplicateActiveCase,
  CreateCaseParams,
  updateCaseStatus as updateCaseStatusService,
  updateCaseRouting as updateCaseRoutingService,
  updateCasePriority as updateCasePriorityService,
  acceptCasePlan as acceptCasePlanService,
  addCaseNote as addCaseNoteService,
} from '../services/caseService';

export type UserRole = 'student' | 'staff';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

export interface AppState {
  currentRole: UserRole;
  currentStudentId: string;
  students: Student[];
  cases: CareCase[];
  selectedCaseId: string | null;
  activeView: string; // 'student-intake' | 'student-requests' | 'student-detail' | 'staff-dashboard' | 'staff-queue' | 'staff-detail' | 'staff-reports' | 'staff-settings'
  toasts: ToastMessage[];
  staffUser: {
    name: string;
    role: string;
    department: string;
  };
}

export type AppAction =
  | { type: 'SET_ROLE'; payload: UserRole }
  | { type: 'SET_ACTIVE_STUDENT'; payload: string }
  | { type: 'NAVIGATE'; payload: { view: string; caseId?: string } }
  | { type: 'CREATE_CASE'; payload: CreateCaseParams }
  | { type: 'ACCEPT_PLAN'; payload: { caseId: string } }
  | { type: 'UPDATE_STATUS'; payload: { caseId: string; status: CaseStatus; reason?: string } }
  | {
      type: 'UPDATE_ROUTING';
      payload: { caseId: string; primaryRoute: string; additionalRoutes: string[]; reason: string };
    }
  | { type: 'UPDATE_PRIORITY'; payload: { caseId: string; priority: PriorityLevel; reason: string } }
  | { type: 'ADD_NOTE'; payload: { caseId: string; content: string; isInternalOnly?: boolean } }
  | { type: 'ADD_TOAST'; payload: Omit<ToastMessage, 'id'> }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'RESET_DEMO_DATA' };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ROLE':
      return {
        ...state,
        currentRole: action.payload,
        activeView: action.payload === 'student' ? 'student-intake' : 'staff-dashboard',
      };

    case 'SET_ACTIVE_STUDENT': {
      saveActiveStudentId(action.payload);
      return {
        ...state,
        currentStudentId: action.payload,
      };
    }

    case 'NAVIGATE':
      return {
        ...state,
        activeView: action.payload.view,
        selectedCaseId: action.payload.caseId !== undefined ? action.payload.caseId : state.selectedCaseId,
      };

    case 'CREATE_CASE': {
      // Evaluate triage to check for duplicate active cases
      const triageResult =
        action.payload.triageResult ||
        createNewCase(action.payload, state.cases).triageResult;

      const existingDuplicate = findDuplicateActiveCase(
        action.payload.studentId,
        triageResult,
        state.cases
      );

      if (existingDuplicate) {
        const toast: ToastMessage = {
          id: `toast-${Date.now()}`,
          type: 'info',
          title: 'Active Request Already Exists',
          message: `Case ${existingDuplicate.id} is already active for this issue. Opening your existing request.`,
        };

        return {
          ...state,
          selectedCaseId: existingDuplicate.id,
          activeView: 'student-detail',
          toasts: [...state.toasts, toast],
        };
      }

      const newCase = createNewCase(action.payload, state.cases);
      const updatedCases = [newCase, ...state.cases];
      saveStoredCases(updatedCases);

      const toast: ToastMessage = {
        id: `toast-${Date.now()}`,
        type: 'success',
        title: 'Request Submitted',
        message: `Case ${newCase.id} has been logged and routed to support teams.`,
      };

      return {
        ...state,
        cases: updatedCases,
        selectedCaseId: newCase.id,
        activeView: 'student-detail',
        toasts: [...state.toasts, toast],
      };
    }

    case 'ACCEPT_PLAN': {
      const targetCase = state.cases.find((c) => c.id === action.payload.caseId);
      if (!targetCase) return state;

      const updatedCase = acceptCasePlanService(targetCase, `${state.staffUser.name} (${state.staffUser.role})`);
      const updatedCases = state.cases.map((c) => (c.id === updatedCase.id ? updatedCase : c));
      saveStoredCases(updatedCases);

      const toast: ToastMessage = {
        id: `toast-${Date.now()}`,
        type: 'success',
        title: 'Support Plan Accepted',
        message: `Plan confirmed. Case ${updatedCase.id} moved to Under Review.`,
      };

      return {
        ...state,
        cases: updatedCases,
        toasts: [...state.toasts, toast],
      };
    }

    case 'UPDATE_STATUS': {
      const targetCase = state.cases.find((c) => c.id === action.payload.caseId);
      if (!targetCase) return state;

      const updatedCase = updateCaseStatusService(
        targetCase,
        action.payload.status,
        state.staffUser.name,
        action.payload.reason
      );
      const updatedCases = state.cases.map((c) => (c.id === updatedCase.id ? updatedCase : c));
      saveStoredCases(updatedCases);

      const toast: ToastMessage = {
        id: `toast-${Date.now()}`,
        type: 'info',
        title: 'Status Updated',
        message: `Case ${updatedCase.id} status changed to ${action.payload.status.replace('_', ' ').toUpperCase()}.`,
      };

      return {
        ...state,
        cases: updatedCases,
        toasts: [...state.toasts, toast],
      };
    }

    case 'UPDATE_ROUTING': {
      const targetCase = state.cases.find((c) => c.id === action.payload.caseId);
      if (!targetCase) return state;

      const updatedCase = updateCaseRoutingService(
        targetCase,
        action.payload.primaryRoute,
        action.payload.additionalRoutes,
        state.staffUser.name,
        action.payload.reason
      );
      const updatedCases = state.cases.map((c) => (c.id === updatedCase.id ? updatedCase : c));
      saveStoredCases(updatedCases);

      const toast: ToastMessage = {
        id: `toast-${Date.now()}`,
        type: 'success',
        title: 'Routing Updated',
        message: `Primary route reassigned to ${action.payload.primaryRoute}.`,
      };

      return {
        ...state,
        cases: updatedCases,
        toasts: [...state.toasts, toast],
      };
    }

    case 'UPDATE_PRIORITY': {
      const targetCase = state.cases.find((c) => c.id === action.payload.caseId);
      if (!targetCase) return state;

      const updatedCase = updateCasePriorityService(
        targetCase,
        action.payload.priority,
        state.staffUser.name,
        action.payload.reason
      );
      const updatedCases = state.cases.map((c) => (c.id === updatedCase.id ? updatedCase : c));
      saveStoredCases(updatedCases);

      const toast: ToastMessage = {
        id: `toast-${Date.now()}`,
        type: 'warning',
        title: 'Priority Updated',
        message: `Priority set to ${action.payload.priority.toUpperCase()}.`,
      };

      return {
        ...state,
        cases: updatedCases,
        toasts: [...state.toasts, toast],
      };
    }

    case 'ADD_NOTE': {
      const targetCase = state.cases.find((c) => c.id === action.payload.caseId);
      if (!targetCase) return state;

      const updatedCase = addCaseNoteService(
        targetCase,
        state.staffUser.name,
        state.staffUser.role,
        action.payload.content,
        action.payload.isInternalOnly
      );
      const updatedCases = state.cases.map((c) => (c.id === updatedCase.id ? updatedCase : c));
      saveStoredCases(updatedCases);

      const toast: ToastMessage = {
        id: `toast-${Date.now()}`,
        type: 'info',
        title: 'Note Recorded',
        message: 'Case timeline and staff notes updated.',
      };

      return {
        ...state,
        cases: updatedCases,
        toasts: [...state.toasts, toast],
      };
    }

    case 'ADD_TOAST': {
      const toast: ToastMessage = {
        id: `toast-${Date.now()}-${Math.random()}`,
        ...action.payload,
      };
      return {
        ...state,
        toasts: [...state.toasts, toast],
      };
    }

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };

    case 'RESET_DEMO_DATA': {
      const resetData = resetToDemoDefaults();
      const toast: ToastMessage = {
        id: `toast-${Date.now()}`,
        type: 'info',
        title: 'Demo Data Restored',
        message: 'Cases and student data reset to clean initial demo state.',
      };
      return {
        ...state,
        cases: resetData.cases,
        students: resetData.students,
        currentStudentId: 'STU-1042',
        selectedCaseId: null,
        toasts: [...state.toasts, toast],
      };
    }

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  activeStudent: Student;
  activeCase: CareCase | undefined;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, () => {
    const cases = loadStoredCases();
    const students = loadStoredStudents();
    const currentStudentId = loadActiveStudentId();

    return {
      currentRole: 'student' as UserRole,
      currentStudentId,
      students,
      cases,
      selectedCaseId: null,
      activeView: 'student-intake',
      toasts: [],
      staffUser: {
        name: 'Sarah Jenkins',
        role: 'Lead Triage Officer',
        department: 'Student Support Services',
      },
    };
  });

  // Keep localStorage updated if cases or students change
  useEffect(() => {
    saveStoredCases(state.cases);
  }, [state.cases]);

  useEffect(() => {
    saveStoredStudents(state.students);
  }, [state.students]);

  const activeStudent =
    state.students.find((s) => s.id === state.currentStudentId) || state.students[0];

  const activeCase = state.selectedCaseId
    ? state.cases.find((c) => c.id === state.selectedCaseId)
    : undefined;

  return (
    <AppContext.Provider value={{ state, dispatch, activeStudent, activeCase }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
