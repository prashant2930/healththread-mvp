import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../data/DataContext';
import { Vital } from '../types';
import { Activity, Heart, Droplet, Scale, Thermometer, Plus, MoreHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format, parseISO } from 'date-fns';

const VITAL_CONFIG = {
  blood_pressure: { label: 'Blood Pressure', unit: 'mmHg', icon: Activity, color: '#F87171' },
  heart_rate: { label: 'Heart Rate', unit: 'bpm', icon: Heart, color: '#F43F5E' },
  blood_glucose: { label: 'Blood Sugar', unit: 'mg/dL', icon: Droplet, color: '#3B82F6' },
  weight: { label: 'Weight', unit: 'kg', icon: Scale, color: '#8B5CF6' },
  temperature: { label: 'Temperature', unit: '°F', icon: Thermometer, color: '#F59E0B' },
  spo2: { label: 'SpO₂', unit: '%', icon: Activity, color: '#10B981' }
};

export function VitalsPage() {
  const { getVitalsByProfile, getProfiles } = useData();
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  
  useEffect(() => {
    // In demo mode, pick the first profile if none active (e.g., Rajesh Mehta for data)
    getProfiles().then(profiles => {
      const rajesh = profiles.find(p => p.fullName.includes('Rajesh')) || profiles[0];
      if (rajesh) setActiveProfileId(rajesh.id);
    });
  }, [getProfiles]);

  useEffect(() => {
    if (activeProfileId) {
      getVitalsByProfile(activeProfileId).then(setVitals);
    }
  }, [activeProfileId, getVitalsByProfile]);

  // Group vitals by type
  const vitalsByType = useMemo(() => {
    const grouped = vitals.reduce((acc, vital) => {
      if (!acc[vital.type]) acc[vital.type] = [];
      acc[vital.type].push(vital);
      return acc;
    }, {} as Record<string, Vital[]>);

    // Sort each group by date ascending for charts
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());
    });
    return grouped;
  }, [vitals]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-navy-800">Vitals Tracker</h1>
          <p className="text-navy-600 mt-1">Monitor health trends over time</p>
        </div>
        <button className="btn-primary w-full md:w-auto shrink-0 shadow-md">
          <Plus className="w-5 h-5 mr-2" />
          Log Vital
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(vitalsByType).map(([type, data]) => (
          <VitalChartCard key={type} type={type as keyof typeof VITAL_CONFIG} data={data} />
        ))}
      </div>
      
      {Object.keys(vitalsByType).length === 0 && (
        <div className="card p-12 text-center text-navy-500">
          <Activity className="w-12 h-12 mx-auto mb-4 text-navy-300 opacity-50" />
          <p className="text-lg">No vitals recorded yet.</p>
          <p className="text-sm">Click "Log Vital" to add your first reading.</p>
        </div>
      )}
    </div>
  );
}

function VitalChartCard({ type, data }: { type: keyof typeof VITAL_CONFIG, data: Vital[] }) {
  const config = VITAL_CONFIG[type] || VITAL_CONFIG.heart_rate;
  const Icon = config.icon;
  
  const latest = data[data.length - 1];
  if (!latest) return null;

  // Format data for Recharts
  const chartData = data.map(v => ({
    date: format(parseISO(v.recordedAt), 'MMM d'),
    value: v.value,
    value2: v.value2 // for BP
  }));

  const isBP = type === 'blood_pressure';

  return (
    <div className="card group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm border border-ivory-200" style={{ color: config.color }}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-navy-800">{config.label}</h3>
            <p className="text-xs text-navy-500">Latest: {format(parseISO(latest.recordedAt), 'MMM d, h:mm a')}</p>
          </div>
        </div>
        <button className="p-2 text-navy-400 hover:text-navy-700 hover:bg-ivory-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-end gap-2 mb-6">
        <span className="text-4xl font-heading font-bold text-navy-900 tracking-tight">
          {isBP ? `${latest.value}/${latest.value2}` : latest.value}
        </span>
        <span className="text-sm font-medium text-navy-500 mb-1">{config.unit}</span>
      </div>

      <div className="h-48 w-full -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          {isBP ? (
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
                cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Line type="monotone" dataKey="value" name="Systolic" stroke={config.color} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="value2" name="Diastolic" stroke="#60A5FA" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`color-${type}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
                cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="value" stroke={config.color} strokeWidth={3} fillOpacity={1} fill={`url(#color-${type})`} activeDot={{ r: 6, strokeWidth: 0 }} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
