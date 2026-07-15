import { useState, useEffect } from 'react';
import { Clock, Filter, Activity, FileText, Pill, Plus, Calendar } from 'lucide-react';
import { useData } from '../data/DataContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { formatDate, getRelativeTime } from '../utils';
import type { TimelineEvent, HealthProfile } from '../types';

function getEventIcon(type: string) {
  switch (type) {
    case 'consultation': return <Calendar className="w-5 h-5 text-sage-600" />;
    case 'vital_recorded': return <Activity className="w-5 h-5 text-ocean-600" />;
    case 'medical_report':
    case 'lab_report': return <FileText className="w-5 h-5 text-lavender-600" />;
    case 'medication_started':
    case 'prescription': return <Pill className="w-5 h-5 text-peach-600" />;
    default: return <Clock className="w-5 h-5 text-navy-400" />;
  }
}

function getEventBg(type: string) {
  switch (type) {
    case 'consultation': return 'bg-sage-100 ring-sage-50';
    case 'vital_recorded': return 'bg-ocean-100 ring-ocean-50';
    case 'medical_report':
    case 'lab_report': return 'bg-lavender-100 ring-lavender-50';
    case 'medication_started':
    case 'prescription': return 'bg-peach-100 ring-peach-50';
    default: return 'bg-ivory-100 ring-ivory-50';
  }
}

export function TimelinePage() {
  const data = useData();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [profiles, setProfiles] = useState<HealthProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const profs = await data.getProfiles();
        setProfiles(profs);

        let allEvents: TimelineEvent[] = [];
        if (selectedProfileId === 'all') {
          for (const p of profs) {
            const e = await data.getTimelineEvents(p.id);
            allEvents = [...allEvents, ...e];
          }
        } else {
          allEvents = await data.getTimelineEvents(selectedProfileId);
        }

        // Sort descending
        allEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEvents(allEvents);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [data, selectedProfileId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-sage-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-navy-800 flex items-center gap-2">
            <Clock className="w-6 h-6 text-sage-600" />
            Health Timeline
          </h1>
          <p className="text-navy-500 mt-1">A unified view of your family's health events.</p>
        </div>
        <div className="flex gap-2">
          <select 
            className="input-field py-2 pr-10 text-sm font-medium w-auto"
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
          >
            <option value="all">All Family Members</option>
            {profiles.map(p => (
              <option key={p.id} value={p.id}>{p.fullName}</option>
            ))}
          </select>
          <Button variant="secondary" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
            Filter
          </Button>
        </div>
      </div>

      <div className="relative pl-4 sm:pl-0">
        {/* Timeline Line */}
        <div className="timeline-line hidden sm:block"></div>

        <div className="space-y-8 relative">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-ivory-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-navy-300" />
              </div>
              <h3 className="text-lg font-heading font-medium text-navy-800">No events found</h3>
              <p className="text-navy-500 mt-1">Timeline events will appear here as you add records.</p>
            </div>
          ) : (
            events.map((event, index) => {
              const profile = profiles.find(p => p.id === event.profileId);
              
              return (
                <div key={event.id} className="relative sm:pl-16 group animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                  {/* Timeline Node */}
                  <div className={`hidden sm:flex absolute left-0 w-10 h-10 rounded-full ${getEventBg(event.eventType)} ring-8 items-center justify-center z-10 transition-transform group-hover:scale-110`}>
                    {getEventIcon(event.eventType)}
                  </div>

                  <Card hover className="relative before:content-[''] before:absolute before:left-[-16px] sm:before:left-[-24px] before:top-6 before:w-4 sm:before:w-6 before:h-[2px] before:bg-ivory-200">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-heading font-semibold text-navy-800 text-lg">
                            {event.title}
                          </h3>
                          {profile && (
                            <Badge variant="gray" className="text-2xs">{profile.fullName}</Badge>
                          )}
                        </div>
                        <p className="text-navy-600 text-sm">
                          {event.description}
                        </p>
                      </div>
                      <div className="flex flex-col sm:items-end text-sm">
                        <span className="font-medium text-navy-800">{formatDate(event.date)}</span>
                        <span className="text-navy-400 text-xs">{getRelativeTime(event.date)}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
