import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useData } from '../../data/DataContext';
import toast from 'react-hot-toast';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
  onSuccess: () => void;
}

export function AddMedicationModal({ isOpen, onClose, profileId, onSuccess }: AddMedicationModalProps) {
  const { addMedication } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    instructions: '',
    startDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage || !formData.frequency) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await addMedication({
        profileId,
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        instructions: formData.instructions,
        startDate: formData.startDate,
        status: 'active'
      });
      toast.success('Medication added successfully');
      onSuccess();
      onClose();
      setFormData({ name: '', dosage: '', frequency: '', instructions: '', startDate: new Date().toISOString().split('T')[0] });
    } catch (error) {
      toast.error('Failed to add medication');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Medication" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Medication Name *</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500"
            placeholder="e.g. Metformin"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={isSubmitting}
            autoFocus
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Dosage *</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500"
              placeholder="e.g. 500mg"
              value={formData.dosage}
              onChange={e => setFormData({ ...formData, dosage: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Frequency *</label>
            <select
              className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
              value={formData.frequency}
              onChange={e => setFormData({ ...formData, frequency: e.target.value })}
              required
              disabled={isSubmitting}
            >
              <option value="">Select frequency</option>
              <option value="Once daily">Once daily</option>
              <option value="Twice daily">Twice daily</option>
              <option value="Three times daily">Three times daily</option>
              <option value="As needed">As needed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Instructions</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500"
            placeholder="e.g. After meals"
            value={formData.instructions}
            onChange={e => setFormData({ ...formData, instructions: e.target.value })}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Start Date *</label>
          <input 
            type="date" 
            className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500"
            value={formData.startDate}
            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-ivory-200">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-navy-900 hover:bg-navy-800 text-white">
            {isSubmitting ? 'Adding...' : 'Add Medication'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
