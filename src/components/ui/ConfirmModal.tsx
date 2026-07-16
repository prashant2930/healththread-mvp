import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isProcessing?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  isProcessing = false
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-sage-50 text-sage-500'}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-heading font-bold text-navy-900 mb-2">{title}</h3>
        <p className="text-navy-500 mb-6">{message}</p>
        <div className="flex w-full gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={isProcessing}>
            {cancelText}
          </Button>
          <Button 
            className={`flex-1 text-white ${isDestructive ? 'bg-red-500 hover:bg-red-600' : 'bg-sage-600 hover:bg-sage-700'}`} 
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
