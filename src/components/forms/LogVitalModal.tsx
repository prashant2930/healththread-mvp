import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useData } from '../../data/DataContext';
import toast from 'react-hot-toast';

interface LogVitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
  onSuccess: () => void;
}

export function LogVitalModal({ isOpen, onClose, profileId, onSuccess }: LogVitalModalProps) {
  const { addVital } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'blood_pressure',
    value: '',
    value2: '', // For diastolic BP
    unit: 'mmHg',
    recordedAt: new Date().toISOString().slice(0, 16), // YYYY-MM-DDThh:mm
    notes: ''
  });

  const handleTypeChange = (type: string) => {
    let unit = '';
    switch (type) {
      case 'blood_pressure': unit = 'mmHg'; break;
      case 'heart_rate': unit = 'bpm'; break;
      case 'blood_glucose': unit = 'mg/dL'; break;
      case 'weight': unit = 'kg'; break;
      case 'temperature': unit = '°F'; break;
      case 'spo2': unit = '%'; break;
    }
    setFormData({ ...formData, type, unit, value: '', value2: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.value) {
      toast.error('Please enter a value');
      return;
    }
    
    if (formData.type === 'blood_pressure' && !formData.value2) {
      toast.error('Please enter a diastolic value');
      return;
    }

    setIsSubmitting(true);
    try {
      await addVital({
        profileId,
        type: formData.type as any,
        value: parseFloat(formData.value),
        value2: formData.type === 'blood_pressure' ? parseFloat(formData.value2) : undefined,
        unit: formData.unit,
        recordedAt: new Date(formData.recordedAt).toISOString(),
        notes: formData.notes
      });
      toast.success('Vital logged successfully');
      onSuccess();
      onClose();
      setFormData({
        ...formData,
        value: '',
        value2: '',
        notes: '',
        recordedAt: new Date().toISOString().slice(0, 16)
      });
    } catch (error) {
      toast.error('Failed to log vital');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Vital" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Vital Type *</label>
          <select
            className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
            value={formData.type}
            onChange={e => handleTypeChange(e.target.value)}
            disabled={isSubmitting}
            required
          >
            <option value="blood_pressure">Blood Pressure</option>
            <option value="heart_rate">Heart Rate</option>
            <option value="blood_glucose">Blood Sugar</option>
            <option value="weight">Weight</option>
            <option value="temperature">Temperature</option>
            <option value="spo2">SpO₂</option>
          </select>
        </div>

        {formData.type === 'blood_pressure' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Systolic *</label>
              <div className="relative">
                <input 
                  type="number" 
                  step="any"
                  className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 pr-12"
                  value={formData.value}
                  onChange={e => setFormData({ ...formData, value: e.target.value })}
                  disabled={isSubmitting}
                  required
                />
                <span className="absolute right-3 top-2.5 text-sm text-navy-400">{formData.unit}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Diastolic *</label>
              <div className="relative">
                <input 
                  type="number" 
                  step="any"
                  className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 pr-12"
                  value={formData.value2}
                  onChange={e => setFormData({ ...formData, value2: e.target.value })}
                  disabled={isSubmitting}
                  required
                />
                <span className="absolute right-3 top-2.5 text-sm text-navy-400">{formData.unit}</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Value *</label>
            <div className="relative">
              <input 
                type="number" 
                step="any"
                className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 pr-12"
                value={formData.value}
                onChange={e => setFormData({ ...formData, value: e.target.value })}
                disabled={isSubmitting}
                required
              />
              <span className="absolute right-3 top-2.5 text-sm text-navy-400">{formData.unit}</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Date & Time *</label>
          <input 
            type="datetime-local" 
            className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500"
            value={formData.recordedAt}
            onChange={e => setFormData({ ...formData, recordedAt: e.target.value })}
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Notes (Optional)</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500"
            placeholder="e.g. After breakfast"
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            disabled={isSubmitting}
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-ivory-200">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-navy-900 hover:bg-navy-800 text-white">
            {isSubmitting ? 'Saving...' : 'Log Vital'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
