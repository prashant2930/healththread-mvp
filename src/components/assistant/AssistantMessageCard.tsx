import { Pill, Activity, Calendar, FileText, ArrowRight, ActivitySquare } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatDate } from '../../utils';
import type { AssistantIntent, Medication, Vital, Consultation, MedicalRecord, CareLoop } from '../../types';
import { Link } from 'react-router-dom';

interface AssistantMessageCardProps {
  intent: AssistantIntent;
  data: any;
}

export function AssistantMessageCard({ intent, data }: AssistantMessageCardProps) {
  if (!data) return null;

  switch (intent) {
    case 'show_medicines': {
      const meds = data as Medication[];
      if (meds.length === 0) return <p className="text-sm">No active medicines found.</p>;
      
      return (
        <div className="space-y-2 mt-3">
          {meds.map(m => (
            <div key={m.id} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-ivory-200">
              <div className="p-2 bg-lavender-50 rounded-lg text-lavender-600">
                <Pill className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-navy-900 text-sm">{m.name}</p>
                <p className="text-xs text-navy-500">{m.dosage} • {m.frequency}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    case 'show_vitals': {
      const vitals = data as Vital[];
      if (vitals.length === 0) return <p className="text-sm">No recent vitals found.</p>;
      
      return (
        <div className="flex flex-wrap gap-2 mt-3">
          {vitals.slice(0, 3).map(v => (
            <div key={v.id} className="p-3 bg-white rounded-xl border border-ivory-200 flex-1 min-w-[120px]">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-3.5 h-3.5 text-ocean-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
                  {v.type.replace('_', ' ')}
                </span>
              </div>
              <p className="text-lg font-bold text-navy-900">
                {v.value}{v.value2 ? `/${v.value2}` : ''} <span className="text-xs font-medium text-navy-400">{v.unit}</span>
              </p>
            </div>
          ))}
        </div>
      );
    }

    case 'show_reports': {
      const records = data as MedicalRecord[];
      if (records.length === 0) return <p className="text-sm">No recent reports found.</p>;
      
      return (
        <div className="space-y-2 mt-3">
          {records.slice(0, 3).map(r => (
            <div key={r.id} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-ivory-200">
              <div className="p-2 bg-navy-50 rounded-lg text-navy-600">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-navy-900 text-sm">{r.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="gray" className="text-[10px]">{r.recordType.replace('_', ' ')}</Badge>
                  <span className="text-xs text-navy-400">{formatDate(r.recordDate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    case 'show_followups': {
      const consults = data as Consultation[];
      if (consults.length === 0) return <p className="text-sm">No upcoming follow-ups found.</p>;
      
      return (
        <div className="space-y-2 mt-3">
          {consults.map(c => (
            <div key={c.id} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-ivory-200">
              <div className="p-2 bg-peach-50 rounded-lg text-peach-600">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-navy-900 text-sm">Dr. {c.doctorName.replace('Dr. ', '')}</p>
                <p className="text-xs text-navy-500">{c.speciality} • {c.followUpDate ? formatDate(c.followUpDate) : 'Pending'}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }



    case 'prepare_brief': {
      return (
        <div className="mt-4 p-4 bg-navy-900 rounded-xl text-white">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-sage-400" />
            <h4 className="font-bold">Doctor Brief Prepared</h4>
          </div>
          <p className="text-sm text-ivory-200 mb-4">
            The executive summary has been generated using the latest clinical data.
          </p>
          <Link to="/doctor-brief">
            <Button variant="primary" className="w-full bg-sage-500 hover:bg-sage-600 text-white border-none">
              View Doctor Brief
            </Button>
          </Link>
        </div>
      );
    }

    default:
      return null;
  }
}
