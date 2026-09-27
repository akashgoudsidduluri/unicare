import { CareCase } from '../types/case';
import { runTriage } from '../services/triage';

export const INITIAL_DEMO_CASES: CareCase[] = [
  // 1. Academic only - Under Review
  {
    id: 'UC-2026-1087',
    studentId: 'STU-1087', // David Okafor
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 26 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    status: 'under_review',
    priority: 'normal',
    selectedConcerns: ["I'm struggling with my studies"],
    clarifications: {
      academic: ['acad-coursework', 'acad-assignments'],
    },
    freeText: "I'm struggling to understand my coursework and I've missed two assignments in intermediate microeconomics.",
    triageResult: {
      summary: 'Seeking support with academic studies, coursework, or assignment deadlines.',
      needs: [
        {
          domain: 'academic',
          label: 'Academic Support',
          confidence: 0.94,
          signals: ['Directly selected academic challenge', 'Coursework', 'Assignments'],
          rationale: 'Directly selected academic challenge with missed coursework deadlines.',
        },
      ],
      signals: ['Directly selected academic challenge', 'Coursework', 'Assignments', 'Intermediate microeconomics'],
      priority: 'normal',
      confidence: 0.94,
      reasoning: 'Focused request identified within Academic Support. Direct routing allows faculty learning advisors to assist without intermediary delays.',
      isMultiNeed: false,
      isEmergency: false,
      recommendedPrimaryRoute: 'Academic Advisory & Learning Hub',
      recommendedAdditionalRoutes: [],
      suggestedNextAction: 'Academic Advisor review study plan and coursework extensions',
    },
    routing: {
      primaryRoute: 'Academic Advisory & Learning Hub',
      additionalRoutes: [],
      whyThisPlan: 'Single domain focus on academic coursework and missed assignments. Routed directly to faculty advisory.',
      planAccepted: true,
      planAcceptedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      planAcceptedBy: 'Sarah Jenkins (Triage Lead)',
    },
    nextBestAction: {
      id: 'nba-1087',
      action: 'Academic Advisor review study plan and coursework extensions',
      status: 'in_progress',
      suggestedRole: 'Senior Academic Advisor',
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    },
    timeline: [
      {
        id: 'tl-1087-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
        type: 'created',
        title: 'Case submitted by student',
        description: 'Student initiated request through UniCare Guided Intake.',
        author: 'David Okafor',
      },
      {
        id: 'tl-1087-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
        type: 'triage_completed',
        title: 'Triage evaluation completed',
        description: 'Identified primary need: Academic Support (Structured student intake).',
        author: "UniCare's triage engine",
      },
      {
        id: 'tl-1087-3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        type: 'plan_accepted',
        title: 'Support plan accepted by staff',
        description: 'Assigned to Academic Advisory & Learning Hub. Case status moved to Under Review.',
        author: 'Sarah Jenkins (Triage Lead)',
      },
    ],
    notes: [
      {
        id: 'note-1087-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        author: 'Sarah Jenkins',
        role: 'Triage Lead',
        content: 'Contacted School of Business senior tutor to facilitate a 7-day extension for Assignment 2.',
        isInternalOnly: true,
      },
    ],
  },

  // 2. Financial only - Open
  {
    id: 'UC-2026-1124',
    studentId: 'STU-1124', // Chloe Patel
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(), // 14 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    status: 'open',
    priority: 'normal',
    selectedConcerns: ["I'm worried about money"],
    clarifications: {
      financial: ['fin-tuition', 'fin-living'],
    },
    freeText: 'I am worried about paying my tuition fees before the semester census deadline next Friday.',
    triageResult: {
      summary: 'Seeking financial guidance regarding tuition fees, living costs, or hardship assistance.',
      needs: [
        {
          domain: 'financial',
          label: 'Financial & Basic Needs',
          confidence: 0.95,
          signals: ['Tuition fees deadline', 'Directly selected financial difficulty'],
          rationale: 'Student flagged imminent tuition payment deadline concerns.',
        },
      ],
      signals: ['Directly selected financial difficulty', 'Tuition Fees', 'Census deadline'],
      priority: 'normal',
      confidence: 0.95,
      reasoning: 'Focused request identified within Financial & Basic Needs. Direct routing allows the financial aid team to assess payment plan options.',
      isMultiNeed: false,
      isEmergency: false,
      recommendedPrimaryRoute: 'Student Financial Aid & Emergency Fund',
      recommendedAdditionalRoutes: [],
      suggestedNextAction: 'Financial Aid officer review fee relief and payment schedule options',
    },
    routing: {
      primaryRoute: 'Student Financial Aid & Emergency Fund',
      additionalRoutes: [],
      whyThisPlan: 'Specialist financial request. Direct routing to Financial Services to avoid fee penalties.',
      planAccepted: false,
    },
    nextBestAction: {
      id: 'nba-1124',
      action: 'Staff review required: assess eligibility for installment payment plan',
      status: 'pending',
      suggestedRole: 'Financial Wellbeing Officer',
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    },
    timeline: [
      {
        id: 'tl-1124-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
        type: 'created',
        title: 'Case submitted by student',
        description: 'Student submitted financial concern via intake form.',
        author: 'Chloe Patel',
      },
      {
        id: 'tl-1124-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
        type: 'triage_completed',
        title: 'Triage evaluation completed',
        description: 'Identified need: Financial & Basic Needs. Priority: Normal.',
        author: "UniCare's triage engine",
      },
    ],
    notes: [],
  },

  // 3. Housing only - Under Review
  {
    id: 'UC-2026-1191',
    studentId: 'STU-1191', // Julian Vance
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    status: 'under_review',
    priority: 'normal',
    selectedConcerns: ['My housing situation is difficult'],
    clarifications: {
      housing: ['house-hostel', 'house-maintenance'],
    },
    freeText: "I'm having trouble with my hostel accommodation heating and excessive noise from construction next door.",
    triageResult: {
      summary: 'Dealing with accommodation, hostel room, or residential living challenges.',
      needs: [
        {
          domain: 'housing',
          label: 'Housing & Campus Life',
          confidence: 0.91,
          signals: ['Hostel accommodation', 'Residential facility issue'],
          rationale: 'Direct accommodation issue within on-campus university residences.',
        },
      ],
      signals: ['Hostel Accommodation', 'Facility Issue', 'Noise'],
      priority: 'normal',
      confidence: 0.91,
      reasoning: 'Direct residential life matter. Routed to Hall Warden and Accommodation Welfare Officer.',
      isMultiNeed: false,
      isEmergency: false,
      recommendedPrimaryRoute: 'Residential Life & Accommodation Office',
      recommendedAdditionalRoutes: [],
      suggestedNextAction: 'Accommodation officer inspect room heating and review room transfer option',
    },
    routing: {
      primaryRoute: 'Residential Life & Accommodation Office',
      additionalRoutes: [],
      whyThisPlan: 'On-campus hostel living issue requiring facilities inspection and residential warden review.',
      planAccepted: true,
      planAcceptedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      planAcceptedBy: 'Marcus Brody (Accommodation Officer)',
    },
    nextBestAction: {
      id: 'nba-1191',
      action: 'Facilities inspection booked for tomorrow 10:00 AM',
      status: 'in_progress',
      suggestedRole: 'Residential Warden',
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
    timeline: [
      {
        id: 'tl-1191-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        type: 'created',
        title: 'Case created',
        description: 'Julian submitted request regarding hostel room issues.',
        author: 'Julian Vance',
      },
      {
        id: 'tl-1191-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        type: 'plan_accepted',
        title: 'Accommodation office accepted case',
        description: 'Assigned to Residential Village maintenance coordinator.',
        author: 'Marcus Brody',
      },
    ],
    notes: [
      {
        id: 'note-1191-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        author: 'Marcus Brody',
        role: 'Accommodation Officer',
        content: 'Work order #H-4491 raised for heating radiator valve. If not fixed by Friday, student will be offered room transfer in Block B.',
        isInternalOnly: false,
      },
    ],
  },

  // 4. Academic + Wellbeing - Priority
  {
    id: 'UC-2026-1238',
    studentId: 'STU-1238', // Alex Rivera
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    status: 'under_review',
    priority: 'priority',
    selectedConcerns: ["I'm struggling with my studies", "I'm feeling overwhelmed"],
    clarifications: {
      academic: ['acad-falling-behind', 'acad-exams'],
      wellbeing: ['wb-sleeping', 'wb-stress'],
    },
    freeText: "I've been feeling overwhelmed and I'm struggling to keep up with everything. Having trouble sleeping before studio reviews.",
    triageResult: {
      summary: 'Feeling overwhelmed and having difficulty keeping pace with coursework.',
      needs: [
        {
          domain: 'wellbeing',
          label: 'Wellbeing & Health',
          confidence: 0.93,
          signals: ['Feeling overwhelmed', 'Trouble sleeping', 'Studio review stress'],
          rationale: 'Student reported elevated personal stress affecting daily functioning.',
        },
        {
          domain: 'academic',
          label: 'Academic Support',
          confidence: 0.89,
          signals: ['Falling behind', 'Studio review exams'],
          rationale: 'Coursework progression is impacted by fatigue and stress.',
        },
      ],
      signals: ['Feeling overwhelmed', 'Trouble sleeping', 'Falling behind in classes', 'High Stress'],
      priority: 'priority',
      confidence: 0.91,
      reasoning: 'Multiple interconnected support needs detected across Wellbeing and Academic domains. Central coordination ensures student gets both workload adjustment and wellbeing check-in.',
      isMultiNeed: true,
      isEmergency: false,
      recommendedPrimaryRoute: 'Student Support Coordination',
      recommendedAdditionalRoutes: ['Student Wellbeing Services', 'Academic Advisory & Learning Hub'],
      suggestedNextAction: 'Student Support officer to review the care context and coordinate the next support steps',
    },
    routing: {
      primaryRoute: 'Student Support Coordination',
      additionalRoutes: ['Student Wellbeing Services', 'Academic Advisory & Learning Hub'],
      whyThisPlan: 'Cross-functional need: Alex needs immediate stress relief coping strategies plus academic liaison for design project milestones.',
      planAccepted: true,
      planAcceptedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      planAcceptedBy: 'Sarah Jenkins (Triage Lead)',
    },
    nextBestAction: {
      id: 'nba-1238',
      action: 'Staff review care context and coordinate next steps with design faculty liaison',
      status: 'in_progress',
      suggestedRole: 'Lead Triage Officer',
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    timeline: [
      {
        id: 'tl-1238-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(),
        type: 'created',
        title: 'Case submitted',
        description: 'Multi-need request initiated.',
        author: 'Alex Rivera',
      },
      {
        id: 'tl-1238-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(),
        type: 'triage_completed',
        title: 'Multi-need coordination recommended',
        description: 'Identified: Wellbeing & Health + Academic Support. Priority elevated to Priority.',
        author: "UniCare's triage engine",
      },
      {
        id: 'tl-1238-3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        type: 'plan_accepted',
        title: 'Coordination plan accepted',
        description: 'Assigned to Student Support central care team.',
        author: 'Sarah Jenkins',
      },
    ],
    notes: [
      {
        id: 'note-1238-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        author: 'Sarah Jenkins',
        role: 'Triage Lead',
        content: 'Coordinated with Art & Architecture student experience officer. Student offered 5 days buffer on mid-semester review.',
        isInternalOnly: true,
      },
    ],
  },

  // 5. Urgent Emergency Escalation - Open Urgent (Sarah Chen)
  {
    id: 'UC-2026-1305',
    studentId: 'STU-1305', // Sarah Chen
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago!
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'open',
    priority: 'urgent',
    selectedConcerns: ["I'm feeling overwhelmed"],
    clarifications: {
      wellbeing: ['wb-talk', 'wb-stress'],
    },
    freeText: "I don't feel safe right now and need immediate help.",
    triageResult: {
      summary: 'Student indicated an immediate safety concern requiring human safeguarding review.',
      needs: [
        {
          domain: 'wellbeing',
          label: 'Wellbeing & Health',
          confidence: 0.98,
          signals: ["Don't feel safe", 'Immediate help requested', 'Safeguarding Protocol'],
          rationale: 'Student explicitly indicated an immediate safety concern requiring human review.',
        },
      ],
      signals: ["Don't feel safe", 'Immediate help', 'Safeguarding Protocol (Demo)'],
      priority: 'urgent',
      confidence: 0.98,
      reasoning: 'Explicit safety concern stated in free-text. Standard queue bypassed to route directly to urgent human safeguarding protocol.',
      isMultiNeed: false,
      isEmergency: true,
      recommendedPrimaryRoute: 'Urgent Response & Safeguarding Duty',
      recommendedAdditionalRoutes: ['Campus Security & Welfare First Response'],
      suggestedNextAction: 'Immediate duty officer contact and safeguarding check (demo protocol)',
    },
    routing: {
      primaryRoute: 'Urgent Response & Safeguarding Duty',
      additionalRoutes: ['Campus Security & Welfare First Response'],
      whyThisPlan: 'Safety indicators detected in student input. Immediate human escalation protocol activated.',
      planAccepted: false,
    },
    nextBestAction: {
      id: 'nba-1305',
      action: 'Duty officer phone check-in and welfare review (demo safeguarding protocol)',
      status: 'pending',
      suggestedRole: 'Duty Dean of Students',
      updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    timeline: [
      {
        id: 'tl-1305-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        type: 'created',
        title: 'Urgent safeguarding case opened',
        description: 'Student submitted request with explicit safety concern.',
        author: 'Sarah Chen',
      },
      {
        id: 'tl-1305-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        type: 'priority_changed',
        title: 'Priority set to URGENT',
        description: 'High-urgency indicator detected. Safeguarding protocol engaged.',
        author: "UniCare's triage engine",
      },
    ],
    notes: [],
  },

  // 6. Financial + Housing - Resolved
  {
    id: 'UC-2026-1412',
    studentId: 'STU-1412', // Marcus Thorne
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    status: 'resolved',
    priority: 'priority',
    selectedConcerns: ["I'm worried about money", 'My housing situation is difficult'],
    clarifications: {
      financial: ['fin-living', 'fin-food'],
      housing: ['house-rent'],
    },
    freeText: 'Struggling with rent hike for off-campus flat and unable to buy groceries this week.',
    triageResult: {
      summary: 'Experiencing housing difficulties combined with financial constraints.',
      needs: [
        {
          domain: 'financial',
          label: 'Financial & Basic Needs',
          confidence: 0.95,
          signals: ['Food security', 'Living expenses', 'Rent hike'],
          rationale: 'Severe budget deficit impacting nutrition and rent payment.',
        },
        {
          domain: 'housing',
          label: 'Housing & Campus Life',
          confidence: 0.92,
          signals: ['Off-campus rent dispute', 'Private tenancy crisis'],
          rationale: 'Landlord rent dispute requiring legal tenancy advice.',
        },
      ],
      signals: ['Food security', 'Rent crisis', 'Emergency hardship'],
      priority: 'priority',
      confidence: 0.94,
      reasoning: 'Coordinated between Student Financial Aid and Off-Campus Housing Advisory.',
      isMultiNeed: true,
      isEmergency: false,
      recommendedPrimaryRoute: 'Student Support Coordination',
      recommendedAdditionalRoutes: ['Student Financial Aid & Emergency Fund', 'Residential Life & Accommodation Office'],
      suggestedNextAction: 'Disburse emergency food voucher and schedule tenant advice call',
    },
    routing: {
      primaryRoute: 'Student Support Coordination',
      additionalRoutes: ['Student Financial Aid & Emergency Fund', 'Residential Life & Accommodation Office'],
      whyThisPlan: 'Joint resolution required financial relief grant plus tenancy advocate intervention.',
      planAccepted: true,
      planAcceptedAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
      planAcceptedBy: 'Sarah Jenkins (Triage Lead)',
    },
    nextBestAction: {
      id: 'nba-1412',
      action: 'Resolution completed: $350 emergency hardship grant credited + campus food pantry pass issued',
      status: 'completed',
      suggestedRole: 'Financial Wellbeing Officer',
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
    timeline: [
      {
        id: 'tl-1412-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        type: 'created',
        title: 'Case submitted',
        description: 'Intake completed for financial & housing hardship.',
        author: 'Marcus Thorne',
      },
      {
        id: 'tl-1412-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
        type: 'plan_accepted',
        title: 'Plan accepted',
        description: 'Assigned to Student Support.',
        author: 'Sarah Jenkins',
      },
      {
        id: 'tl-1412-3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        type: 'status_changed',
        title: 'Case marked RESOLVED',
        description: 'Financial aid grant approved and tenancy advisory completed.',
        author: 'Sarah Jenkins',
      },
    ],
    notes: [
      {
        id: 'note-1412-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        author: 'Sarah Jenkins',
        role: 'Triage Lead',
        content: 'Marcus collected emergency supermarket card. Campus tenant union advised on wrongful rent notice.',
        isInternalOnly: false,
      },
    ],
  },
];
