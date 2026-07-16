import { useState, useEffect } from 'react';
import { History, Share2, FileText, Calendar, Activity, Eye, ShieldAlert, Link as LinkIcon, Trash2, CalendarHeart } from 'lucide-react';
import { useData } from '../data/DataContext';
import { Card } from '../components/ui/Card';
import { formatDate } from '../utils';
import type { HealthProfile, AuditEvent } from '../types';

type FilterType = 'all' | 'shares' | 'brief' | 'records' | 'appointments';

export function AuditPage() {
  const data = useData();
  const [profiles, setProfiles] = useState<HealthProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    async function load() {
      try {
        const profs = await data.getProfiles();
        setProfiles(profs);
        if (profs.length > 0) {
          const defaultProf = profs.find(p => p.fullName.includes('Rajesh')) || profs[0];
          setSelectedProfileId(defaultProf.id);
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
    async function loadEvents() {
      if (!selectedProfileId) return;
      try {
        const evts = await data.getAuditEvents(selectedProfileId);
        setEvents(evts);
      } catch (err) {
        console.error(err);
      }
    }
    loadEvents();
  }, [selectedProfileId, data]);

  const filteredEvents = events.filter(e => {
    if (filter === 'all') return true;
    if (filter === 'shares') return e.eventType.startsWith('share_');
    if (filter === 'brief') return e.eventType === 'doctor_brief_viewed';
    if (filter === 'records') return e.eventType === 'record_viewed';
    if (filter === 'appointments') return e.eventType === 'appointment_requested';
    return true;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'share_created': return <LinkIcon className="w-5 h-5 text-sage-600" />;
      case 'share_opened': return <Eye className="w-5 h-5 text-ocean-500" />;
      case 'share_revoked': return <Trash2 className="w-5 h-5 text-peach-600" />;
      case 'share_expired': return <ShieldAlert className="w-5 h-5 text-gray-500" />;
      case 'doctor_brief_viewed': return <FileText className="w-5 h-5 text-navy-600" />;
      case 'record_viewed': return <Activity className="w-5 h-5 text-lavender-600" />;
      case 'appointment_requested': return <CalendarHeart className="w-5 h-5 text-peach-500" />;
      default: return <History className="w-5 h-5 text-navy-400" />;
    }
  };

  const getEventTitle = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-sage-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-navy-900 flex items-center gap-3">
            <History className="w-8 h-8 text-sage-600" />
            Access History
          </h1>
          <p className="text-navy-500 mt-2 text-lg">
            Track who accessed your health records and when.
          </p>
        </div>
        
        <select 
          className="px-4 py-2 rounded-xl border border-ivory-300 bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-sage-500 max-w-[200px]"
          value={selectedProfileId}
          onChange={(e) => setSelectedProfileId(e.target.value)}
        >
          {profiles.map(p => (
            <option key={p.id} value={p.id}>{p.fullName}</option>
          ))}
        </select>
      </div>

      <Card className="p-0 overflow-hidden shadow-sm border-ivory-200">
        
        {/* Filters */}
        <div className="p-4 border-b border-ivory-200 bg-ivory-50/50 flex overflow-x-auto hide-scrollbar gap-2">
          {[
            { id: 'all', label: 'All Activity' },
            { id: 'shares', label: 'Shares' },
            { id: 'brief', label: 'Doctor Brief' },
            { id: 'records', label: 'Medical Records' },
            { id: 'appointments', label: 'Appointments' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as FilterType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f.id
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-white text-navy-600 border border-ivory-200 hover:bg-ivory-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="p-6 sm:p-8">
          {filteredEvents.length > 0 ? (
            <div className="relative pl-2 sm:pl-4">
              {/* Vertical line connecting timeline items */}
              <div className="absolute left-[20px] sm:left-[28px] top-6 bottom-6 w-[2px] bg-ivory-200" />
              
              <div className="space-y-8 relative z-10">
                {filteredEvents.map(event => (
                  <div key={event.id} className="flex gap-4 sm:gap-6 group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white border-2 border-ivory-200 group-hover:border-sage-300 ring-4 ring-white shadow-sm transition-colors">
                      {getEventIcon(event.eventType)}
                    </div>
                    
                    <div className="flex-1 pt-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
                        <div>
                          <h4 className="text-base font-bold text-navy-900">
                            {getEventTitle(event.eventType)}
                          </h4>
                          {event.metadata && (
                            <p className="mt-1 text-sm text-navy-500">
                              {Object.entries(event.metadata).map(([k, v]) => `${k.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${v}`).join(' • ')}
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-medium text-navy-400 whitespace-nowrap">
                          {formatDate(event.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <History className="w-12 h-12 text-ivory-300 mx-auto mb-4" />
              <h3 className="text-lg font-heading font-semibold text-navy-900 mb-1">No Activity Found</h3>
              <p className="text-navy-500">No events match the selected filter.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
