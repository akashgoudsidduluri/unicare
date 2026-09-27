import { PriorityLevel, TriageResult } from './triage';

export type CaseStatus = 'open' | 'under_review' | 'resolved' | 'closed';

export interface TimelineEvent {
  id: string;
  timestamp: string; // ISO string
  type:
    | 'created'
    | 'triage_completed'
    | 'status_changed'
    | 'route_changed'
    | 'priority_changed'
    | 'note_added'
    | 'plan_accepted'
    | 'action_completed';
  title: string;
  description: string;
  author: string;
}

export interface CaseNote {
  id: string;
  timestamp: string;
  author: string;
  role: string;
  content: string;
  isInternalOnly?: boolean;
}

export interface NextBestAction {
  id: string;
  action: string;
  status: 'pending' | 'in_progress' | 'completed';
  suggestedRole: string;
  updatedAt: string;
}

export interface CaseRouting {
  primaryRoute: string;
  additionalRoutes: string[];
  whyThisPlan: string;
  isOverridden?: boolean;
  overriddenBy?: string;
  overrideReason?: string;
  planAccepted?: boolean;
  planAcceptedAt?: string;
  planAcceptedBy?: string;
}

export interface CareCase {
  id: string; // e.g. UC-2026-1042
  studentId: string;
  createdAt: string;
  updatedAt: string;
  status: CaseStatus;
  priority: PriorityLevel;
  selectedConcerns: string[];
  clarifications: Record<string, string[]>;
  freeText?: string;
  triageResult: TriageResult;
  routing: CaseRouting;
  nextBestAction: NextBestAction;
  timeline: TimelineEvent[];
  notes: CaseNote[];
}
