import React from 'react';
import { AlertTriangle } from 'lucide-react';
import CauseCard from './CauseCard';
import type { Cause } from './types';

interface CausesListProps {
  causes: Cause[];
  selectedCause: Cause | null;
  onSelectCause: (cause: Cause | null) => void;
  onEdit?: (cause: Cause) => void;
  onDelete?: (id: string) => void;
}

export default function CausesList({ 
  causes, 
  selectedCause, 
  onSelectCause,
  onEdit,
  onDelete 
}: CausesListProps) {
  if (causes.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Aucune cause trouvée pour votre recherche</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {causes.map((cause) => (
        <CauseCard
          key={cause.id}
          cause={cause}
          isSelected={selectedCause?.id === cause.id}
          onClick={() => onSelectCause(cause.id === selectedCause?.id ? null : cause)}
          onEdit={onEdit ? () => onEdit(cause) : undefined}
          onDelete={onDelete ? () => onDelete(cause.id) : undefined}
        />
      ))}
    </div>
  );
}