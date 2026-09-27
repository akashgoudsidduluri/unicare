import { CareCase, CaseNote, CaseStatus, TimelineEvent } from '../types/case';
import { PriorityLevel } from '../types/triage';
import { runTriage, TriageInput } from './triage';

import { TriageResult } from '../types/triage';

export interface CreateCaseParams {
  studentId: string;
  studentName: string;
  selectedConcerns: string[];
  clarifications: Record<string, string[]>;
  freeText?: string;
  triageResult?: TriageResult;
}

/**
 * Checks if a student already has an active (open / under_review) case covering essentially the same issue.
 * Allows new cases when previous cases are resolved/closed, or when the new issue is genuinely distinct.
 */
export function findDuplicateActiveCase(
  studentId: string,
  newTriageResult: TriageResult,
  existingCases: CareCase[]
): CareCase | null {
  const activeCases = existingCases.filter(
    (c) => c.studentId === studentId && (c.status === 'open' || c.status === 'under_review')
  );

  const newDomains = new Set(newTriageResult.needs.map((n) => n.domain));

  for (const existing of activeCases) {
    // 1. Same urgent safeguarding crisis
    if (newTriageResult.isEmergency && existing.triageResult.isEmergency) {
      return existing;
    }

    const existingDomains = new Set(existing.triageResult.needs.map((n) => n.domain));
    const sharedDomains = Array.from(newDomains).filter((d) => existingDomains.has(d));

    // 2. Both are multi-need cases sharing 2+ domains or same primary coordination hub
    if (newTriageResult.isMultiNeed && existing.triageResult.isMultiNeed) {
      if (
        sharedDomains.length >= 2 ||
        existing.routing.primaryRoute === newTriageResult.recommendedPrimaryRoute
      ) {
        return existing;
      }
    }

    // 3. Same primary support domain
    const primaryNew = newTriageResult.needs[0]?.domain;
    const primaryExisting = existing.triageResult.needs[0]?.domain;
    if (primaryNew && primaryExisting && primaryNew === primaryExisting) {
      return existing;
    }
  }

  return null;
}

export function createNewCase(params: CreateCaseParams, existingCases: CareCase[]): CareCase {
  const triageResult =
    params.triageResult ||
    runTriage({
      selectedConcerns: params.selectedConcerns,
      clarifications: params.clarifications,
      freeText: params.freeText,
    });

  // Generate unique dynamic ID e.g. UC-2026-1042 or random 4-digit if exists
  const studentNum = params.studentId.replace(/\D/g, '');
  let potentialId = `UC-2026-${studentNum || Math.floor(1000 + Math.random() * 9000)}`;
  if (existingCases.some((c) => c.id === potentialId)) {
    potentialId = `UC-2026-${Math.floor(2000 + Math.random() * 7999)}`;
  }

  const now = new Date().toISOString();

  const initialTimeline: TimelineEvent[] = [
    {
      id: `tl-${Date.now()}-1`,
      timestamp: now,
      type: 'created',
      title: 'Case submitted by student',
      description: `Student completed guided intake with ${params.selectedConcerns.length} concern areas selected.`,
      author: params.studentName,
    },
    {
      id: `tl-${Date.now()}-2`,
      timestamp: now,
      type: 'triage_completed',
      title: 'Triage evaluation completed',
      description: triageResult.isEmergency
        ? 'High-urgency indicators detected: Safeguarding protocol engaged.'
        : triageResult.isMultiNeed
        ? `Multi-need detected (${triageResult.needs.map((n) => n.label.split(' ')[0]).join(' + ')}). Coordinated routing recommended.`
        : `Primary need identified: ${triageResult.needs[0]?.label || 'General'} (Structured student intake).`,
      author: "UniCare's triage engine",
    },
  ];

  const newCase: CareCase = {
    id: potentialId,
    studentId: params.studentId,
    createdAt: now,
    updatedAt: now,
    status: 'open',
    priority: triageResult.priority,
    selectedConcerns: params.selectedConcerns,
    clarifications: params.clarifications,
    freeText: params.freeText,
    triageResult,
    routing: {
      primaryRoute: triageResult.recommendedPrimaryRoute,
      additionalRoutes: triageResult.recommendedAdditionalRoutes,
      whyThisPlan: triageResult.reasoning,
      planAccepted: false,
    },
    nextBestAction: {
      id: `nba-${Date.now()}`,
      action: triageResult.suggestedNextAction,
      status: 'pending',
      suggestedRole: triageResult.isEmergency
        ? 'Duty Dean of Students'
        : triageResult.isMultiNeed
        ? 'Lead Triage Officer'
        : 'Support Specialist',
      updatedAt: now,
    },
    timeline: initialTimeline,
    notes: [],
  };

  return newCase;
}

export function updateCaseStatus(
  careCase: CareCase,
  newStatus: CaseStatus,
  author: string,
  reason?: string
): CareCase {
  const now = new Date().toISOString();
  const statusLabels: Record<CaseStatus, string> = {
    open: 'Open',
    under_review: 'Under Review',
    resolved: 'Resolved',
    closed: 'Closed',
  };

  const newTimelineEvent: TimelineEvent = {
    id: `tl-${Date.now()}`,
    timestamp: now,
    type: 'status_changed',
    title: `Status changed to ${statusLabels[newStatus]}`,
    description: reason || `Case status updated from ${statusLabels[careCase.status]} to ${statusLabels[newStatus]} by ${author}.`,
    author,
  };

  // Update Next Best Action accordingly
  let nextAction = careCase.nextBestAction;
  if (newStatus === 'under_review' && careCase.nextBestAction.status === 'pending') {
    nextAction = {
      ...careCase.nextBestAction,
      status: 'in_progress',
      action: `Under review by staff: Initiate student outreach via ${careCase.routing.primaryRoute}`,
      updatedAt: now,
    };
  } else if (newStatus === 'resolved') {
    nextAction = {
      ...careCase.nextBestAction,
      status: 'completed',
      action: 'Case successfully resolved and support actions confirmed with student',
      updatedAt: now,
    };
  } else if (newStatus === 'closed') {
    nextAction = {
      ...careCase.nextBestAction,
      status: 'completed',
      action: 'Case file closed and archived',
      updatedAt: now,
    };
  }

  return {
    ...careCase,
    status: newStatus,
    updatedAt: now,
    nextBestAction: nextAction,
    timeline: [...careCase.timeline, newTimelineEvent],
  };
}

export function acceptCasePlan(careCase: CareCase, author: string): CareCase {
  const now = new Date().toISOString();

  const newTimelineEvent: TimelineEvent = {
    id: `tl-${Date.now()}`,
    timestamp: now,
    type: 'plan_accepted',
    title: 'Support plan approved by staff',
    description: `Staff confirmed coordination route to ${careCase.routing.primaryRoute}. Case transitioning to Under Review.`,
    author,
  };

  const nextAction = {
    id: `nba-${Date.now()}`,
    action: `Coordinate active outreach via ${careCase.routing.primaryRoute}`,
    status: 'in_progress' as const,
    suggestedRole: 'Assigned Support Specialist',
    updatedAt: now,
  };

  return {
    ...careCase,
    status: 'under_review',
    updatedAt: now,
    routing: {
      ...careCase.routing,
      planAccepted: true,
      planAcceptedAt: now,
      planAcceptedBy: author,
    },
    nextBestAction: nextAction,
    timeline: [...careCase.timeline, newTimelineEvent],
  };
}

export function updateCaseRouting(
  careCase: CareCase,
  newPrimaryRoute: string,
  newAdditionalRoutes: string[],
  author: string,
  overrideReason: string
): CareCase {
  const now = new Date().toISOString();

  const newTimelineEvent: TimelineEvent = {
    id: `tl-${Date.now()}`,
    timestamp: now,
    type: 'route_changed',
    title: `Routing plan modified by staff`,
    description: `Primary route reassigned to "${newPrimaryRoute}". Reason: "${overrideReason}"`,
    author,
  };

  const nextAction = {
    ...careCase.nextBestAction,
    action: `Referral handoff to ${newPrimaryRoute} in progress`,
    updatedAt: now,
  };

  return {
    ...careCase,
    updatedAt: now,
    routing: {
      ...careCase.routing,
      primaryRoute: newPrimaryRoute,
      additionalRoutes: newAdditionalRoutes,
      isOverridden: true,
      overriddenBy: author,
      overrideReason,
    },
    nextBestAction: nextAction,
    timeline: [...careCase.timeline, newTimelineEvent],
  };
}

export function updateCasePriority(
  careCase: CareCase,
  newPriority: PriorityLevel,
  author: string,
  reason: string
): CareCase {
  const now = new Date().toISOString();

  const newTimelineEvent: TimelineEvent = {
    id: `tl-${Date.now()}`,
    timestamp: now,
    type: 'priority_changed',
    title: `Priority changed to ${newPriority.toUpperCase()}`,
    description: `Priority updated from ${careCase.priority.toUpperCase()} to ${newPriority.toUpperCase()} by ${author}. Reason: ${reason}`,
    author,
  };

  return {
    ...careCase,
    priority: newPriority,
    updatedAt: now,
    timeline: [...careCase.timeline, newTimelineEvent],
  };
}

export function addCaseNote(
  careCase: CareCase,
  author: string,
  role: string,
  content: string,
  isInternalOnly = false
): CareCase {
  const now = new Date().toISOString();

  const newNote: CaseNote = {
    id: `note-${Date.now()}`,
    timestamp: now,
    author,
    role,
    content,
    isInternalOnly,
  };

  const newTimelineEvent: TimelineEvent = {
    id: `tl-${Date.now()}`,
    timestamp: now,
    type: 'note_added',
    title: isInternalOnly ? 'Internal staff note recorded' : 'Case progress note added',
    description: content.length > 80 ? `${content.substring(0, 80)}...` : content,
    author,
  };

  return {
    ...careCase,
    updatedAt: now,
    notes: [newNote, ...careCase.notes],
    timeline: [...careCase.timeline, newTimelineEvent],
  };
}
