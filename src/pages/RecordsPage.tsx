import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../data/DataContext';
import { MedicalRecord } from '../types';
import { Search, Plus, FileText, FileImage, FileBarChart2, FileSymlink, Calendar, User, Building2, MoreVertical, UploadCloud, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { UploadRecordModal } from '../components/forms/UploadRecordModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { EmptyState } from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

const CATEGORY_COLORS: Record<string, string> = {
  'prescription': 'bg-sage-100 text-sage-700',
  'lab_report': 'bg-ocean-100 text-ocean-700',
  'medical_report': 'bg-lavender-100 text-lavender-700',
  'imaging': 'bg-peach-100 text-peach-700',
  'discharge_summary': 'bg-orange-100 text-orange-700',
  'other': 'bg-gray-100 text-gray-700'
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'prescription': FileSymlink,
  'lab_report': FileBarChart2,
  'medical_report': FileText,
  'imaging': FileImage,
  'discharge_summary': FileText,
  'other': FileText
};

export function RecordsPage() {
  const { getRecordsByProfile, getProfiles, deleteRecord } = useData();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
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
      getRecordsByProfile(activeProfileId).then(setRecords);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeProfileId]);

  const filteredRecords = useMemo(() => {
    return records
      .filter(r => filterCategory === 'all' || r.recordType === filterCategory)
      .filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.notes?.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime());
  }, [records, filterCategory, searchQuery]);

  const handleDelete = async () => {
    if (!deleteModalState.id) return;
    setIsDeleting(true);
    try {
      await deleteRecord(deleteModalState.id);
      setRecords(prev => prev.filter(r => r.id !== deleteModalState.id));
      toast.success('Record deleted successfully');
      setDeleteModalState({ isOpen: false, id: null });
    } catch (e) {
      toast.error('Failed to delete record');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-navy-800">Medical Records</h1>
          <p className="text-navy-600 mt-1">Your organized health history</p>
        </div>
        <button 
          className="btn-primary w-full md:w-auto shadow-md"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <UploadCloud className="w-5 h-5 mr-2" />
          Upload Record
        </button>
      </div>

      {records.length > 0 && (
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
            <input 
              type="text" 
              placeholder="Search records, doctors, or notes..." 
              className="input-field pl-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
            <FilterBadge label="All" active={filterCategory === 'all'} onClick={() => setFilterCategory('all')} />
            <FilterBadge label="Prescriptions" active={filterCategory === 'prescription'} onClick={() => setFilterCategory('prescription')} />
            <FilterBadge label="Lab Reports" active={filterCategory === 'lab_report'} onClick={() => setFilterCategory('lab_report')} />
            <FilterBadge label="Imaging" active={filterCategory === 'imaging'} onClick={() => setFilterCategory('imaging')} />
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <EmptyState 
          icon={<UploadCloud className="w-8 h-8" />}
          title="No medical records" 
          description="Keep your health history organized. Upload prescriptions, lab reports, and other medical documents." 
          actionLabel="Upload Record"
          actionIcon={<UploadCloud className="w-4 h-4" />}
          onAction={() => setIsUploadModalOpen(true)}
        />
      ) : filteredRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecords.map(record => (
            <RecordCard 
              key={record.id} 
              record={record} 
              onDelete={() => setDeleteModalState({ isOpen: true, id: record.id })} 
            />
          ))}
        </div>
      ) : (
        <div className="card p-16 text-center border-dashed border-2 border-ivory-300 bg-transparent flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <Search className="w-8 h-8 text-navy-300" />
          </div>
          <h3 className="text-xl font-heading font-semibold text-navy-700 mb-2">No matches found</h3>
          <p className="text-navy-500 max-w-sm">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}

      {activeProfileId && (
        <UploadRecordModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)} 
          profileId={activeProfileId}
          onSuccess={loadData}
        />
      )}

      <ConfirmModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        isProcessing={isDeleting}
      />
    </div>
  );
}

function FilterBadge({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all ${
        active 
          ? 'bg-navy-800 text-white shadow-md' 
          : 'bg-white text-navy-600 border border-ivory-300 hover:bg-ivory-100'
      }`}
    >
      {label}
    </button>
  );
}

function RecordCard({ record, onDelete }: { record: MedicalRecord, onDelete: () => void }) {
  const Icon = CATEGORY_ICONS[record.recordType] || FileText;
  const badgeColor = CATEGORY_COLORS[record.recordType] || CATEGORY_COLORS['other'];
  
  return (
    <div className="card group hover:shadow-lg transition-all duration-300 p-0 overflow-hidden flex flex-col cursor-pointer border-ivory-200 relative">
      <div className="h-40 bg-gradient-to-br from-ivory-50 to-ivory-100 border-b border-ivory-200 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1E293B 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
        <Icon className="w-16 h-16 text-navy-200 group-hover:scale-110 transition-transform duration-500 ease-out" />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${badgeColor} shadow-sm backdrop-blur-sm bg-white/80`}>
            {record.fileType || 'PDF'}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col relative">
        <div className="flex justify-between items-start mb-2 pr-6">
          <h3 className="font-heading font-semibold text-navy-900 leading-tight line-clamp-2">{record.title}</h3>
        </div>
        
        <button 
          className="absolute top-4 right-4 p-1.5 text-navy-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Delete Record"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        
        <div className="space-y-2 mt-auto pt-4">
          <div className="flex items-center text-xs text-navy-500">
            <Calendar className="w-3.5 h-3.5 mr-2 text-navy-400" />
            {format(parseISO(record.recordDate), 'MMM d, yyyy')}
          </div>
          
          {(record as any).metadata?.doctor && (
            <div className="flex items-center text-xs text-navy-500">
              <User className="w-3.5 h-3.5 mr-2 text-navy-400" />
              <span className="truncate">{(record as any).metadata.doctor}</span>
            </div>
          )}
          
          {(record as any).metadata?.hospital && (
            <div className="flex items-center text-xs text-navy-500">
              <Building2 className="w-3.5 h-3.5 mr-2 text-navy-400" />
              <span className="truncate">{(record as any).metadata.hospital}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
