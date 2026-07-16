import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../data/DataContext';
import { Medication, MedicationLog } from '../types';
import { Pill, Clock, Plus, CheckCircle2, XCircle, AlertCircle, Sun, Moon, Sunrise, Coffee, Trash2 } from 'lucide-react';
import { format, parseISO, isToday, isPast } from 'date-fns';
import { AddMedicationModal } from '../components/forms/AddMedicationModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { EmptyState } from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

export function MedicationsPage() {
  const { getActiveMedications, getMedicationLogs, logMedication, getProfiles, deleteMedication } = useData();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{isOpen: boolean, id: string | null}>({isOpen: false, id: null});
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getProfiles().then(profiles => {
      const rajesh = profiles.find(p => p.fullName.includes('Rajesh')) || profiles[0];
      if (rajesh) setActiveProfileId(rajesh.id);
    });
  }, [getProfiles]);

  const loadData = () => {
    if (activeProfileId) {
      getActiveMedications(activeProfileId).then(meds => {
        setMedications(meds);
        Promise.all(meds.map(m => getMedicationLogs(m.id))).then(allLogs => {
          setLogs(allLogs.flat());
        });
      });
    }
  };

  useEffect(() => {
    loadData();
  }, [activeProfileId]);

  // Derive today's schedule
  const todaysSchedule = useMemo(() => {
    return logs
      .filter(l => isToday(parseISO(l.scheduledDate)))
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
      .map(log => ({
        ...log,
        medication: medications.find(m => m.id === log.medicationId)!
      }))
      .filter(l => l.medication != null);
  }, [logs, medications]);

  const completedToday = todaysSchedule.filter(l => l.status === 'taken').length;
  const totalToday = todaysSchedule.length;
  const adherencePercent = totalToday === 0 ? 100 : Math.round((completedToday / totalToday) * 100);

  const handleLogDose = async (logId: string, status: 'taken' | 'skipped') => {
    const log = logs.find(l => l.id === logId);
    if (!log) return;
    
    // Optimistic update
    setLogs(prev => prev.map(l => l.id === logId ? { ...l, status, takenAt: new Date().toISOString() } : l));
    
    try {
      await logMedication({
        medicationId: log.medicationId,
        profileId: log.profileId,
        scheduledDate: log.scheduledDate,
        scheduledTime: log.scheduledTime,
        status,
        takenAt: new Date().toISOString()
      });
      toast.success(status === 'taken' ? 'Dose recorded' : 'Dose skipped');
    } catch (e) {
      toast.error('Failed to update dose');
      loadData(); // revert on failure
    }
  };

  const handleDelete = async () => {
    if (!deleteModalState.id) return;
    setIsDeleting(true);
    try {
      await deleteMedication(deleteModalState.id);
      setMedications(prev => prev.filter(m => m.id !== deleteModalState.id));
      toast.success('Medication deleted successfully');
      setDeleteModalState({ isOpen: false, id: null });
      loadData();
    } catch (e) {
      toast.error('Failed to delete medication');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-navy-800">Medications</h1>
          <p className="text-navy-600 mt-1">Track doses and manage prescriptions</p>
        </div>
        <button 
          className="btn-primary w-full md:w-auto shadow-md"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Medicine
        </button>
      </div>

      {medications.length > 0 && (
        <div className="card bg-gradient-to-br from-sage-50 to-white border-sage-100 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-sage-100 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative w-32 h-32 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#E2E8F0" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="45" fill="none" stroke="#10B981" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - adherencePercent / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-sage-600">{adherencePercent}%</span>
              <span className="text-[10px] uppercase font-bold text-sage-500 tracking-wider">Today</span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left z-10">
            <h2 className="text-2xl font-heading font-bold text-navy-900 mb-2">
              {adherencePercent === 100 ? "You're all caught up!" : "Keep it up!"}
            </h2>
            <p className="text-navy-600 mb-4 max-w-md">
              You've completed {completedToday} out of {totalToday} scheduled doses today. Consistent timing is key to effective treatment.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <div className="px-4 py-2 bg-white rounded-lg border border-sage-100 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sage-500"></span>
                <span className="text-sm font-medium text-navy-700">{completedToday} Taken</span>
              </div>
              <div className="px-4 py-2 bg-white rounded-lg border border-orange-100 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                <span className="text-sm font-medium text-navy-700">{totalToday - completedToday} Remaining</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {medications.length === 0 ? (
        <EmptyState 
          icon={<Pill className="w-8 h-8" />}
          title="No medications added yet" 
          description="You don't have any active medications tracked for this profile. Add one to get started." 
          actionLabel="Add Medication"
          actionIcon={<Plus className="w-4 h-4" />}
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-heading font-bold text-navy-800 flex items-center gap-2">
              <Clock className="w-6 h-6 text-navy-400" />
              Today's Schedule
            </h2>
            
            <div className="space-y-4">
              {todaysSchedule.length > 0 ? todaysSchedule.map(log => (
                <DoseCard key={log.id} log={log} onLog={handleLogDose} />
              )) : (
                <div className="card p-8 text-center text-navy-500">
                  No medications scheduled for today.
                </div>
              )}
            </div>
          </div>

          {/* Active Prescriptions Overview */}
          <div className="space-y-6">
            <h2 className="text-xl font-heading font-bold text-navy-800 flex items-center gap-2">
              <Pill className="w-6 h-6 text-navy-400" />
              Active Prescriptions
            </h2>
            
            <div className="space-y-4">
              {medications.map(med => (
                <div key={med.id} className="card p-4 hover:border-sage-300 transition-colors group relative">
                  <h3 className="font-heading font-semibold text-navy-900 pr-8">{med.name}</h3>
                  <p className="text-sm text-navy-500 mb-3">{med.dosage}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge bg-ivory-100 text-navy-600">{med.frequency}</span>
                    {med.instructions && (
                      <span className="badge bg-sage-50 text-sage-700 truncate max-w-[150px]">
                        {med.instructions}
                      </span>
                    )}
                  </div>
                  <button 
                    className="absolute top-4 right-4 p-2 text-navy-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    onClick={() => setDeleteModalState({ isOpen: true, id: med.id })}
                    aria-label="Delete medication"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeProfileId && (
        <AddMedicationModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          profileId={activeProfileId}
          onSuccess={loadData}
        />
      )}

      <ConfirmModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Medication"
        message="Are you sure you want to delete this medication? This action cannot be undone and will remove all scheduled doses."
        confirmText="Delete"
        isProcessing={isDeleting}
      />
    </div>
  );
}

function DoseCard({ log, onLog }: { log: any, onLog: (id: string, s: 'taken'|'skipped') => void }) {
  const isMorning = parseInt(log.scheduledTime) < 12;
  const isNight = parseInt(log.scheduledTime) >= 18;
  const isPastTime = isPast(new Date(`${log.scheduledDate}T${log.scheduledTime}`));
  
  const Icon = isMorning ? Sunrise : isNight ? Moon : Sun;
  const timeColor = isMorning ? 'text-orange-500' : isNight ? 'text-indigo-500' : 'text-amber-500';
  
  return (
    <div className={`card p-0 overflow-hidden flex transition-all duration-300 ${log.status === 'taken' ? 'opacity-70 bg-sage-50/50' : 'hover:shadow-card'}`}>
      <div className={`w-2 ${log.status === 'taken' ? 'bg-sage-400' : log.status === 'skipped' ? 'bg-red-400' : 'bg-ocean-400'}`}></div>
      
      <div className="p-4 md:p-6 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4 w-full md:w-auto">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
            log.status === 'taken' ? 'bg-sage-100 text-sage-600' : 'bg-ivory-100 text-navy-500'
          }`}>
            <Icon className="w-6 h-6" />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-sm font-bold tracking-wider ${timeColor}`}>
                {format(parseISO(`${log.scheduledDate}T${log.scheduledTime}`), 'h:mm a')}
              </span>
              {log.status === 'pending' && isPastTime && (
                <span className="badge bg-red-50 text-red-600 text-[10px]">Overdue</span>
              )}
            </div>
            <h3 className={`font-heading font-bold text-lg ${log.status === 'taken' ? 'text-navy-700 line-through' : 'text-navy-900'}`}>
              {log.medication.name}
            </h3>
            <p className="text-sm text-navy-500">{log.medication.dosage} • {log.medication.instructions}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-ivory-200 pt-4 md:pt-0 mt-2 md:mt-0">
          {log.status === 'pending' ? (
            <>
              <button 
                onClick={() => onLog(log.id, 'skipped')}
                className="btn-ghost text-red-500 hover:bg-red-50 px-3 py-2 text-sm"
              >
                Skip
              </button>
              <button 
                onClick={() => onLog(log.id, 'taken')}
                className="btn-primary py-2 px-4 text-sm"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Take Now
              </button>
            </>
          ) : (
            <div className={`flex items-center gap-2 text-sm font-medium ${log.status === 'taken' ? 'text-sage-600' : 'text-red-500'}`}>
              {log.status === 'taken' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              {log.status === 'taken' ? 'Taken' : 'Skipped'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
