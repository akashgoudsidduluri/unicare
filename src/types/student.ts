export type StudentAvatarGender = 'female' | 'male' | 'other' | 'neutral';

export interface Student {
  id: string; // e.g., 'STU-1042'
  name: string;
  email: string;
  phone: string;
  program: string;
  faculty: string;
  yearOfStudy: number;
  avatarGender: StudentAvatarGender;
  enrollmentStatus: 'Full-Time' | 'Part-Time' | 'Deferred';
  campus: string;
}
