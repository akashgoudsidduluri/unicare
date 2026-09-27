import { SupportDomain } from '../types/support';
import { PriorityLevel, SupportNeed, TriageResult } from '../types/triage';
import { COORDINATION_HUB_NAME, URGENT_ESCALATION_ROUTE } from '../data/supportCatalog';

// High-risk keywords requiring immediate human escalation and safeguarding
const EMERGENCY_KEYWORDS = [
  'suicide',
  'kill myself',
  'end my life',
  'end it all',
  'harm myself',
  'self harm',
  'self-harm',
  'immediate danger',
  'physical violence',
  'abused',
  'assaulted',
  'not safe',
  "don't feel safe",
  'feel safe',
  'immediate help',
  'nowhere to sleep tonight',
  'sleeping on the street',
];

function matchWordBoundary(text: string, kw: string): boolean {
  try {
    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(^|\\s|[^a-zA-Z0-9])${escaped}($|\\s|[^a-zA-Z0-9])`, 'i');
    return regex.test(text);
  } catch {
    return text.includes(kw);
  }
}

interface KeywordRule {
  domain: SupportDomain;
  label: string;
  keywords: string[];
  weight: number;
}

const DOMAIN_KEYWORDS: KeywordRule[] = [
  {
    domain: 'academic',
    label: 'Academic Support',
    keywords: [
      'coursework',
      'assignment',
      'assignments',
      'exam',
      'exams',
      'study',
      'studies',
      'studying',
      'class',
      'classes',
      'lecture',
      'lectures',
      'failing',
      'fall behind',
      'falling behind',
      'missed',
      'grades',
      'professor',
      'tutor',
      'degree',
    ],
    weight: 1.0,
  },
  {
    domain: 'financial',
    label: 'Financial & Basic Needs',
    keywords: [
      'money',
      'fee',
      'fees',
      'tuition',
      'scholarship',
      'bursary',
      'grant',
      'hardship',
      'food',
      'groceries',
      'afford',
      'rent money',
      'living cost',
      'financial',
      'bank',
      'debt',
    ],
    weight: 1.0,
  },
  {
    domain: 'wellbeing',
    label: 'Wellbeing & Health',
    keywords: [
      'overwhelmed',
      'stress',
      'stressed',
      'sleep',
      'sleeping',
      'insomnia',
      'anxious',
      'exhausted',
      'burnout',
      'lonely',
      'isolated',
      'crying',
      'talk to someone',
      'wellbeing',
      'personal problem',
      'panic',
    ],
    weight: 0.9,
  },
  {
    domain: 'housing',
    label: 'Housing & Campus Life',
    keywords: [
      'housing',
      'hostel',
      'accommodation',
      'dorm',
      'dormitory',
      'roommate',
      'flatmate',
      'landlord',
      'tenancy',
      'lease',
      'eviction',
      'residence',
      'hall',
    ],
    weight: 1.0,
  },
  {
    domain: 'accessibility',
    label: 'Accessibility & Inclusion',
    keywords: [
      'accessibility',
      'disability',
      'accommodation',
      'extra time',
      'wheelchair',
      'mobility',
      'screen reader',
      'adhd',
      'dyslexia',
      'chronic illness',
      'assistive',
    ],
    weight: 1.0,
  },
  {
    domain: 'career',
    label: 'Career & Employability',
    keywords: [
      'career',
      'job',
      'internship',
      'resume',
      'cv',
      'interview',
      'placement',
      'employability',
      'graduating',
      'work experience',
    ],
    weight: 0.9,
  },
  {
    domain: 'digital_admin',
    label: 'Digital & Administration',
    keywords: [
      'visa',
      'immigration',
      'passport',
      'portal',
      'transcript',
      'enrollment',
      'timetable clash',
      'admin',
      'registry',
      'petition',
      'login',
      'password',
    ],
    weight: 0.9,
  },
];

export interface TriageInput {
  selectedConcerns: string[]; // option IDs or labels from smart canvas
  clarifications?: Record<string, string[]>; // e.g. { academic: ['acad-falling-behind', 'acad-assignments'] }
  freeText?: string;
}

export function runTriage(input: TriageInput): TriageResult {
  const textCorpus = [
    input.freeText || '',
    input.selectedConcerns.join(' '),
    Object.values(input.clarifications || {})
      .flat()
      .join(' '),
  ]
    .join(' ')
    .toLowerCase();

  // 1. Check immediate safety/emergency using word boundaries
  const detectedEmergencyKeywords = EMERGENCY_KEYWORDS.filter((kw) => matchWordBoundary(textCorpus, kw));
  const isEmergency = detectedEmergencyKeywords.length > 0;

  // 2. Map domain from selected concerns
  const domainScoreMap: Record<SupportDomain, { score: number; signals: string[]; rationales: string[] }> = {
    academic: { score: 0, signals: [], rationales: [] },
    financial: { score: 0, signals: [], rationales: [] },
    wellbeing: { score: 0, signals: [], rationales: [] },
    housing: { score: 0, signals: [], rationales: [] },
    accessibility: { score: 0, signals: [], rationales: [] },
    career: { score: 0, signals: [], rationales: [] },
    digital_admin: { score: 0, signals: [], rationales: [] },
  };

  // Structured selections carry definitive weight
  input.selectedConcerns.forEach((concern) => {
    const c = concern.toLowerCase();
    if (c.includes('studies') || c.includes('academic') || c.includes('class')) {
      domainScoreMap.academic.score += 3.0;
      domainScoreMap.academic.signals.push('Student indicated academic or coursework concern');
      domainScoreMap.academic.rationales.push('Directly selected academic challenge');
    }
    if (c.includes('money') || c.includes('financial') || c.includes('tuition')) {
      domainScoreMap.financial.score += 3.0;
      domainScoreMap.financial.signals.push('Student indicated financial concern');
      domainScoreMap.financial.rationales.push('Directly selected financial difficulty');
    }
    if (c.includes('overwhelmed') || c.includes('wellbeing') || c.includes('stress')) {
      domainScoreMap.wellbeing.score += 3.0;
      domainScoreMap.wellbeing.signals.push('Student indicated feeling overwhelmed');
      domainScoreMap.wellbeing.rationales.push('Directly selected wellbeing pressure');
    }
    if (c.includes('housing') || c.includes('hostel') || c.includes('living')) {
      domainScoreMap.housing.score += 3.0;
      domainScoreMap.housing.signals.push('Student indicated housing or hostel issue');
      domainScoreMap.housing.rationales.push('Directly selected accommodation issue');
    }
    if (c.includes('accessibility') || c.includes('inclusion')) {
      domainScoreMap.accessibility.score += 3.0;
      domainScoreMap.accessibility.signals.push('Student requested accessibility support');
      domainScoreMap.accessibility.rationales.push('Directly requested accessibility adjustments');
    }
    if (c.includes('career') || c.includes('internship') || c.includes('job')) {
      domainScoreMap.career.score += 3.0;
      domainScoreMap.career.signals.push('Student requested career/employability assistance');
      domainScoreMap.career.rationales.push('Directly requested career guidance');
    }
    if (c.includes('digital') || c.includes('administrative') || c.includes('admin') || c.includes('visa')) {
      domainScoreMap.digital_admin.score += 3.0;
      domainScoreMap.digital_admin.signals.push('Student indicated administrative or digital problem');
      domainScoreMap.digital_admin.rationales.push('Directly selected administrative request');
    }
  });

  // Evaluate follow-up clarifications
  if (input.clarifications) {
    Object.entries(input.clarifications).forEach(([domainKey, options]) => {
      const d = domainKey as SupportDomain;
      if (domainScoreMap[d] && options.length > 0) {
        domainScoreMap[d].score += options.length * 1.5;
        options.forEach((opt) => {
          domainScoreMap[d].signals.push(formatSignalLabel(opt));
        });
      }
    });
  }

  // Keyword pattern matching on free text / speech transcript
  if (input.freeText && input.freeText.trim().length > 0) {
    DOMAIN_KEYWORDS.forEach((rule) => {
      rule.keywords.forEach((kw) => {
        if (matchWordBoundary(textCorpus, kw)) {
          domainScoreMap[rule.domain].score += 1.0;
          if (!domainScoreMap[rule.domain].signals.includes(`Context keyword: "${kw}"`)) {
            domainScoreMap[rule.domain].signals.push(`Context keyword: "${kw}"`);
          }
        }
      });
    });
  }

  // Build identified needs
  const needs: SupportNeed[] = [];
  const allSignals: string[] = [];

  (Object.keys(domainScoreMap) as SupportDomain[]).forEach((domain) => {
    const data = domainScoreMap[domain];
    if (data.score >= 1.5) {
      const confidence = Math.min(0.98, 0.65 + data.score * 0.08);
      needs.push({
        domain,
        label: getDomainTitle(domain),
        confidence: Number(confidence.toFixed(2)),
        signals: data.signals.slice(0, 4),
        rationale: data.rationales.length > 0
          ? data.rationales[0]
          : `Detected relevant terms and indications related to ${domain}.`,
      });
      allSignals.push(...data.signals);
    }
  });

  // Fallback: If nothing was detected (e.g. vague input), assign general support
  if (needs.length === 0) {
    needs.push({
      domain: 'wellbeing',
      label: 'Student General Support',
      confidence: 0.6,
      signals: ['General student inquiry without specific category keywords'],
      rationale: 'Inquiry routed to central triage for human review and scoping.',
    });
  }

  // Determine priority
  let priority: PriorityLevel = 'normal';
  const hasUrgentIndicators =
    matchWordBoundary(textCorpus, 'urgent') ||
    matchWordBoundary(textCorpus, 'eviction') ||
    matchWordBoundary(textCorpus, 'evicted') ||
    matchWordBoundary(textCorpus, 'nowhere to stay') ||
    matchWordBoundary(textCorpus, 'emergency') ||
    matchWordBoundary(textCorpus, 'cannot afford food');

  if (isEmergency) {
    priority = 'urgent';
  } else if (hasUrgentIndicators) {
    priority = 'priority';
  } else {
    // Normal priority for standard multi-need cases (like Maya Lin's demo case)
    priority = 'normal';
  }

  const isMultiNeed = needs.length > 1;

  // Determine Recommended Primary Route & Additional Routes
  let recommendedPrimaryRoute = '';
  const recommendedAdditionalRoutes: string[] = [];
  let suggestedNextAction = '';
  let reasoning = '';

  if (isEmergency) {
    recommendedPrimaryRoute = URGENT_ESCALATION_ROUTE;
    recommendedAdditionalRoutes.push('Campus Security & Welfare First Response');
    suggestedNextAction = 'Immediate duty officer phone contact & campus safeguarding check';
    reasoning =
      'Immediate safety/hardship indicators detected. Escalated directly to Urgent Response duty team for rapid human intervention.';
  } else if (isMultiNeed) {
    recommendedPrimaryRoute = COORDINATION_HUB_NAME;
    needs.forEach((need) => {
      const dept = getDomainDepartment(need.domain);
      if (dept && !recommendedAdditionalRoutes.includes(dept)) {
        recommendedAdditionalRoutes.push(dept);
      }
    });
    suggestedNextAction =
      'Student Support officer to review the care context and coordinate the next support steps';
    const domainNames = needs.map((n) => n.label.split(' ')[0]).join(', ');
    reasoning = `Multiple interconnected support needs detected across ${domainNames}. Coordinated triage prevents the student from having to navigate disparate departments independently.`;
  } else {
    // Single domain
    const singleDomain = needs[0].domain;
    recommendedPrimaryRoute = getDomainDepartment(singleDomain);
    suggestedNextAction = getDomainNextAction(singleDomain);
    reasoning = `Focused request identified within ${needs[0].label}. Direct routing allows the specialist team to assist without intermediary delays.`;
  }

  // Generate plain-language summary (observable, non-diagnostic!)
  const summary = generateSupportSummary(needs, input, isEmergency);

  return {
    summary,
    needs,
    signals: Array.from(new Set(allSignals)),
    priority,
    confidence: Number((needs.reduce((acc, curr) => acc + curr.confidence, 0) / needs.length).toFixed(2)),
    reasoning,
    isMultiNeed,
    isEmergency,
    recommendedPrimaryRoute,
    recommendedAdditionalRoutes,
    suggestedNextAction,
  };
}

function formatSignalLabel(optionId: string): string {
  const parts = optionId.split('-');
  const raw = parts.slice(1).join(' ') || optionId;
  return raw.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

function getDomainTitle(domain: SupportDomain): string {
  switch (domain) {
    case 'academic':
      return 'Academic Support';
    case 'financial':
      return 'Financial & Basic Needs';
    case 'wellbeing':
      return 'Wellbeing & Health';
    case 'housing':
      return 'Housing & Campus Life';
    case 'accessibility':
      return 'Accessibility & Inclusion';
    case 'career':
      return 'Career & Employability';
    case 'digital_admin':
      return 'Digital & Administration';
  }
}

export function getDomainDepartment(domain: SupportDomain): string {
  switch (domain) {
    case 'academic':
      return 'Academic Advisory & Learning Hub';
    case 'financial':
      return 'Student Financial Aid & Emergency Fund';
    case 'wellbeing':
      return 'Student Wellbeing Services';
    case 'housing':
      return 'Residential Life & Accommodation Office';
    case 'accessibility':
      return 'Disability & Inclusion Resource Centre';
    case 'career':
      return 'Careers & Employability Centre';
    case 'digital_admin':
      return 'Student Registry & International Services';
  }
}

function getDomainNextAction(domain: SupportDomain): string {
  switch (domain) {
    case 'academic':
      return 'Academic Advisor review study plan and coursework extensions';
    case 'financial':
      return 'Financial Aid officer review fee relief and emergency grant options';
    case 'wellbeing':
      return 'Wellbeing advisor schedule initial 1-on-1 check-in';
    case 'housing':
      return 'Accommodation officer review residential room placement';
    case 'accessibility':
      return 'Inclusion team assess learning adjustments & exam accommodations';
    case 'career':
      return 'Career consultant schedule CV and internship strategy session';
    case 'digital_admin':
      return 'Registry officer verify student records and update petition status';
  }
}

function generateSupportSummary(needs: SupportNeed[], input: TriageInput, isEmergency: boolean): string {
  if (isEmergency) {
    return 'Student indicated an immediate safety concern requiring human safeguarding review.';
  }

  const domainNames = needs.map((n) => n.domain);

  if (domainNames.includes('academic') && domainNames.includes('financial')) {
    return 'Falling behind in studies while experiencing financial pressure.';
  }
  if (domainNames.includes('academic') && domainNames.includes('wellbeing')) {
    return 'Feeling overwhelmed and having difficulty keeping pace with coursework.';
  }
  if (domainNames.includes('financial') && domainNames.includes('housing')) {
    return 'Experiencing housing difficulties combined with financial constraints.';
  }
  if (domainNames.includes('academic') && domainNames.includes('housing')) {
    return 'Accommodation disruption impacting ability to attend classes and complete assignments.';
  }

  // Single or generic summary based on first need
  if (domainNames[0] === 'academic') {
    return 'Seeking support with academic studies, coursework, or assignment deadlines.';
  }
  if (domainNames[0] === 'financial') {
    return 'Seeking financial guidance regarding tuition fees, living costs, or hardship assistance.';
  }
  if (domainNames[0] === 'wellbeing') {
    return 'Experiencing personal stress or feeling overwhelmed and requesting support.';
  }
  if (domainNames[0] === 'housing') {
    return 'Dealing with accommodation, hostel room, or residential living challenges.';
  }
  if (domainNames[0] === 'accessibility') {
    return 'Requesting accessibility adjustments or accommodations for academic study.';
  }
  if (domainNames[0] === 'career') {
    return 'Looking for career direction, internship advice, or employability coaching.';
  }
  if (domainNames[0] === 'digital_admin') {
    return 'Navigating administrative, registry, or digital service procedures.';
  }

  return 'Student requesting assistance with multiple university matters.';
}
