import { v4 as uuidv4 } from 'uuid';
import { subDays, addDays, formatISO } from 'date-fns';
import type {
  User,
  HealthProfile,
  Allergy,
  Condition,
  Medication,
  MedicationLog,
  Vital,
  MedicalRecord,
  TimelineEvent,
  Consultation,
  CareLoop,
  CareTask,
  SymptomCheckin,
  ShareGrant,
  AuditEvent,
  DemoAppointmentOption,
} from '../../types';

// Use deterministic UUIDs for demo data to avoid hydration issues or just standard strings
export const demoUser: User = {
  id: 'u-1',
  email: 'arjun.mehta@example.com',
  fullName: 'Arjun Mehta',
  createdAt: subDays(new Date(), 30).toISOString(),
};

export const demoProfiles: HealthProfile[] = [
  {
    id: 'p-1',
    userId: 'u-1',
    htId: 'HT-8F2K91',
    fullName: 'Arjun Mehta',
    relationship: 'self',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    bloodGroup: 'B+',
    avatarColor: '#5B8FD4', // ocean
    createdAt: subDays(new Date(), 30).toISOString(),
    updatedAt: subDays(new Date(), 30).toISOString(),
  },
  {
    id: 'p-2',
    userId: 'u-1',
    htId: 'HT-3M7P42',
    fullName: 'Rajesh Mehta',
    relationship: 'father',
    dateOfBirth: '1962-10-12',
    gender: 'male',
    bloodGroup: 'O+',
    avatarColor: '#4CAF82', // sage
    createdAt: subDays(new Date(), 29).toISOString(),
    updatedAt: subDays(new Date(), 29).toISOString(),
  },
  {
    id: 'p-3',
    userId: 'u-1',
    htId: 'HT-6K1N85',
    fullName: 'Sunita Mehta',
    relationship: 'mother',
    dateOfBirth: '1966-03-24',
    gender: 'female',
    bloodGroup: 'A+',
    avatarColor: '#8B6CC2', // lavender
    createdAt: subDays(new Date(), 28).toISOString(),
    updatedAt: subDays(new Date(), 28).toISOString(),
  }
];

export const demoAllergies: Allergy[] = [
  {
    id: 'a-1',
    profileId: 'p-2',
    allergen: 'Penicillin',
    severity: 'moderate',
  },
  {
    id: 'a-2',
    profileId: 'p-2',
    allergen: 'Sulfa drugs',
    severity: 'mild',
  },
  {
    id: 'a-3',
    profileId: 'p-3',
    allergen: 'Aspirin',
    severity: 'severe',
  }
];

export const demoConditions: Condition[] = [
  {
    id: 'c-1',
    profileId: 'p-2',
    name: 'Type 2 Diabetes',
    diagnosedDate: '2015-06-10',
    status: 'managed',
  },
  {
    id: 'c-2',
    profileId: 'p-2',
    name: 'Hypertension',
    diagnosedDate: '2018-09-22',
    status: 'active',
  },
  {
    id: 'c-3',
    profileId: 'p-3',
    name: 'Hypothyroidism',
    diagnosedDate: '2012-11-05',
    status: 'managed',
  },
  {
    id: 'c-4',
    profileId: 'p-3',
    name: 'Vitamin D Deficiency',
    diagnosedDate: '2023-01-15',
    status: 'active',
  }
];

export const demoMedications: Medication[] = [
  {
    id: 'm-1',
    profileId: 'p-2',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    startDate: '2023-01-01',
    instructions: 'Take after meals',
    prescribingDoctor: 'Dr. Sharma',
    status: 'active',
    createdAt: subDays(new Date(), 30).toISOString(),
  },
  {
    id: 'm-2',
    profileId: 'p-2',
    name: 'Amlodipine',
    dosage: '5mg',
    frequency: 'Once daily',
    startDate: '2023-06-15',
    instructions: 'Take in the morning',
    prescribingDoctor: 'Dr. Patel',
    status: 'active',
    createdAt: subDays(new Date(), 30).toISOString(),
  },
  {
    id: 'm-3',
    profileId: 'p-2',
    name: 'Atorvastatin',
    dosage: '10mg',
    frequency: 'Once daily',
    startDate: '2023-06-15',
    instructions: 'Take at night',
    prescribingDoctor: 'Dr. Patel',
    status: 'active',
    createdAt: subDays(new Date(), 30).toISOString(),
  },
  {
    id: 'm-4',
    profileId: 'p-3',
    name: 'Levothyroxine',
    dosage: '50mcg',
    frequency: 'Once daily',
    startDate: '2020-05-10',
    instructions: 'Take on empty stomach in the morning',
    prescribingDoctor: 'Dr. Gupta',
    status: 'active',
    createdAt: subDays(new Date(), 30).toISOString(),
  },
  {
    id: 'm-5',
    profileId: 'p-3',
    name: 'Vitamin D3',
    dosage: '60000IU',
    frequency: 'Once weekly',
    startDate: '2024-01-10',
    status: 'active',
    createdAt: subDays(new Date(), 30).toISOString(),
  }
];

export const demoMedicationLogs: MedicationLog[] = [];
// Generate some logs for the last 14 days for adherence history
Array.from({ length: 14 }).forEach((_, dayOffset) => {
  const date = subDays(new Date(), dayOffset);
  const dateStr = formatISO(date, { representation: 'date' });
  
  // Rajesh's morning meds
  demoMedicationLogs.push({
    id: `ml-m1-am-${dayOffset}`,
    medicationId: 'm-1', // Metformin morning
    profileId: 'p-2',
    scheduledDate: dateStr,
    scheduledTime: '08:00',
    status: dayOffset > 0 ? 'taken' : 'pending',
    takenAt: dayOffset > 0 ? new Date(date.setHours(8, 15)).toISOString() : undefined,
  });
  
  demoMedicationLogs.push({
    id: `ml-m2-${dayOffset}`,
    medicationId: 'm-2', // Amlodipine
    profileId: 'p-2',
    scheduledDate: dateStr,
    scheduledTime: '08:00',
    status: dayOffset > 0 ? (dayOffset === 2 ? 'skipped' : 'taken') : 'pending',
    takenAt: dayOffset > 0 && dayOffset !== 2 ? new Date(date.setHours(8, 20)).toISOString() : undefined,
  });

  // Rajesh's evening meds
  demoMedicationLogs.push({
    id: `ml-m1-pm-${dayOffset}`,
    medicationId: 'm-1', // Metformin evening
    profileId: 'p-2',
    scheduledDate: dateStr,
    scheduledTime: '20:00',
    status: dayOffset > 0 ? 'taken' : 'pending',
  });

  demoMedicationLogs.push({
    id: `ml-m3-${dayOffset}`,
    medicationId: 'm-3', // Atorvastatin
    profileId: 'p-2',
    scheduledDate: dateStr,
    scheduledTime: '21:00',
    status: dayOffset > 0 ? 'taken' : 'pending',
  });

  // Sunita's morning meds
  demoMedicationLogs.push({
    id: `ml-m4-${dayOffset}`,
    medicationId: 'm-4', // Levothyroxine
    profileId: 'p-3',
    scheduledDate: dateStr,
    scheduledTime: '07:00',
    status: dayOffset > 0 ? 'taken' : 'pending',
  });
});

export const demoVitals: Vital[] = [
  // 15 days of BP readings to show trends for Rajesh Mehta (p-2)
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `v-bp-${i}`,
    profileId: 'p-2',
    type: 'blood_pressure' as const,
    value: Math.round(130 + Math.random() * 15), // systolic 130-145
    value2: Math.round(80 + Math.random() * 10), // diastolic 80-90
    unit: 'mmHg',
    recordedAt: subDays(new Date(), 15 - i).toISOString()
  })),
  // 15 days of Glucose readings for Rajesh Mehta (p-2)
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `v-bg-${i}`,
    profileId: 'p-2',
    type: 'blood_glucose' as const,
    value: Math.round(110 + Math.random() * 40), // 110-150 mg/dL
    unit: 'mg/dL',
    recordedAt: subDays(new Date(), 15 - i).toISOString(),
    notes: 'Fasting'
  })),
  { id: 'v-w1', profileId: 'p-3', type: 'weight' as const, value: 65, unit: 'kg', recordedAt: subDays(new Date(), 15).toISOString() },
];

export const demoConsultations: Consultation[] = [
  {
    id: 'cons-1',
    profileId: 'p-2',
    doctorName: 'Dr. Patel',
    speciality: 'Cardiologist',
    hospital: 'Apollo Hospital',
    consultationDate: subDays(new Date(), 30).toISOString(),
    summary: 'Routine follow-up for hypertension. BP is slightly elevated but manageable. Advised to continue current medication and reduce sodium intake.',
    followUpDate: addDays(new Date(), 60).toISOString(),
    createdAt: subDays(new Date(), 30).toISOString(),
  },
  {
    id: 'cons-2',
    profileId: 'p-3',
    doctorName: 'Dr. Gupta',
    speciality: 'Endocrinologist',
    hospital: 'Fortis Hospital',
    consultationDate: subDays(new Date(), 21).toISOString(),
    summary: 'Thyroid levels are stable. Discussed fatigue symptoms. Prescribed Vitamin D supplements for deficiency.',
    followUpDate: addDays(new Date(), 7).toISOString(),
    createdAt: subDays(new Date(), 21).toISOString(),
  }
];

export const demoTimelineEvents: TimelineEvent[] = [
  {
    id: 'te-1',
    profileId: 'p-2',
    title: 'Cardiology Consultation',
    date: demoConsultations[0].consultationDate,
    eventType: 'consultation',
    description: 'Visited Dr. Patel at Apollo Hospital.',
    sourceRecordId: 'cons-1',
    createdAt: subDays(new Date(), 30).toISOString(),
  },
  {
    id: 'te-2',
    profileId: 'p-3',
    title: 'Endocrinology Consultation',
    date: demoConsultations[1].consultationDate,
    eventType: 'consultation',
    description: 'Visited Dr. Gupta at Fortis Hospital.',
    sourceRecordId: 'cons-2',
    createdAt: subDays(new Date(), 21).toISOString(),
  }
];

export const demoMedicalRecords: MedicalRecord[] = [
  {
    id: 'rec-1',
    profileId: 'p-2',
    title: 'Lipid Panel Report',
    recordType: 'lab_report',
    recordDate: subDays(new Date(), 32).toISOString(),
    fileType: 'application/pdf',
    createdBy: 'u-1',
    createdAt: subDays(new Date(), 31).toISOString(),
  },
  {
    id: 'rec-2',
    profileId: 'p-3',
    title: 'Thyroid Function Test',
    recordType: 'lab_report',
    recordDate: subDays(new Date(), 23).toISOString(),
    fileType: 'application/pdf',
    createdBy: 'u-1',
    createdAt: subDays(new Date(), 22).toISOString(),
  },
  {
    id: 'rec-3',
    profileId: 'p-2',
    title: 'Knee MRI Scan',
    recordType: 'imaging',
    recordDate: subDays(new Date(), 45).toISOString(),
    fileType: 'image/jpeg',
    createdBy: 'u-1',
    createdAt: subDays(new Date(), 44).toISOString(),
  },
  {
    id: 'rec-4',
    profileId: 'p-2',
    title: 'Cardiology Prescription',
    recordType: 'prescription',
    recordDate: subDays(new Date(), 30).toISOString(),
    fileType: 'application/pdf',
    createdBy: 'u-1',
    createdAt: subDays(new Date(), 30).toISOString(),
  },
  {
    id: 'rec-5',
    profileId: 'p-3',
    title: 'Complete Blood Count (CBC)',
    recordType: 'lab_report',
    recordDate: subDays(new Date(), 10).toISOString(),
    fileType: 'application/pdf',
    createdBy: 'u-1',
    createdAt: subDays(new Date(), 10).toISOString(),
  }
];

export const demoCareLoops: CareLoop[] = [
  {
    id: 'cl-1',
    profileId: 'p-2',
    title: 'Hypertension Management',
    consultationId: 'cons-1',
    startDate: subDays(new Date(), 30).toISOString(),
    expectedFollowUpDate: addDays(new Date(), 60).toISOString(),
    status: 'active',
    createdAt: subDays(new Date(), 30).toISOString(),
  },
  {
    id: 'cl-2',
    profileId: 'p-3',
    title: 'Thyroid Follow-up',
    consultationId: 'cons-2',
    startDate: subDays(new Date(), 21).toISOString(),
    expectedFollowUpDate: addDays(new Date(), 7).toISOString(),
    status: 'active',
    createdAt: subDays(new Date(), 21).toISOString(),
  }
];

export const demoCareTasks: CareTask[] = [
  // Hypertension Management Loop Tasks
  {
    id: 'ct-1',
    careLoopId: 'cl-1',
    profileId: 'p-2',
    title: 'Record Blood Pressure',
    taskType: 'vital',
    status: 'pending',
    dueDate: addDays(new Date(), 2).toISOString(),
  },
  {
    id: 'ct-2',
    careLoopId: 'cl-1',
    profileId: 'p-2',
    title: 'Low Sodium Diet Plan check-in',
    taskType: 'custom',
    status: 'completed',
    dueDate: subDays(new Date(), 5).toISOString(),
  },
  {
    id: 'ct-3',
    careLoopId: 'cl-1',
    profileId: 'p-2',
    title: 'Cardiologist Follow-up Appointment',
    taskType: 'follow_up',
    status: 'pending',
    dueDate: addDays(new Date(), 25).toISOString(),
  },
  {
    id: 'ct-4',
    careLoopId: 'cl-1',
    profileId: 'p-2',
    title: 'Take Amlodipine Refill',
    taskType: 'medication',
    status: 'pending',
    dueDate: addDays(new Date(), 1).toISOString(),
  },
  
  // Thyroid Follow-up Loop Tasks
  {
    id: 'ct-5',
    careLoopId: 'cl-2',
    profileId: 'p-3',
    title: 'Get Vitamin D levels checked',
    taskType: 'upload_report',
    status: 'pending',
    dueDate: addDays(new Date(), 5).toISOString(),
  },
  {
    id: 'ct-6',
    careLoopId: 'cl-2',
    profileId: 'p-3',
    title: 'Endocrinologist Follow-up Appointment',
    taskType: 'follow_up',
    status: 'pending',
    dueDate: addDays(new Date(), 7).toISOString(),
  },
  {
    id: 'ct-7',
    careLoopId: 'cl-2',
    profileId: 'p-3',
    title: 'Report Fatigue Levels',
    taskType: 'custom',
    status: 'completed',
    dueDate: subDays(new Date(), 2).toISOString(),
  },
  {
    id: 'ct-8',
    careLoopId: 'cl-2',
    profileId: 'p-3',
    title: 'Log Weight',
    taskType: 'vital',
    status: 'pending',
    dueDate: addDays(new Date(), 1).toISOString(),
  }
];

export const demoSymptomCheckins: SymptomCheckin[] = [
  ...Array.from({ length: 6 }).map((_, i) => ({
    id: `sym-f-${i}`,
    profileId: 'p-3',
    symptomName: 'Fatigue',
    severity: Math.max(1, 8 - i), // decreasing severity over time
    recordedAt: subDays(new Date(), 15 - i * 2).toISOString(),
  })),
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `sym-k-${i}`,
    profileId: 'p-2',
    symptomName: 'Knee Pain',
    severity: Math.round(3 + Math.random() * 4), // fluctuating severity
    recordedAt: subDays(new Date(), 10 - i * 2).toISOString(),
  }))
];

export const demoShareGrants: ShareGrant[] = [
  {
    id: 'sg-1',
    profileId: 'p-2',
    token: 'A1B2C3D4E5F6G7H8',
    createdBy: 'u-1',
    permissions: [
      { category: 'basic_summary', granted: true },
      { category: 'medications', granted: true },
      { category: 'conditions', granted: true }
    ],
    accessDuration: '24hours',
    expiresAt: subDays(new Date(), 1).toISOString(), // expired
    status: 'expired',
    createdAt: subDays(new Date(), 2).toISOString(),
  }
];

export const demoAuditEvents: AuditEvent[] = [
  {
    id: 'ae-1',
    profileId: 'p-2',
    eventType: 'share_created',
    timestamp: subDays(new Date(), 2).toISOString(),
    metadata: { duration: '24hours' }
  }
];

export const demoAppointmentOptions: DemoAppointmentOption[] = [
  {
    id: 'apt-opt-1',
    doctorName: 'Dr. Suresh Reddy',
    speciality: 'Orthopaedic Surgeon',
    hospital: 'Apollo Hospital',
    address: 'Sector 26, Noida',
    date: addDays(new Date(), 1).toISOString().split('T')[0],
    time: '17:30',
    fee: '₹1200'
  },
  {
    id: 'apt-opt-2',
    doctorName: 'Dr. Kavita Sharma',
    speciality: 'Orthopaedic Surgeon',
    hospital: 'Max Super Speciality',
    address: 'Sector 16A, Noida',
    date: addDays(new Date(), 1).toISOString().split('T')[0],
    time: '18:45',
    fee: '₹1500'
  }
];
