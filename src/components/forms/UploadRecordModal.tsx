import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useData } from '../../data/DataContext';
import toast from 'react-hot-toast';

interface UploadRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
  onSuccess: () => void;
}

export function UploadRecordModal({ isOpen, onClose, profileId, onSuccess }: UploadRecordModalProps) {
  const { addRecord } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    recordType: 'medical_report',
    recordDate: new Date().toISOString().split('T')[0],
    notes: '',
    doctor: '',
    hospital: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Please enter a record title');
      return;
    }

    setIsSubmitting(true);
    try {
      await addRecord({
        profileId,
        title: formData.title,
        recordType: formData.recordType as any,
        recordDate: formData.recordDate,
        notes: formData.notes,
        fileType: 'PDF',
        createdBy: 'user',
        metadata: {
          doctor: formData.doctor,
          hospital: formData.hospital
        }
      });
      toast.success('Record uploaded successfully');
      onSuccess();
      onClose();
      setFormData({ 
        title: '', 
        recordType: 'medical_report', 
        recordDate: new Date().toISOString().split('T')[0], 
        notes: '',
        doctor: '',
        hospital: ''
      });
    } catch (error) {
      toast.error('Failed to upload record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Record" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Title *</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500"
            placeholder="e.g. Blood Test Report"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
            disabled={isSubmitting}
            autoFocus
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Type *</label>
            <select
              className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
              value={formData.recordType}
              onChange={e => setFormData({ ...formData, recordType: e.target.value })}
              required
              disabled={isSubmitting}
            >
              <option value="prescription">Prescription</option>
              <option value="lab_report">Lab Report</option>
              <option value="medical_report">Medical Report</option>
              <option value="imaging">Imaging</option>
              <option value="discharge_summary">Discharge Summary</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Date *</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500"
              value={formData.recordDate}
              onChange={e => setFormData({ ...formData, recordDate: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Doctor (Optional)</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500"
              placeholder="e.g. Dr. Sharma"
              value={formData.doctor}
              onChange={e => setFormData({ ...formData, doctor: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Hospital (Optional)</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500"
              placeholder="e.g. Apollo"
              value={formData.hospital}
              onChange={e => setFormData({ ...formData, hospital: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">File</label>
          <div className="border-2 border-dashed border-ivory-300 rounded-xl p-4 text-center bg-ivory-50/50">
            <span className="text-sm text-navy-500">Demo mode: File upload is simulated.</span>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-ivory-200">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-navy-900 hover:bg-navy-800 text-white">
            {isSubmitting ? 'Uploading...' : 'Upload Record'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
