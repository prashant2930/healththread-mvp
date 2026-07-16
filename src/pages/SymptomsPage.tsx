import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../data/DataContext';
import { SymptomCheckin } from '../types';
import { Activity, Plus, AlertCircle, HeartPulse, ListPlus, Flame, Smile, Frown, Meh, Pill } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

export function SymptomsPage() {
  const { getSymptomsByProfile, getProfiles, addSymptom } = useData();
  const [symptoms, setSymptoms] = useState<SymptomCheckin[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  // Form State
  const [newSymptomName, setNewSymptomName] = useState('');
  const [newSeverity, setNewSeverity] = useState<number>(5);
  const [newNotes, setNewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    getProfiles().then(profiles => {
      const active = profiles.find(p => p.fullName.includes('Rajesh')) || profiles[0];
      if (active) setActiveProfileId(active.id);
    });
  }, [getProfiles]);

  useEffect(() => {
    if (activeProfileId) {
      loadSymptoms();
    }
  }, [activeProfileId]);

  const loadSymptoms = async () => {
    if (activeProfileId) {
      const data = await getSymptomsByProfile(activeProfileId);
      setSymptoms(data.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()));
    }
  };

  const handleAddSymptom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfileId || !newSymptomName.trim()) return;

    setIsSubmitting(true);
    try {
      await addSymptom({
        profileId: activeProfileId,
        symptomName: newSymptomName.trim(),
        severity: newSeverity,
        notes: newNotes.trim(),
        recordedAt: new Date().toISOString()
      });
      
      // Reset form
      setNewSymptomName('');
      setNewSeverity(5);
      setNewNotes('');
      
      // Reload
      await loadSymptoms();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group by symptom name for charts
  const symptomsByName = useMemo(() => {
    const grouped = symptoms.reduce((acc, symptom) => {
      const name = symptom.symptomName.toLowerCase();
      if (!acc[name]) acc[name] = [];
      acc[name].push(symptom);
      return acc;
    }, {} as Record<string, SymptomCheckin[]>);

    // Sort by date ASC for charting
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());
    });
    return grouped;
  }, [symptoms]);

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return 'text-sage-600 bg-sage-50 border-sage-200';
    if (severity <= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (severity <= 8) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getSeverityIcon = (severity: number) => {
    if (severity <= 3) return <Smile className="w-5 h-5" />;
    if (severity <= 6) return <Meh className="w-5 h-5" />;
    return <Frown className="w-5 h-5" />;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-navy-900">Symptoms Tracker</h1>
        <p className="text-navy-600 mt-1">Log and monitor how you're feeling over time.</p>
      </div>

      {/* Log a Symptom Section */}
      <div className="card p-6 md:p-8 bg-gradient-to-br from-white to-ivory-50 border border-ivory-200 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-pastel-lavender/30 rounded-xl text-navy-700">
            <ListPlus className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-heading font-semibold text-navy-800">Log a New Symptom</h2>
        </div>

        <form onSubmit={handleAddSymptom} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">What are you feeling?</label>
                <input 
                  type="text" 
                  value={newSymptomName}
                  onChange={e => setNewSymptomName(e.target.value)}
                  placeholder="e.g., Headache, Nausea, Fatigue..."
                  className="w-full px-4 py-3 rounded-xl border border-ivory-200 focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">Notes (optional)</label>
                <textarea 
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Any triggers or extra details..."
                  className="w-full px-4 py-3 rounded-xl border border-ivory-200 focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white resize-none h-24"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-4">Severity: <span className="text-navy-900 font-bold">{newSeverity}</span> / 10</label>
              
              <div className="flex items-center justify-between gap-1 sm:gap-2 mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNewSeverity(num)}
                    className={`
                      w-8 h-10 sm:w-10 sm:h-12 rounded-lg flex items-center justify-center font-medium transition-all
                      ${newSeverity === num 
                        ? 'bg-navy-800 text-white shadow-md transform scale-110' 
                        : 'bg-white text-navy-500 border border-ivory-200 hover:bg-ivory-100'}
                    `}
                  >
                    {num}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between text-xs text-navy-500 font-medium px-2">
                <span className="flex items-center gap-1"><Smile className="w-4 h-4 text-sage-500"/> Mild</span>
                <span className="flex items-center gap-1"><Meh className="w-4 h-4 text-yellow-500"/> Moderate</span>
                <span className="flex items-center gap-1"><Frown className="w-4 h-4 text-red-500"/> Severe</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-ivory-100">
            <button 
              type="submit" 
              disabled={isSubmitting || !newSymptomName.trim()}
              className="btn-primary shadow-md px-8 py-3 text-lg rounded-xl disabled:opacity-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Symptom'}
            </button>
          </div>
        </form>
      </div>

      {/* Trends Section */}
      {Object.keys(symptomsByName).length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-navy-600" />
            <h2 className="text-xl font-heading font-semibold text-navy-800">Symptom Trends</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(symptomsByName).map(([name, data]) => (
              <SymptomTrendCard key={name} name={name} data={data} />
            ))}
          </div>
        </div>
      )}

      {/* History Timeline */}
      {symptoms.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-navy-600" />
            <h2 className="text-xl font-heading font-semibold text-navy-800">Recent Logs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {symptoms.map(symptom => {
              const colorClass = getSeverityColor(symptom.severity);
              return (
                <div key={symptom.id} className="card p-5 bg-white border border-ivory-200 rounded-2xl hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-heading font-semibold text-lg text-navy-900 capitalize">{symptom.symptomName}</h3>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${colorClass}`}>
                      {getSeverityIcon(symptom.severity)}
                      {symptom.severity} / 10
                    </div>
                  </div>
                  {symptom.notes && (
                    <p className="text-sm text-navy-600 mb-4 line-clamp-2">{symptom.notes}</p>
                  )}
                  <p className="text-xs text-navy-400 font-medium">
                    {format(parseISO(symptom.recordedAt), 'MMM d, yyyy • h:mm a')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {symptoms.length === 0 && (
        <div className="card p-12 text-center text-navy-500 border-dashed border-2 border-ivory-200">
          <HeartPulse className="w-12 h-12 mx-auto mb-4 text-navy-300 opacity-50" />
          <p className="text-lg font-heading text-navy-700">No symptoms logged yet.</p>
          <p className="text-sm mt-1">Use the form above to start tracking how you feel.</p>
        </div>
      )}
    </div>
  );
}

function SymptomTrendCard({ name, data }: { name: string, data: SymptomCheckin[] }) {
  // Format for chart
  const chartData = data.map(d => ({
    date: format(parseISO(d.recordedAt), 'MMM d'),
    severity: d.severity
  }));

  // If there's only 1 point, line chart won't render a line, but area chart will show dot if we configure it, or we can just show a message.
  
  return (
    <div className="card p-6 bg-white border border-ivory-200 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading font-semibold text-lg text-navy-800 capitalize">{name}</h3>
        <span className="text-xs font-medium px-2 py-1 bg-ivory-100 text-navy-600 rounded-lg">
          {data.length} logs
        </span>
      </div>
      
      {data.length > 1 ? (
        <div className="h-48 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`color-symptom-${name}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} domain={[0, 10]} ticks={[0, 5, 10]} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.08)' }}
                cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="severity" 
                stroke="#8B5CF6" 
                strokeWidth={3} 
                fill={`url(#color-symptom-${name})`} 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#8B5CF6' }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-navy-400 text-sm flex-col gap-2">
          <Activity className="w-8 h-8 opacity-30" />
          <p>Need at least 2 logs to show a trend.</p>
        </div>
      )}
    </div>
  );
}
