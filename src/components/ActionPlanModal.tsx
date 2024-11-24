import React from 'react';
import { X } from 'lucide-react';
import ActionPlanContent from './ActionPlanContent';
import type { Ticket } from '../types';

interface ActionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: Ticket[];
}

export default function ActionPlanModal({ isOpen, onClose, tickets }: ActionPlanModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0" aria-hidden="true" onClick={onClose} />
        
        <div className="inline-block w-full max-w-7xl my-8 text-left align-middle transition-all transform bg-gray-100 rounded-2xl shadow-xl">
          <div className="sticky top-0 z-10 bg-white rounded-t-2xl border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Gestion des Actions et Améliorations
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          
          <div className="p-6">
            <ActionPlanContent tickets={tickets} />
          </div>
        </div>
      </div>
    </div>
  );
}