import { FollowUpQuestion, IntentOption } from '../types/triage';
import { SupportDomain } from '../types/support';

export const INITIAL_INTENT_OPTIONS: IntentOption[] = [
  {
    id: 'studies',
    label: "I'm struggling with my studies",
    domain: 'academic',
  },
  {
    id: 'money',
    label: "I'm worried about money",
    domain: 'financial',
  },
  {
    id: 'overwhelmed',
    label: "I'm feeling overwhelmed",
    domain: 'wellbeing',
  },
  {
    id: 'housing',
    label: 'My housing situation is difficult',
    domain: 'housing',
  },
  {
    id: 'accessibility',
    label: 'I need accessibility support',
    domain: 'accessibility',
  },
  {
    id: 'career',
    label: 'I need career help',
    domain: 'career',
  },
  {
    id: 'digital_admin',
    label: 'I have a digital or administrative problem',
    domain: 'digital_admin',
  },
  {
    id: 'other',
    label: 'Something else',
  },
];

export const CONTEXT_FOLLOW_UPS: Record<SupportDomain, FollowUpQuestion> = {
  academic: {
    domain: 'academic',
    question: 'What is making things difficult?',
    subtitle: 'Select any that apply to your current classes or coursework',
    options: [
      { id: 'acad-falling-behind', label: "I'm falling behind", signal: 'falling_behind' },
      { id: 'acad-assignments', label: "I'm struggling with assignments", signal: 'assignment_struggles' },
      { id: 'acad-coursework', label: "I'm having trouble understanding coursework", signal: 'understanding_coursework' },
      { id: 'acad-exams', label: "I'm worried about exams", signal: 'exam_anxiety' },
      { id: 'acad-missing-classes', label: "I'm missing classes", signal: 'missing_classes' },
      { id: 'acad-other', label: 'Something else', signal: 'general_academic' },
    ],
  },
  financial: {
    domain: 'financial',
    question: 'What kind of financial difficulty are you facing?',
    subtitle: 'This helps us connect you to emergency funds or fee payment advisors',
    options: [
      { id: 'fin-tuition', label: 'Tuition / fees', signal: 'tuition_fees' },
      { id: 'fin-aid', label: 'Scholarship / financial aid', signal: 'scholarship_aid' },
      { id: 'fin-living', label: 'Basic living expenses', signal: 'living_expenses' },
      { id: 'fin-food', label: 'Food / essentials', signal: 'food_security' },
      { id: 'fin-unexpected', label: 'Unexpected financial problem', signal: 'emergency_hardship' },
      { id: 'fin-other', label: 'Something else', signal: 'general_financial' },
    ],
  },
  wellbeing: {
    domain: 'wellbeing',
    question: 'What have you been experiencing lately?',
    subtitle: 'We provide confidential wellbeing support tailored to what you feel',
    options: [
      { id: 'wb-sleeping', label: 'Having trouble sleeping', signal: 'sleep_trouble' },
      { id: 'wb-stress', label: 'Feeling constantly stressed or exhausted', signal: 'high_stress' },
      { id: 'wb-balance', label: 'Struggling to balance daily life and study', signal: 'life_imbalance' },
      { id: 'wb-isolated', label: 'Feeling isolated or lonely', signal: 'social_isolation' },
      { id: 'wb-talk', label: 'Need someone safe to talk to', signal: 'seeking_counsel' },
      { id: 'wb-other', label: 'Something else', signal: 'general_wellbeing' },
    ],
  },
  housing: {
    domain: 'housing',
    question: "What's happening with your housing?",
    subtitle: 'We can liaise with residence halls, landlords, or emergency rooms',
    options: [
      { id: 'house-hostel', label: 'Trouble with university hostel / dorm accommodation', signal: 'hostel_issues' },
      { id: 'house-rent', label: 'Problems with off-campus lease / rent', signal: 'rent_dispute' },
      { id: 'house-flatmates', label: 'Conflict with roommates / flatmates', signal: 'roommate_conflict' },
      { id: 'house-emergency', label: 'At risk of having nowhere to sleep', signal: 'housing_insecurity', urgencyIndicator: true },
      { id: 'house-maintenance', label: 'Maintenance or safety issue in room', signal: 'facility_issue' },
      { id: 'house-other', label: 'Something else', signal: 'general_housing' },
    ],
  },
  accessibility: {
    domain: 'accessibility',
    question: 'What accessibility adjustments do you need?',
    subtitle: 'Our Inclusion team ensures barrier-free education',
    options: [
      { id: 'acc-exam', label: 'Exam adjustments (extra time, quiet room)', signal: 'exam_adjustments' },
      { id: 'acc-classroom', label: 'Classroom or lab physical access', signal: 'physical_access' },
      { id: 'acc-tech', label: 'Assistive software / screen readers', signal: 'assistive_tech' },
      { id: 'acc-notes', label: 'Peer note-taking or lecture transcripts', signal: 'notetaking_support' },
      { id: 'acc-other', label: 'Something else', signal: 'general_accessibility' },
    ],
  },
  career: {
    domain: 'career',
    question: 'What career support would be most helpful right now?',
    subtitle: 'From finding internships to preparing for graduation',
    options: [
      { id: 'car-intern', label: 'Finding internships / work placement', signal: 'internship_search' },
      { id: 'car-resume', label: 'Resume & portfolio feedback', signal: 'resume_review' },
      { id: 'car-interview', label: 'Interview coaching & practice', signal: 'interview_prep' },
      { id: 'car-direction', label: 'Career direction & graduate pathways', signal: 'career_direction' },
      { id: 'car-other', label: 'Something else', signal: 'general_career' },
    ],
  },
  digital_admin: {
    domain: 'digital_admin',
    question: 'What digital or administrative matter can we assist with?',
    subtitle: 'We assist with university records, visas, and digital systems',
    options: [
      { id: 'admin-visa', label: 'Visa or international compliance check', signal: 'visa_compliance' },
      { id: 'admin-enrollment', label: 'Timetable clash / module enrollment error', signal: 'enrollment_issue' },
      { id: 'admin-it', label: 'Portal login / campus IT network issues', signal: 'it_access' },
      { id: 'admin-petition', label: 'Leave of absence / formal transcript petition', signal: 'formal_petition' },
      { id: 'admin-other', label: 'Something else', signal: 'general_admin' },
    ],
  },
};
