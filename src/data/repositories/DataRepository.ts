import type { 
  HealthProfile, 
  Allergy, 
  Condition, 
  Medication, 
  MedicationLog, 
  Vital, 
  MedicalRecord, 
  TimelineEvent, 
  TimelineEventType,
  Consultation,
  CareLoop,
  CareTask,
  SymptomCheckin,
  ShareGrant,
  AuditEvent,
  AppointmentRequest,
  ProfileSummary
} from '../../types';

export interface DataRepository {
  // Profiles
  getProfiles(): Promise<HealthProfile[]>;
  getProfileById(id: string): Promise<HealthProfile | null>;
  addProfile(profile: Omit<HealthProfile, 'id' | 'htId' | 'createdAt' | 'updatedAt'>): Promise<HealthProfile>;
  deleteProfile(id: string): Promise<void>;
  
  // Allergies
  getAllergiesByProfile(profileId: string): Promise<Allergy[]>;
  
  // Conditions
  getConditionsByProfile(profileId: string): Promise<Condition[]>;
  
  // Medications
  getMedicationsByProfile(profileId: string): Promise<Medication[]>;
  getActiveMedications(profileId: string): Promise<Medication[]>;
  getMedicationLogs(medicationId: string): Promise<MedicationLog[]>;
  logMedication(log: Omit<MedicationLog, 'id'>): Promise<MedicationLog>;
  addMedication(medication: Omit<Medication, 'id' | 'createdAt'>): Promise<Medication>;
  updateMedication(id: string, updates: Partial<Medication>): Promise<Medication>;
  deleteMedication(id: string): Promise<void>;
  
  // Vitals
  getVitalsByProfile(profileId: string, type?: string): Promise<Vital[]>;
  addVital(vital: Omit<Vital, 'id'>): Promise<Vital>;
  updateVital(id: string, updates: Partial<Vital>): Promise<Vital>;
  deleteVital(id: string): Promise<void>;
  
  // Medical Records
  getRecordsByProfile(profileId: string): Promise<MedicalRecord[]>;
  addRecord(record: Omit<MedicalRecord, 'id' | 'createdAt'>): Promise<MedicalRecord>;
  updateRecord(id: string, updates: Partial<MedicalRecord>): Promise<MedicalRecord>;
  deleteRecord(id: string): Promise<void>;
  
  // Timeline
  getTimelineEvents(profileId: string, filter?: TimelineEventType): Promise<TimelineEvent[]>;
  
  // Consultations
  getConsultationsByProfile(profileId: string): Promise<Consultation[]>;
  getUpcomingFollowUps(profileId: string): Promise<Consultation[]>;
  
  // Care Loops
  getCareLoopsByProfile(profileId: string): Promise<CareLoop[]>;
  getCareTasksByLoop(careLoopId: string): Promise<CareTask[]>;
  updateCareTask(taskId: string, updates: Partial<CareTask>): Promise<CareTask>;
  createCareLoop(loop: Omit<CareLoop, 'id' | 'createdAt'>, initialTasks: Omit<CareTask, 'id' | 'careLoopId'>[]): Promise<CareLoop>;
  updateCareLoop(id: string, updates: Partial<CareLoop>): Promise<CareLoop>;
  deleteCareLoop(id: string): Promise<void>;
  
  // Symptoms
  getSymptomsByProfile(profileId: string): Promise<SymptomCheckin[]>;
  addSymptom(symptom: Omit<SymptomCheckin, 'id'>): Promise<SymptomCheckin>;
  updateSymptom(id: string, updates: Partial<SymptomCheckin>): Promise<SymptomCheckin>;
  deleteSymptom(id: string): Promise<void>;
  
  // Sharing
  getShareGrants(profileId: string): Promise<ShareGrant[]>;
  getShareByToken(token: string): Promise<ShareGrant | null>;
  createShare(share: Omit<ShareGrant, 'id'>): Promise<ShareGrant>;
  revokeShare(shareId: string): Promise<void>;
  
  // Audit
  getAuditEvents(profileId: string): Promise<AuditEvent[]>;
  logAuditEvent(event: Omit<AuditEvent, 'id'>): Promise<AuditEvent>;
  
  // Appointments
  getAppointmentRequests(profileId: string): Promise<AppointmentRequest[]>;
  createAppointmentRequest(request: Omit<AppointmentRequest, 'id'>): Promise<AppointmentRequest>;
  
  // Dashboard
  getProfileSummary(profileId: string): Promise<ProfileSummary>;
}
