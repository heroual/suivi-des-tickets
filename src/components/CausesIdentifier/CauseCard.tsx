import React from 'react';
import { AlertTriangle, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import type { Cause } from './types';
import { getCauseTypeStyles } from './utils';

interface CauseCardProps {
  cause: Cause;
  isSelected: boolean;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function CauseCard({ cause, isSelected, onClick, onEdit, onDelete }: CauseCardProps) {
  const { bgColor, badgeColor, iconColor } = getCauseTypeStyles(cause.type);

  return (
    <div
      className={`cursor-pointer rounded-lg p-6 transition-all duration-200 ${
        isSelected
          ? 'ring-2 ring-blue-500 shadow-lg transform scale-[1.02]'
          : 'hover:shadow-md'
      } ${bgColor}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}>
          {cause.type}
        </span>
        <div className="flex items-center space-x-2">
          {onEdit && onDelete && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1 hover:bg-white/50 rounded-full transition-colors"
              >
                <Edit2 className="w-4 h-4 text-blue-600" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1 hover:bg-white/50 rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </>
          )}
          {cause.type === 'Technique' ? (
            <AlertTriangle className={`w-5 h-5 ${iconColor}`} />
          ) : cause.type === 'Casse' ? (
            <AlertTriangle className={`w-5 h-5 ${iconColor}`} />
          ) : (
            <CheckCircle className={`w-5 h-5 ${iconColor}`} />
          )}
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2">{cause.description}</h3>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Symptômes:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {cause.symptoms.map((symptom, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        {isSelected && (
          <>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Solutions:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {cause.solutions.map((solution, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Mesures préventives:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {cause.preventiveMeasures.map((measure, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>{measure}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}