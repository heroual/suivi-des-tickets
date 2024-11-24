import React, { useState } from 'react';
import { Users, Edit2, Trash2, PlusCircle, X, Save } from 'lucide-react';

interface NetworkIssue {
  id: string;
  location: string;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'resolved';
  affectedCustomers: number;
}

interface NetworkIssuesListProps {
  isEditing: boolean;
}

export default function NetworkIssuesList({ isEditing }: NetworkIssuesListProps) {
  const [issues, setIssues] = useState<NetworkIssue[]>([
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
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingIssue, setEditingIssue] = useState<NetworkIssue | null>(null);
  const [formData, setFormData] = useState<Partial<NetworkIssue>>({
    location: '',
    description: '',
    impact: '',
    priority: 'medium',
    status: 'pending',
    affectedCustomers: 0
  });

  const handleEdit = (issue: NetworkIssue) => {
    setEditingIssue(issue);
    setFormData(issue);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce point noir ?')) {
      setIssues(prev => prev.filter(issue => issue.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIssue) {
      setIssues(prev => prev.map(issue => 
        issue.id === editingIssue.id ? { ...issue, ...formData } : issue
      ));
    } else {
      const newIssue: NetworkIssue = {
        id: Date.now().toString(),
        location: formData.location || '',
        description: formData.description || '',
        impact: formData.impact || '',
        priority: formData.priority || 'medium',
        status: formData.status || 'pending',
        affectedCustomers: formData.affectedCustomers || 0
      };
      setIssues(prev => [...prev, newIssue]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      location: '',
      description: '',
      impact: '',
      priority: 'medium',
      status: 'pending',
      affectedCustomers: 0
    });
    setEditingIssue(null);
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
            Nouveau Point Noir
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {issues.map(issue => (
          <div key={issue.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">{issue.location}</h4>
                <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
              </div>
              {isEditing && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(issue)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(issue.id)}
                    className="text-red-600 hover:text-red-800"
                  >
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

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingIssue ? 'Modifier le Point Noir' : 'Nouveau Point Noir'}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Localisation</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
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
                    <label className="block text-sm font-medium text-gray-700">Priorité</label>
                    <select
                      value={formData.priority || 'medium'}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Clients affectés</label>
                    <input
                      type="number"
                      value={formData.affectedCustomers || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, affectedCustomers: parseInt(e.target.value) }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <select
                    value={formData.status || 'pending'}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="pending">En attente</option>
                    <option value="in-progress">En cours</option>
                    <option value="resolved">Résolu</option>
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
                    {editingIssue ? 'Mettre à jour' : 'Ajouter'}
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