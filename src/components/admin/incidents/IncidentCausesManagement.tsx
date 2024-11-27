import React, { useState, useEffect } from 'react';
import { AlertTriangle, Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import IncidentCauseForm from './IncidentCauseForm';
import { getIncidentCauses, deleteIncidentCause } from '../../../services/firebase/incidents';
import type { IncidentCause } from '../../../types/admin';
import { useAuth } from '../../../hooks/useAuth';
import AccessDeniedMessage from '../../AccessDeniedMessage';

export default function IncidentCausesManagement() {
  const { isAdmin } = useAuth();
  const [causes, setCauses] = useState<IncidentCause[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCause, setEditingCause] = useState<IncidentCause | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [causeToDelete, setCauseToDelete] = useState<IncidentCause | null>(null);

  useEffect(() => {
    loadCauses();
  }, []);

  const loadCauses = async () => {
    try {
      setLoading(true);
      const loadedCauses = await getIncidentCauses();
      setCauses(loadedCauses);
      setError(null);
    } catch (error) {
      setError('Error loading incident causes. Please try again.');
      console.error('Error loading incident causes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cause: IncidentCause) => {
    setCauseToDelete(cause);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!causeToDelete) return;

    try {
      await deleteIncidentCause(causeToDelete.id);
      await loadCauses();
      setShowDeleteConfirm(false);
      setCauseToDelete(null);
    } catch (error) {
      setError('Error deleting incident cause. Please try again.');
      console.error('Error deleting incident cause:', error);
    }
  };

  const filteredCauses = causes.filter(cause =>
    cause.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cause.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAdmin) {
    return <AccessDeniedMessage />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-red-100 p-2 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Causes des Incidents</h2>
        </div>
        <button
          onClick={() => {
            setEditingCause(null);
            setShowForm(true);
          }}
          className="btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle Cause
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une cause..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-2 text-sm text-gray-500">Chargement des causes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredCauses.map((cause) => (
              <div
                key={cause.id}
                className={`bg-white rounded-lg shadow-sm border-l-4 ${
                  cause.severity === 'high' ? 'border-red-500' :
                  cause.severity === 'medium' ? 'border-yellow-500' :
                  'border-green-500'
                } p-4 hover:shadow-md transition-shadow`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{cause.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{cause.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingCause(cause);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cause)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    cause.severity === 'high' ? 'bg-red-100 text-red-800' :
                    cause.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {cause.severity === 'high' ? 'Critique' :
                     cause.severity === 'medium' ? 'Modéré' :
                     'Faible'}
                  </span>
                  <span className="text-gray-500">
                    {cause.occurrences || 0} occurrences
                  </span>
                </div>

                {cause.solutions && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Solutions:</h4>
                    <ul className="mt-2 space-y-1">
                      {cause.solutions.map((solution, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            {filteredCauses.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                Aucune cause trouvée
              </div>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <IncidentCauseForm
          cause={editingCause}
          onClose={() => {
            setShowForm(false);
            setEditingCause(null);
          }}
          onSubmit={loadCauses}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && causeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer la cause "{causeToDelete.name}" ?
              Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}