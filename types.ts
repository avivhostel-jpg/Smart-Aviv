
export enum TaskStatus {
  OPEN = 'פתוח',
  IN_PROGRESS = 'בתהליך',
  COMPLETED = 'הושלם'
}

export type StaffRole = 'מנהל' | 'עו"ס' | 'רכז דירות' | 'מזכירה מנהלית' | 'בעלים';

export interface FileAttachment {
  id: string;
  name: string;
  type: 'כללי' | 'רפואי' | 'תפקודי';
  url: string; // Base64 or Blob URL
  date: string;
}

export interface Resident {
  id: string;
  tz: string; 
  firstName: string;
  lastName: string;
  houseName: string;
  description: string;
  dob: string;
  entryDate: string;
  phone: string;
  guardian: string;
  riskManagement: string;
  promotionPlan: string;
  workplace: string;
  medicalInfo: string;
  recommendedTreatment: string;
  tariffCode?: string; 
  frameworkCode?: string; 
  avatar?: string;
  attachments: FileAttachment[];
}

export interface ResidentReport {
  id: string;
  residentId?: string; // Optional for house-level tasks
  houseName: string;
  date: string;
  essence: string;      
  reportingSource: string; 
  caseDetails: string;  
  actionsTaken: string; 
  teamInvolved: string; 
  conclusions: string;  
  recommendedIntervention?: string;
  status: TaskStatus;
  tasksDetails: string; 
  staffName: string;
  staffRole: StaffRole;
  notes: string;        
  closureSummary?: string; 
  timestamp: number;
}

export interface House {
  id: string;
  name: string;
  residentCount: number;
  icon: string;
  color: string;
  location?: string;
}

export interface AppState {
  view: 'landing' | 'login' | 'dashboard' | 'house' | 'resident' | 'tasks-board';
  selectedHouseId: string | null;
  selectedResidentId: string | null;
  currentUser: {
    name: string;
    role: StaffRole;
  } | null;
  initialTaskFilter?: string;
}
