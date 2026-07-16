import { useState, useEffect } from 'react';
import { FileText, Printer, Download, Share2, Activity, Heart, ShieldAlert, Pill, Calendar, Stethoscope, FileSearch, ArrowRight, User } from 'lucide-react';
import { useData } from '../data/DataContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { formatDate } from '../utils';
import type { 
  HealthProfile, 
  Allergy, 
  Condition, 
  Medication, 
  Vital, 
  Consultation, 
  MedicalRecord, 
  CareLoop 
} from '../types';

interface BriefData {
  profile: HealthProfile;
  allergies: Allergy[];
  conditions: Condition[];
  medications: Medication[];
  vitals: Vital[];
  consultations: Consultation[];
  upcoming: Consultation[];
  records: MedicalRecord[];
  careLoops: CareLoop[];
}

export function DoctorBriefPage() {
  const data = useData();
  const [profiles, setProfiles] = useState<HealthProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [briefData, setBriefData] = useState<BriefData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const profs = await data.getProfiles();
        setProfiles(profs);
        if (profs.length > 0) {
          // Find Rajesh Mehta or default to first
          const rajesh = profs.find(p => p.fullName.includes('Rajesh'));
          setSelectedProfileId(rajesh ? rajesh.id : profs[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [data]);

  useEffect(() => {
    async function loadBrief() {
      if (!selectedProfileId) return;
      setGenerating(true);
      try {
        await new Promise(r => setTimeout(r, 800)); // simulate generation

        const profile = await data.getProfileById(selectedProfileId);
        if (!profile) return;

        const allergies = await data.getAllergiesByProfile(selectedProfileId);
        const conditions = await data.getConditionsByProfile(selectedProfileId);
        const medications = await data.getActiveMedications(selectedProfileId);
        const vitals = await data.getVitalsByProfile(selectedProfileId);
        const consultations = await data.getConsultationsByProfile(selectedProfileId);
        const upcoming = await data.getUpcomingFollowUps(selectedProfileId);
        const records = await data.getRecordsByProfile(selectedProfileId);
        const allLoops = await data.getCareLoopsByProfile(selectedProfileId);
        const careLoops = allLoops.filter(l => l.status === 'active');

        // Log audit event
        await data.logAuditEvent({
          profileId: selectedProfileId,
          eventType: 'doctor_brief_viewed',
          timestamp: new Date().toISOString(),
          metadata: { generatedFor: profile.fullName }
        });

        setBriefData({
          profile,
          allergies,
          conditions,
          medications,
          vitals: vitals.slice(0, 5), // Only recent
          consultations: consultations.slice(0, 3), // Only recent
          upcoming,
          records: records.slice(0, 3), // Only recent
          careLoops
        });
      } catch (err) {
        console.error(err);
      } finally {
        setGenerating(false);
      }
    }
    loadBrief();
  }, [selectedProfileId, data]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-sage-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Non-printable Header Controls */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-navy-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-sage-600" />
            Doctor Brief
          </h1>
          <p className="text-navy-500 mt-2">
            Executive medical summary optimized for physicians.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            className="px-4 py-2 rounded-xl border border-ivory-300 bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-sage-500"
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
          >
            {profiles.map(p => (
              <option key={p.id} value={p.id}>{p.fullName}</option>
            ))}
          </select>
          <Button variant="secondary" leftIcon={<Share2 className="w-4 h-4" />}>
            Share
          </Button>
          <Button onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            Print / PDF
          </Button>
        </div>
      </div>

      {generating || !briefData ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <div className="w-8 h-8 border-2 border-sage-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-navy-500 font-medium">Generating structured medical summary...</p>
        </div>
      ) : (
        /* Printable Area */
        <div className="bg-white rounded-2xl shadow-sm border border-ivory-200 print:shadow-none print:border-none print:m-0 print:p-0">
          
          {/* Brief Header */}
          <div className="p-8 border-b border-ivory-200 bg-navy-900 rounded-t-2xl print:bg-white print:text-black print:border-b-2 print:border-gray-800 print:rounded-none">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-heading font-bold text-white print:text-black">
                  {briefData.profile.fullName}
                </h2>
                <div className="flex gap-6 mt-4 text-ivory-100 print:text-gray-700">
                  <span className="flex items-center gap-2"><User className="w-4 h-4" /> {briefData.profile.gender || 'Unknown'}, {Math.floor((new Date().getTime() - new Date(briefData.profile.dateOfBirth).getTime()) / 31557600000)} Yrs</span>
                  <span className="flex items-center gap-2"><Heart className="w-4 h-4" /> Blood: {briefData.profile.bloodGroup || 'Unknown'}</span>
                  <span className="flex items-center gap-2"><FileSearch className="w-4 h-4" /> ID: {briefData.profile.htId}</span>
                </div>
              </div>
              <div className="text-right text-ivory-200 print:text-gray-500 text-sm">
                <p>Generated by HealthThread</p>
                <p className="font-mono mt-1">{formatDate(new Date().toISOString())}</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-10 print:p-0 print:pt-8 print:space-y-6">
            
            {/* Critical Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-4">
              {/* Conditions */}
              <div>
                <h3 className="text-lg font-heading font-bold text-navy-900 mb-4 flex items-center gap-2 border-b border-ivory-200 pb-2 print:border-gray-300">
                  <Activity className="w-5 h-5 text-sage-600" />
                  Known Conditions
                </h3>
                {briefData.conditions.length > 0 ? (
                  <ul className="space-y-3">
                    {briefData.conditions.map(c => (
                      <li key={c.id} className="flex justify-between items-center text-sm">
                        <span className="font-medium text-navy-800">{c.name}</span>
                        <Badge variant={c.status === 'active' ? 'peach' : 'sage'} className="text-[10px] py-0.5">
                          {c.status}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-navy-400 italic">No known conditions reported.</p>
                )}
              </div>

              {/* Allergies */}
              <div>
                <h3 className="text-lg font-heading font-bold text-navy-900 mb-4 flex items-center gap-2 border-b border-ivory-200 pb-2 print:border-gray-300">
                  <ShieldAlert className="w-5 h-5 text-peach-500" />
                  Allergies
                </h3>
                {briefData.allergies.length > 0 ? (
                  <ul className="space-y-3">
                    {briefData.allergies.map(a => (
                      <li key={a.id} className="flex flex-col text-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-navy-800">{a.allergen}</span>
                          <span className={`text-xs uppercase font-bold tracking-wider ${a.severity === 'severe' ? 'text-red-600' : 'text-peach-600'}`}>
                            {a.severity}
                          </span>
                        </div>
                        {a.notes && <span className="text-navy-500 text-xs mt-0.5">{a.notes}</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-navy-400 italic">No known allergies.</p>
                )}
              </div>
            </div>

            {/* Active Medications */}
            <div>
              <h3 className="text-lg font-heading font-bold text-navy-900 mb-4 flex items-center gap-2 border-b border-ivory-200 pb-2 print:border-gray-300">
                <Pill className="w-5 h-5 text-lavender-600" />
                Active Regimen
              </h3>
              {briefData.medications.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 print:grid-cols-3">
                  {briefData.medications.map(m => (
                    <div key={m.id} className="p-4 rounded-xl bg-ivory-50 border border-ivory-200 print:bg-white print:border-gray-300">
                      <p className="font-bold text-navy-900">{m.name}</p>
                      <p className="text-sm text-sage-700 font-medium mt-1">{m.dosage}</p>
                      <p className="text-xs text-navy-500 mt-2">{m.frequency}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-navy-400 italic">No active medications.</p>
              )}
            </div>

            {/* Recent Vitals Grid */}
            <div>
              <h3 className="text-lg font-heading font-bold text-navy-900 mb-4 flex items-center gap-2 border-b border-ivory-200 pb-2 print:border-gray-300">
                <Activity className="w-5 h-5 text-ocean-500" />
                Recent Vitals Snapshot
              </h3>
              {briefData.vitals.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {briefData.vitals.map(v => (
                    <div key={v.id} className="flex-1 min-w-[150px] p-4 rounded-xl bg-white border border-ivory-200 print:border-gray-300">
                      <p className="text-xs text-navy-500 uppercase tracking-wider font-semibold mb-1">
                        {v.type.replace('_', ' ')}
                      </p>
                      <p className="text-xl font-bold text-navy-900">
                        {v.value}{v.value2 ? `/${v.value2}` : ''} <span className="text-sm font-medium text-navy-400">{v.unit}</span>
                      </p>
                      <p className="text-xs text-navy-400 mt-2">{formatDate(v.recordedAt)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-navy-400 italic">No recent vitals recorded.</p>
              )}
            </div>

            {/* Clinical Interactions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-4 print:mt-6">
              
              {/* Consultations */}
              <div>
                <h3 className="text-lg font-heading font-bold text-navy-900 mb-4 flex items-center gap-2 border-b border-ivory-200 pb-2 print:border-gray-300">
                  <Stethoscope className="w-5 h-5 text-navy-600" />
                  Recent Clinical Notes
                </h3>
                <div className="space-y-4">
                  {briefData.consultations.map(c => (
                    <div key={c.id} className="text-sm">
                      <div className="flex justify-between items-center font-bold text-navy-800">
                        <span>{c.doctorName} ({c.speciality})</span>
                        <span className="text-navy-500 font-normal">{formatDate(c.consultationDate)}</span>
                      </div>
                      <p className="text-navy-600 mt-1 line-clamp-3 print:line-clamp-none">{c.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable / Upcoming */}
              <div>
                <h3 className="text-lg font-heading font-bold text-navy-900 mb-4 flex items-center gap-2 border-b border-ivory-200 pb-2 print:border-gray-300">
                  <Calendar className="w-5 h-5 text-peach-500" />
                  Actionable / Upcoming
                </h3>
                
                <div className="space-y-4">
                  {briefData.upcoming.map(u => (
                    <div key={u.id} className="flex items-start gap-3 text-sm">
                      <ArrowRight className="w-4 h-4 text-peach-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-navy-800">Follow-up: {u.doctorName}</p>
                        <p className="text-navy-500">{u.followUpDate ? formatDate(u.followUpDate) : 'Pending Date'}</p>
                      </div>
                    </div>
                  ))}

                  {briefData.careLoops.map(loop => (
                    <div key={loop.id} className="flex items-start gap-3 text-sm">
                      <ArrowRight className="w-4 h-4 text-sage-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-navy-800">Active Loop: {loop.title}</p>
                        <p className="text-navy-500">Target: {loop.expectedFollowUpDate ? formatDate(loop.expectedFollowUpDate) : 'Ongoing'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Print Footer */}
            <div className="hidden print:block text-center text-xs text-gray-400 pt-8 border-t border-gray-300 mt-12">
              CONFIDENTIAL MEDICAL RECORD. GENERATED VIA HEALTHTHREAD.
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
