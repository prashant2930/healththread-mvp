import type { DataRepository } from './DataRepository';
import {
  demoProfiles,
  demoAllergies,
  demoConditions,
  demoMedications,
  demoMedicationLogs,
  demoVitals,
  demoMedicalRecords,
  demoTimelineEvents,
  demoConsultations,
  demoCareLoops,
  demoCareTasks,
  demoSymptomCheckins,
  demoShareGrants,
  demoAuditEvents,
} from '../demo/demoData';
import { calculateAdherence } from '../../utils';
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
  ProfileSummary,
} from '../../types';

export class DemoRepository implements DataRepository {
  private profiles = [...demoProfiles];
  private allergies = [...demoAllergies];
  private conditions = [...demoConditions];
  private medications = [...demoMedications];
  private medicationLogs = [...demoMedicationLogs];
  private vitals = [...demoVitals];
  private records = [...demoMedicalRecords];
  private timelineEvents = [...demoTimelineEvents];
  private consultations = [...demoConsultations];
  private careLoops = [...demoCareLoops];
  private careTasks = [...demoCareTasks];
  private symptoms = [...demoSymptomCheckins];
  private shareGrants = [...demoShareGrants];
  private auditEvents = [...demoAuditEvents];
  private appointments: AppointmentRequest[] = [];

  async getProfiles(): Promise<HealthProfile[]> {
    return this.profiles;
  }

  async getProfileById(id: string): Promise<HealthProfile | null> {
    return this.profiles.find((p) => p.id === id) || null;
  }

  async getAllergiesByProfile(profileId: string): Promise<Allergy[]> {
    return this.allergies.filter((a) => a.profileId === profileId);
  }

  async getConditionsByProfile(profileId: string): Promise<Condition[]> {
    return this.conditions.filter((c) => c.profileId === profileId);
  }

  async getMedicationsByProfile(profileId: string): Promise<Medication[]> {
    return this.medications.filter((m) => m.profileId === profileId);
  }

  async getActiveMedications(profileId: string): Promise<Medication[]> {
    return this.medications.filter(
      (m) => m.profileId === profileId && m.status === 'active'
    );
  }

  async getMedicationLogs(medicationId: string): Promise<MedicationLog[]> {
    return this.medicationLogs.filter((l) => l.medicationId === medicationId);
  }

  async logMedication(log: Omit<MedicationLog, 'id'>): Promise<MedicationLog> {
    const newLog = { ...log, id: `ml-${Date.now()}` } as MedicationLog;
    this.medicationLogs.push(newLog);
    return newLog;
  }

  async addMedication(medication: Omit<Medication, 'id' | 'createdAt'>): Promise<Medication> {
    const newMed = { ...medication, id: `m-${Date.now()}`, createdAt: new Date().toISOString() } as Medication;
    this.medications.push(newMed);
    return newMed;
  }

  async updateMedication(id: string, updates: Partial<Medication>): Promise<Medication> {
    const idx = this.medications.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error('Medication not found');
    this.medications[idx] = { ...this.medications[idx], ...updates };
    return this.medications[idx];
  }

  async deleteMedication(id: string): Promise<void> {
    this.medications = this.medications.filter((m) => m.id !== id);
  }

  async getVitalsByProfile(profileId: string, type?: string): Promise<Vital[]> {
    return this.vitals
      .filter((v) => v.profileId === profileId && (!type || v.type === type))
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  }

  async addVital(vital: Omit<Vital, 'id'>): Promise<Vital> {
    const newVital = { ...vital, id: `v-${Date.now()}` } as Vital;
    this.vitals.push(newVital);
    return newVital;
  }

  async updateVital(id: string, updates: Partial<Vital>): Promise<Vital> {
    const idx = this.vitals.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error('Vital not found');
    this.vitals[idx] = { ...this.vitals[idx], ...updates };
    return this.vitals[idx];
  }

  async deleteVital(id: string): Promise<void> {
    this.vitals = this.vitals.filter((v) => v.id !== id);
  }

  async getRecordsByProfile(profileId: string): Promise<MedicalRecord[]> {
    return this.records.filter((r) => r.profileId === profileId);
  }

  async addRecord(record: Omit<MedicalRecord, 'id' | 'createdAt'>): Promise<MedicalRecord> {
    const newRecord = { ...record, id: `rec-${Date.now()}`, createdAt: new Date().toISOString() } as MedicalRecord;
    this.records.push(newRecord);
    return newRecord;
  }

  async updateRecord(id: string, updates: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const idx = this.records.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Record not found');
    this.records[idx] = { ...this.records[idx], ...updates };
    return this.records[idx];
  }

  async deleteRecord(id: string): Promise<void> {
    this.records = this.records.filter((r) => r.id !== id);
  }

  async getTimelineEvents(
    profileId: string,
    filter?: TimelineEventType
  ): Promise<TimelineEvent[]> {
    return this.timelineEvents
      .filter((e) => e.profileId === profileId && (!filter || e.eventType === filter))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getConsultationsByProfile(profileId: string): Promise<Consultation[]> {
    return this.consultations.filter((c) => c.profileId === profileId);
  }

  async getUpcomingFollowUps(profileId: string): Promise<Consultation[]> {
    const now = new Date().getTime();
    return this.consultations.filter(
      (c) =>
        c.profileId === profileId &&
        c.followUpDate &&
        new Date(c.followUpDate).getTime() > now
    );
  }

  async getCareLoopsByProfile(profileId: string): Promise<CareLoop[]> {
    return this.careLoops.filter((c) => c.profileId === profileId);
  }

  async createCareLoop(loop: Omit<CareLoop, 'id' | 'createdAt'>, initialTasks: Omit<CareTask, 'id' | 'careLoopId'>[]): Promise<CareLoop> {
    const newLoop = { ...loop, id: `cl-${Date.now()}`, createdAt: new Date().toISOString() } as CareLoop;
    this.careLoops.push(newLoop);
    
    for (const task of initialTasks) {
      this.careTasks.push({ ...task, id: `ct-${Date.now()}-${Math.random()}`, careLoopId: newLoop.id } as CareTask);
    }
    
    return newLoop;
  }

  async updateCareLoop(id: string, updates: Partial<CareLoop>): Promise<CareLoop> {
    const idx = this.careLoops.findIndex((l) => l.id === id);
    if (idx === -1) throw new Error('CareLoop not found');
    this.careLoops[idx] = { ...this.careLoops[idx], ...updates };
    return this.careLoops[idx];
  }

  async getCareTasksByLoop(careLoopId: string): Promise<CareTask[]> {
    return this.careTasks.filter((t) => t.careLoopId === careLoopId);
  }

  async updateCareTask(taskId: string, updates: Partial<CareTask>): Promise<CareTask> {
    const idx = this.careTasks.findIndex((t) => t.id === taskId);
    if (idx === -1) throw new Error('Task not found');
    this.careTasks[idx] = { ...this.careTasks[idx], ...updates };
    return this.careTasks[idx];
  }



  async getSymptomsByProfile(profileId: string): Promise<SymptomCheckin[]> {
    return this.symptoms.filter((s) => s.profileId === profileId);
  }

  async addSymptom(symptom: Omit<SymptomCheckin, 'id'>): Promise<SymptomCheckin> {
    const newSymptom = { ...symptom, id: `sym-${Date.now()}` } as SymptomCheckin;
    this.symptoms.push(newSymptom);
    return newSymptom;
  }

  async updateSymptom(id: string, updates: Partial<SymptomCheckin>): Promise<SymptomCheckin> {
    const idx = this.symptoms.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Symptom not found');
    this.symptoms[idx] = { ...this.symptoms[idx], ...updates };
    return this.symptoms[idx];
  }

  async deleteSymptom(id: string): Promise<void> {
    this.symptoms = this.symptoms.filter((s) => s.id !== id);
  }

  async getShareGrants(profileId: string): Promise<ShareGrant[]> {
    return this.shareGrants.filter((s) => s.profileId === profileId);
  }

  async getShareByToken(token: string): Promise<ShareGrant | null> {
    return this.shareGrants.find((s) => s.token === token) || null;
  }

  async createShare(share: Omit<ShareGrant, 'id'>): Promise<ShareGrant> {
    const newShare = { ...share, id: `sg-${Date.now()}` } as ShareGrant;
    this.shareGrants.push(newShare);
    return newShare;
  }

  async revokeShare(shareId: string): Promise<void> {
    const idx = this.shareGrants.findIndex((s) => s.id === shareId);
    if (idx !== -1) {
      this.shareGrants[idx].status = 'revoked';
      this.shareGrants[idx].revokedAt = new Date().toISOString();
    }
  }

  async getAuditEvents(profileId: string): Promise<AuditEvent[]> {
    return this.auditEvents
      .filter((a) => a.profileId === profileId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async logAuditEvent(event: Omit<AuditEvent, 'id'>): Promise<AuditEvent> {
    const newEvent = { ...event, id: `ae-${Date.now()}` } as AuditEvent;
    this.auditEvents.push(newEvent);
    return newEvent;
  }

  async getAppointmentRequests(profileId: string): Promise<AppointmentRequest[]> {
    return this.appointments.filter((a) => a.profileId === profileId);
  }

  async createAppointmentRequest(
    request: Omit<AppointmentRequest, 'id'>
  ): Promise<AppointmentRequest> {
    const newRequest = { ...request, id: `apt-${Date.now()}` } as AppointmentRequest;
    this.appointments.push(newRequest);
    return newRequest;
  }

  async getProfileSummary(profileId: string): Promise<ProfileSummary> {
    const profile = await this.getProfileById(profileId);
    if (!profile) throw new Error('Profile not found');

    const activeMeds = await this.getActiveMedications(profileId);
    const followUps = await this.getUpcomingFollowUps(profileId);
    const latestVital = (await this.getVitalsByProfile(profileId))[0];
    const latestReport = (await this.getRecordsByProfile(profileId))[0];
    const loops = await this.getCareLoopsByProfile(profileId);
    const activeLoops = loops.filter((l) => l.status === 'active');
    
    let pendingTasks = 0;
    for (const loop of activeLoops) {
      const tasks = await this.getCareTasksByLoop(loop.id);
      pendingTasks += tasks.filter((t) => t.status === 'pending').length;
    }

    return {
      profile,
      activeMedications: activeMeds.length,
      upcomingFollowUps: followUps,
      latestVital: latestVital
        ? {
            type: latestVital.type.replace('_', ' '),
            value: `${latestVital.value}${latestVital.value2 ? `/${latestVital.value2}` : ''} ${latestVital.unit}`,
            date: latestVital.recordedAt,
          }
        : undefined,
      latestReport: latestReport
        ? { title: latestReport.title, date: latestReport.recordDate }
        : undefined,
      activeCareLoops: activeLoops.length,
      pendingTasks,
    };
  }
}
