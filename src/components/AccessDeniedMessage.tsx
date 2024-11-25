import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function AccessDeniedMessage() {
  return (
    <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
      <div className="flex items-center space-x-3 text-red-700">
        <ShieldAlert className="w-5 h-5" />
        <span className="font-medium">Accès réservé à l'administrateur</span>
      </div>
    </div>
  );
}