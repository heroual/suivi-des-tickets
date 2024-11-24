import React, { useState } from 'react';
import { Edit2, Trash2, PlusCircle, X, Save, Lightbulb } from 'lucide-react';

interface Idea {
  id: string;
  Titre: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  category: 'technical' | 'process' | 'customer';
  status: 'proposed' | 'approved' | 'implemented';
}

interface IdeasListProps {
  isEditing: boolean;
}

export default function IdeasList({ isEditing }: IdeasListProps) {
  const [ideas, setIdeas] = useState<Idea[]>([
    {
      id: '1',
      Titre: 'Système de notification automatique',
      description: 'Mise en place d\'alertes SMS pour les clients lors des interventions',
      impact: 'Amélioration de la satisfaction client',
      effort: 'medium',
      category: 'technical',
      status: 'proposed'
    },
    {
      id: '2',
      Titre: 'Programme de maintenance préventive',
      description: 'Inspection régulière des points critiques du réseau',
      impact: 'Réduction des pannes de 30%',
      effort: 'high',
      category: 'process',
      status: 'approved'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [formData, setFormData] = useState<Partial<Idea>>({
    Titre: '',
    description: '',
    impact: '',
    effort: 'medium',
    category: 'technical',
    status: 'proposed'
  });

  const handleEdit = (idea: Idea) => {
    setEditingIdea(idea);
    setFormData(idea);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette idée ?')) {
      setIdeas(prev => prev.filter(idea => idea.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIdea) {
      setIdeas(prev => prev.map(idea => 
        idea.id === editingIdea.id ? { ...idea, ...formData } : idea
      ));
    } else {
      const newIdea: Idea = {
        id: Date.now().toString(),
        Titre: formData.Titre || '',
        description: formData.description || '',
        impact: formData.impact || '',
        effort: formData.effort || 'medium',
        category: formData.category || 'technical',
        status: formData.status || 'proposed'
      };
      setIdeas(prev => [...prev, newIdea]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      Titre: '',
      description: '',
      impact: '',
      effort: 'medium',
      category: 'technical',
      status: 'proposed'
    });
    setEditingIdea(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      {isEditing && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Nouvelle Idée
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ideas.map(idea => (
          <div key={idea.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h4 className="font-semibold text-gray-900">{idea.Titre}</h4>
                </div>
                <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
              </div>
              {isEditing && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(idea)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(idea.id)}
                    className="text-red-600 hover:text-red-800"
                  >
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
              <span className="text-sm text-gray-500">{idea.impact}</span>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingIdea ? 'Modifier l\'idée' : 'Nouvelle idée'}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Titre</label>
                  <input
                    type="text"
                    value={formData.Titre || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, Titre: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Impact</label>
                  <input
                    type="text"
                    value={formData.impact || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Effort</label>
                    <select
                      value={formData.effort || 'medium'}
                      onChange={(e) => setFormData(prev => ({ ...prev, effort: e.target.value as any }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="low">Faible</option>
                      <option value="medium">Moyen</option>
                      <option value="high">Élevé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                    <select
                      value={formData.category || 'technical'}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="technical">Technique</option>
                      <option value="process">Processus</option>
                      <option value="customer">Client</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <select
                    value={formData.status || 'proposed'}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="proposed">Proposé</option>
                    <option value="approved">Approuvé</option>
                    <option value="implemented">Implémenté</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2 inline" />
                    {editingIdea ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}