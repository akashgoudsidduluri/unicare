import { SupportDomain } from './support';

export type PriorityLevel = 'normal' | 'priority' | 'urgent';

export interface SupportNeed {
  domain: SupportDomain;
  label: string;
  confidence: number;
  signals: string[];
  rationale: string;
}

export interface TriageResult {
  summary: string;
  needs: SupportNeed[];
  signals: string[];
  priority: PriorityLevel;
  confidence: number;
  reasoning: string;
  isMultiNeed: boolean;
  isEmergency: boolean;
  recommendedPrimaryRoute: string;
  recommendedAdditionalRoutes: string[];
  suggestedNextAction: string;
}

export interface IntentOption {
  id: string;
  label: string;
  domain?: SupportDomain;
  isUrgentFlag?: boolean;
}

export interface FollowUpQuestion {
  domain: SupportDomain;
  question: string;
  subtitle?: string;
  options: {
    id: string;
    label: string;
    signal: string;
    urgencyIndicator?: boolean;
  }[];
}
