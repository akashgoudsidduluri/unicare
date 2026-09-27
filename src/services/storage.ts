import { CareCase } from '../types/case';
import { Student } from '../types/student';
import { INITIAL_DEMO_CASES } from '../data/demoCases';
import { INITIAL_STUDENTS } from '../data/students';

const CASES_STORAGE_KEY = 'unicare_cases_v2';
const STUDENTS_STORAGE_KEY = 'unicare_students_v2';
const CURRENT_STUDENT_ID_KEY = 'unicare_active_student_id_v2';

export function loadStoredCases(): CareCase[] {
  try {
    const raw = localStorage.getItem(CASES_STORAGE_KEY);
    if (!raw) {
      saveStoredCases(INITIAL_DEMO_CASES);
      return INITIAL_DEMO_CASES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_DEMO_CASES;
  } catch (err) {
    console.error('Failed to load cases from localStorage:', err);
    return INITIAL_DEMO_CASES;
  }
}

export function saveStoredCases(cases: CareCase[]): void {
  try {
    localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(cases));
  } catch (err) {
    console.error('Failed to save cases to localStorage:', err);
  }
}

export function loadStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (!raw) {
      saveStoredStudents(INITIAL_STUDENTS);
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_STUDENTS;
  } catch (err) {
    console.error('Failed to load students from localStorage:', err);
    return INITIAL_STUDENTS;
  }
}

export function saveStoredStudents(students: Student[]): void {
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  } catch (err) {
    console.error('Failed to save students to localStorage:', err);
  }
}

export function loadActiveStudentId(): string {
  try {
    return localStorage.getItem(CURRENT_STUDENT_ID_KEY) || 'STU-1042';
  } catch {
    return 'STU-1042';
  }
}

export function saveActiveStudentId(id: string): void {
  try {
    localStorage.setItem(CURRENT_STUDENT_ID_KEY, id);
  } catch (err) {
    console.error('Failed to save active student ID:', err);
  }
}

export function resetToDemoDefaults(): { cases: CareCase[]; students: Student[] } {
  try {
    localStorage.removeItem(CASES_STORAGE_KEY);
    localStorage.removeItem(STUDENTS_STORAGE_KEY);
    localStorage.removeItem(CURRENT_STUDENT_ID_KEY);
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
  saveStoredCases(INITIAL_DEMO_CASES);
  saveStoredStudents(INITIAL_STUDENTS);
  saveActiveStudentId('STU-1042');
  return { cases: INITIAL_DEMO_CASES, students: INITIAL_STUDENTS };
}
