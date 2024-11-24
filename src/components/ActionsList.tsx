import React, { useState } from 'react';
import { CheckCircle, Target, Zap, Edit2, Trash2, X, Save } from 'lucide-react';
import type { Ticket } from '../types';

interface ActionsListProps {
  tickets: Ticket[];
  isEditing: boolean;
}

interface Proposition {
  id: string;
  Durée: 'short' | 'medium' | 'long';
  Titre: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export default function ActionsList({ tickets, isEditing }: ActionsListProps) {
  const [propositions, setPropositions] = useState<Proposition[]>([
    {
      id: '1',
      Durée: 'short',
      Titre: 'Formation continue des techniciens',
      description: 'Programme de formation mensuel sur les nouvelles technologies et procédures',
      status: 'in-progress'
    },
    {
      id: '2',
      Durée: 'medium',
      Titre: 'Programme de maintenance préventive',
      description: 'Mise en place d\'un système de maintenance préventive pour réduire les pannes',
      status: 'pending'
    },
    {
      id: '3',
      Durée: 'long',
      Titre: 'Modernisation de l\'infrastructure',
      description: 'Plan de modernisation complète de l\'infrastructure réseau',
      status: 'pending'
    }
  ]);

  const [editingProposition, setEditingProposition] = useState<Proposition | null>(null);

  const handleEdit = (proposition: Proposition) => {
    setEditingProposition(proposition);
  };

  const handleSave = (id: string, updates: Partial<Proposition>) => {
    setPropositions(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ));
    setEditingProposition(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette proposition ?')) {
      setPropositions(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleAdd = () => {
    const newProposition: Proposition = {
      id: Date.now().toString(),
      Durée: 'short',
      Titre: 'Nouvelle proposition',
      description: 'Description de la nouvelle proposition',
      status: 'pending'
    };
    setPropositions(prev => [...prev, newProposition]);
    setEditingProposition(newProposition);
  };

  const getDuréeColor = (Durée: string) => {
    switch (Durée) {
      case 'short':
        return 'bg-green-50 text-green-900';
      case 'medium':
        return 'bg-blue-50 text-blue-900';
      case 'long':
        return 'bg-purple-50 text-purple-900';
      default:
        return 'bg-gray-50 text-gray-900';
    }
  };

  const getDuréeIcon = (Durée: string) => {
    switch (Durée) {
      case 'short':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'medium':
        return <Target className="w-5 h-5 text-blue-600" />;
      case 'long':
        return <Zap className="w-5 h-5 text-purple-600" />;
      default:
        return null;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {isEditing && (
        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>Ajouter une proposition</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {propositions.map((proposition) => (
          <div
            key={proposition.id}
            className={`${getDuréeColor(proposition.Durée)} rounded-lg p-6 shadow-sm`}
          >
            {editingProposition?.id === proposition.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre</label>
                  <input
                    type="text"
                    value={editingProposition.Titre}
                    onChange={(e) => setEditingProposition(prev => prev ? { ...prev, Titre: e.target.value } : prev)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={editingProposition.description}
                    onChange={(e) => setEditingProposition(prev => prev ? { ...prev, description: e.target.value } : prev)}
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Duréee</label>
                    <select
                      value={editingProposition.Durée}
                      onChange={(e) => setEditingProposition(prev => prev ? { ...prev, Durée: e.target.value as any } : prev)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="short">Court Duréee</option>
                      <option value="medium">Moyen Duréee</option>
                      <option value="long">Long Duréee</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Statut</label>
                    <select
                      value={editingProposition.status}
                      onChange={(e) => setEditingProposition(prev => prev ? { ...prev, status: e.target.value as any } : prev)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="pending">En attente</option>
                      <option value="in-progress">En cours</option>
                      <option value="completed">Duréeiné</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingProposition(null)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSave(proposition.id, editingProposition)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    {getDuréeIcon(proposition.Durée)}
                    <h3 className="text-lg font-semibold">{proposition.Titre}</h3>
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(proposition)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(proposition.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm">{proposition.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(proposition.status)}`}>
                    {proposition.status === 'completed' ? 'Duréeiné' :
                     proposition.status === 'in-progress' ? 'En cours' :
                     'En attente'}
                  </span>
                  <span className="text-sm">
                    {proposition.Durée === 'short' ? 'Court Duréee (1-3 mois)' :
                     proposition.Durée === 'medium' ? 'Moyen Duréee (3-6 mois)' :
                     'Long Duréee (6-12 mois)'}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}