import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useData } from '../../data/DataContext';
import toast from 'react-hot-toast';

interface AddFamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const COLORS = ['#F87171', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F43F5E', '#14B8A6'];

export function AddFamilyMemberModal({ isOpen, onClose, onSuccess }: AddFamilyMemberModalProps) {
  const { addProfile } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    relationship: 'self',
    dateOfBirth: '',
    gender: 'male',
    bloodGroup: '',
    emergencyContact: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.dateOfBirth) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await addProfile({
        userId: '1',
        fullName: formData.fullName,
        relationship: formData.relationship as any,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as any,
        bloodGroup: formData.bloodGroup,
        emergencyContact: formData.emergencyContact,
        avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
      toast.success('Family member added successfully');
      onSuccess();
      onClose();
      setFormData({
        fullName: '',
        relationship: 'self',
        dateOfBirth: '',
        gender: 'male',
        bloodGroup: '',
        emergencyContact: ''
      });
    } catch (error) {
      toast.error('Failed to add family member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Family Member" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Full Name *</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500"
            placeholder="e.g. Rahul Mehta"
            value={formData.fullName}
            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            disabled={isSubmitting}
            required
            autoFocus
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Relationship *</label>
            <select
              className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
              value={formData.relationship}
              onChange={e => setFormData({ ...formData, relationship: e.target.value })}
              disabled={isSubmitting}
              required
            >
              <option value="self">Self</option>
              <option value="father">Father</option>
              <option value="mother">Mother</option>
              <option value="spouse">Spouse</option>
              <option value="child">Child</option>
              <option value="sibling">Sibling</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Gender</label>
            <select
              className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
              value={formData.gender}
              onChange={e => setFormData({ ...formData, gender: e.target.value })}
              disabled={isSubmitting}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Date of Birth *</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500"
              value={formData.dateOfBirth}
              onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
              disabled={isSubmitting}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Blood Group</label>
            <select
              className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
              value={formData.bloodGroup}
              onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
              disabled={isSubmitting}
            >
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Emergency Contact</label>
          <input 
            type="tel" 
            className="w-full px-3 py-2 border border-ivory-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500"
            placeholder="e.g. +91 98765 43210"
            value={formData.emergencyContact}
            onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
            disabled={isSubmitting}
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-ivory-200">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-navy-900 hover:bg-navy-800 text-white">
            {isSubmitting ? 'Adding...' : 'Add Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
