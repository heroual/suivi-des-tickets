import React, { useState } from 'react';
import { CheckCircle, Target, Zap, Edit2, Trash2 } from 'lucide-react';
import type { Ticket } from '../types';

interface ActionsListProps {
  tickets: Ticket[];
  isEditing: boolean;
}

export default function ActionsList({ tickets, isEditing }: ActionsListProps) {
  const [showCauses, setShowCauses] = useState(false);

  const stats = {
    totalTickets: tickets.length,
    technicalIssues: tickets.filter(t => t.causeType === 'Technique').length,
    cableIssues: tickets.filter(t => t.causeType === 'Casse').length,
    clientIssues: tickets.filter(t => t.causeType === 'Client').length
  };

  return (
    <div className="space-y-6">
      {/* Causes Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Analyse des Causes
          </h3>
          <button
            onClick={() => setShowCauses(!showCauses)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showCauses ? 'Masquer les détails' : 'Voir les détails'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-900 font-medium">Techniques</span>
              <span className="text-blue-600 font-bold">
                {((stats.technicalIssues / stats.totalTickets) * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-2">
              {stats.technicalIssues}
            </p>
            {showCauses && (
              <div className="mt-3 text-sm text-blue-800">
                <ul className="space-y-1">
                  <li>• Configuration équipements</li>
                  <li>• Problèmes de synchronisation</li>
                  <li>• Interférences signal</li>
                </ul>
              </div>
            )}
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-red-900 font-medium">Câbles</span>
              <span className="text-red-600 font-bold">
                {((stats.cableIssues / stats.totalTickets) * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-red-900 mt-2">
              {stats.cableIssues}
            </p>
            {showCauses && (
              <div className="mt-3 text-sm text-red-800">
                <ul className="space-y-1">
                  <li>• Coupures accidentelles</li>
                  <li>• Usure naturelle</li>
                  <li>• Vandalisme</li>
                </ul>
              </div>
            )}
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-yellow-900 font-medium">Clients</span>
              <span className="text-yellow-600 font-bold">
                {((stats.clientIssues / stats.totalTickets) * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-yellow-900 mt-2">
              {stats.clientIssues}
            </p>
            {showCauses && (
              <div className="mt-3 text-sm text-yellow-800">
                <ul className="space-y-1">
                  <li>• Mauvaise utilisation</li>
                  <li>• Configuration incorrecte</li>
                  <li>• Équipement défectueux</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Propositions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Propositions d'Amélioration
        </h3>
        <div className="space-y-4">
          {['Court', 'Moyen', 'Long'].map((term, index) => (
            <div key={term} className={`${
              index === 0 ? 'bg-green-50' :
              index === 1 ? 'bg-blue-50' :
              'bg-purple-50'
            } rounded-lg p-4`}>
              <div className="flex justify-between items-start">
                <h4 className={`font-medium ${
                  index === 0 ? 'text-green-900' :
                  index === 1 ? 'text-blue-900' :
                  'text-purple-900'
                }`}>
                  {term} Terme ({
                    index === 0 ? '1-3' :
                    index === 1 ? '3-6' :
                    '6-12'
                  } mois)
                </h4>
                {isEditing && (
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <ul className="mt-2 space-y-2">
                <li className="flex items-start">
                  {index === 0 ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-2" />
                  ) : index === 1 ? (
                    <Target className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                  ) : (
                    <Zap className="w-5 h-5 text-purple-600 mt-0.5 mr-2" />
                  )}
                  <span className={`${
                    index === 0 ? 'text-green-800' :
                    index === 1 ? 'text-blue-800' :
                    'text-purple-800'
                  }`}>
                    {index === 0 ? 'Formation continue des techniciens' :
                     index === 1 ? 'Programme de maintenance préventive' :
                     'Modernisation de l\'infrastructure'}
                  </span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}