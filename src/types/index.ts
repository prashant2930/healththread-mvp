// User & Auth
export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface HealthProfile {
  id: string;
  userId: string;
  htId: string; // e.g. 'HT-8F2K91'
  fullName: string;
  relationship: 'self' | 'father' | 'mother' | 'spouse' | 'child' | 'sibling' | 'other';
  dateOfBirth: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  emergencyContact?: string;
  avatarColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface Allergy {
  id: string;
  profileId: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface Condition {
  id: string;
  profileId: string;
  name: string;
  diagnosedDate?: string;
  status: 'active' | 'resolved' | 'managed';
  notes?: string;
}

export interface Medication {
  id: string;
  profileId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  instructions?: string;
  prescribingDoctor?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  profileId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'taken' | 'skipped' | 'pending';
  takenAt?: string;
  notes?: string;
}

export interface Vital {
  id: string;
  profileId: string;
  type: 'blood_pressure' | 'heart_rate' | 'blood_glucose' | 'weight' | 'temperature' | 'spo2';
  value: number;
  value2?: number; // for BP diastolic
  unit: string;
  recordedAt: string;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  profileId: string;
  title: string;
  recordType: 'prescription' | 'lab_report' | 'medical_report' | 'imaging' | 'discharge_summary' | 'other';
  recordDate: string;
  filePath?: string;
  fileType?: string;
  fileSize?: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export type TimelineEventType = 'consultation' | 'prescription' | 'lab_report' | 'medical_report' | 'medication_started' | 'medication_stopped' | 'vital_recorded' | 'symptom_update' | 'follow_up' | 'procedure' | 'other';

export interface TimelineEvent {
  id: string;
  profileId: string;
  title: string;
  date: string;
  eventType: TimelineEventType;
  description: string;
  sourceRecordId?: string;
  sourceRecordType?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Consultation {
  id: string;
  profileId: string;
  doctorName: string;
  speciality: string;
  hospital?: string;
  consultationDate: string;
  summary: string;
  instructions?: string;
  followUpDate?: string;
  createdAt: string;
}

export interface CareLoop {
  id: string;
  profileId: string;
  title: string;
  consultationId?: string;
  startDate: string;
  expectedFollowUpDate?: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

export interface CareTask {
  id: string;
  careLoopId: string;
  profileId: string;
  title: string;
  taskType: 'medication' | 'symptom_update' | 'vital' | 'upload_report' | 'follow_up' | 'custom';
  status: 'pending' | 'completed' | 'skipped';
  dueDate?: string;
  completedAt?: string;
  notes?: string;
}

export interface SymptomCheckin {
  id: string;
  profileId: string;
  symptomName: string;
  severity: number; // 1-10
  notes?: string;
  recordedAt: string;
}

export interface ShareGrant {
  id: string;
  profileId: string;
  token: string;
  createdBy: string;
  permissions: SharePermission[];
  accessDuration: '30min' | '2hours' | '24hours' | '7days';
  expiresAt: string;
  revokedAt?: string;
  status: 'active' | 'expired' | 'revoked';
  createdAt: string;
}

export interface SharePermission {
  category: 'basic_summary' | 'allergies' | 'medications' | 'conditions' | 'consultations' | 'medical_records' | 'vitals' | 'care_loops';
  granted: boolean;
}

export interface AuditEvent {
  id: string;
  profileId: string;
  eventType: 'share_created' | 'share_opened' | 'record_viewed' | 'doctor_brief_viewed' | 'share_revoked' | 'share_expired';
  shareId?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface AppointmentRequest {
  id: string;
  profileId: string;
  speciality: string;
  location: string;
  preferredDate: string;
  preferredTime: string;
  hospitalPreference?: string;
  selectedOption?: DemoAppointmentOption;
  status: 'draft' | 'awaiting_confirmation' | 'requested' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface DemoAppointmentOption {
  id: string;
  doctorName: string;
  speciality: string;
  hospital: string;
  address: string;
  date: string;
  time: string;
  fee: string;
}

// Dashboard types
export interface ProfileSummary {
  profile: HealthProfile;
  activeMedications: number;
  upcomingFollowUps: Consultation[];
  latestVital?: { type: string; value: string; date: string };
  latestReport?: { title: string; date: string };
  activeCareLoops: number;
  pendingTasks: number;
}

// Assistant types
export type AssistantIntent = 
  | 'show_medicines'
  | 'show_reports'
  | 'show_followups'
  | 'show_vitals'
  | 'prepare_brief'
  | 'find_appointment'
  | 'unknown';

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  intent?: AssistantIntent;
  data?: unknown;
  timestamp: string;
}
