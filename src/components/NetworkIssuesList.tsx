import React from 'react';
import { Users, Edit2, Trash2 } from 'lucide-react';

interface NetworkIssuesListProps {
  isEditing: boolean;
}

export default function NetworkIssuesList({ isEditing }: NetworkIssuesListProps) {
  const networkIssues = [
    {
      id: '1',
      location: 'Quartier Industriel',
      description: 'Câble principal endommagé',
      impact: 'Interruptions fréquentes du service',
      priority: 'high',
      status: 'in-progress',
      affectedCustomers: 150
    },
    {
      id: '2',
      location: 'Zone Résidentielle Sud',
      description: 'Point de distribution saturé',
      impact: 'Dégradation de la qualité de service',
      priority: 'medium',
      status: 'pending',
      affectedCustomers: 75
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {networkIssues.map(issue => (
        <div key={issue.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-900">{issue.location}</h4>
              <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
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
          <div className="mt-3 flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-1" />
            {issue.affectedCustomers} clients affectés
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              issue.priority === 'high' ? 'bg-red-100 text-red-800' :
              issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {issue.priority === 'high' ? 'Priorité haute' :
               issue.priority === 'medium' ? 'Priorité moyenne' :
               'Priorité basse'}
            </span>
            <p className="text-sm text-gray-500">{issue.impact}</p>
          </div>
        </div>
      ))}
    </div>
  );
}