import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface IdeasListProps {
  isEditing: boolean;
}

export default function IdeasList({ isEditing }: IdeasListProps) {
  const ideas = [
    {
      id: '1',
      title: 'Système de notification automatique',
      description: 'Mise en place d\'alertes SMS pour les clients lors des interventions',
      impact: 'Amélioration de la satisfaction client',
      effort: 'medium',
      category: 'technical',
      status: 'proposed'
    },
    {
      id: '2',
      title: 'Programme de maintenance préventive',
      description: 'Inspection régulière des points critiques du réseau',
      impact: 'Réduction des pannes de 30%',
      effort: 'high',
      category: 'process',
      status: 'approved'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {ideas.map(idea => (
        <div key={idea.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-900">{idea.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
            </div>
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
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                idea.effort === 'low' ? 'bg-green-100 text-green-800' :
                idea.effort === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                Effort: {
                  idea.effort === 'low' ? 'Faible' :
                  idea.effort === 'medium' ? 'Moyen' :
                  'Élevé'
                }
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                idea.status === 'proposed' ? 'bg-gray-100 text-gray-800' :
                idea.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {idea.status === 'proposed' ? 'Proposé' :
                 idea.status === 'approved' ? 'Approuvé' :
                 'Implémenté'}
              </span>
            </div>
            <p className="text-sm text-gray-500">{idea.impact}</p>
          </div>
        </div>
      ))}
    </div>
  );
}