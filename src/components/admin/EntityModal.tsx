import React from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';

interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  loading?: boolean;
  submitLabel?: string;
}

const EntityModal: React.FC<EntityModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  loading = false,
  submitLabel = 'Enregistrer',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
        
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="secondary"
          >
            Annuler
          </Button>
          <Button
            onClick={onSubmit}
            loading={loading}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EntityModal;