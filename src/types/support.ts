export type SupportDomain =
  | 'academic'
  | 'financial'
  | 'wellbeing'
  | 'housing'
  | 'accessibility'
  | 'career'
  | 'digital_admin';

export interface SupportDomainMeta {
  id: SupportDomain;
  label: string;
  shortLabel: string;
  description: string;
  iconName: string;
  primaryDepartment: string;
  colorTheme: {
    bg: string;
    text: string;
    border: string;
    badge: string;
  };
}

export interface SupportService {
  id: string;
  name: string;
  domain: SupportDomain;
  description: string;
  leadTime: string;
  location: string;
  coordinationRole: boolean; // whether this is a multi-need coordination hub
  operatingHours: string;
  contactRole: string;
}
