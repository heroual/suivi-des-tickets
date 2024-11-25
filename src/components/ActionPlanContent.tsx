import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Target,
  Brain,
  Network,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertTriangle
} from 'lucide-react';
import type { Ticket, ActionCause } from '../types';
import NetworkIssuesList from './NetworkIssuesList';
import IdeasList from './IdeasList';
import ActionsList from './ActionsList';
import { useAuth } from '../hooks/useAuth';
import { getActionCauses, addActionCause, updateActionCause, deleteActionCause } from '../services/firebase';

interface ActionPlanContentProps {
  tickets: Ticket[];
}

export default function ActionPlanContent({ tickets }: ActionPlanContentProps) {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'actions' | 'network' | 'ideas'>('actions');
  const [isEditing, setIsEditing] = useState(false);
  const [showActionForm, setShowActionForm] = useState(false);
  const [showCauseForm, setShowCauseForm] = useState(false);
  const [causes, setCauses] = useState<ActionCause[]>([]);
  const [editingCause, setEditingCause] = useState<ActionCause | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [causeForm, setCauseForm] = useState<Partial<ActionCause>>({
    type: 'Technique',
    description: '',
    frequency: 0,
    impact: 'medium',
    solutions: ['']
  });

  useEffect(() => {
    loadCauses();
  }, []);

  const loadCauses = async () => {
    try {
      setLoading(true);
      const loadedCauses = await getActionCauses();
      setCauses(loadedCauses);
      setError(null);
    } catch (error) {
      setError('Erreur lors du chargement des causes');
      console.error('Error loading causes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCause = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    try {
      if (editingCause) {
        await updateActionCause(editingCause.id, causeForm);
      } else {
        await addActionCause(causeForm as Omit<ActionCause, 'id' | 'createdAt' | 'updatedAt'>);
      }
      await loadCauses();
      setShowCauseForm(false);
      resetCauseForm();
    } catch (error) {
      console.error('Error saving cause:', error);
      setError('Erreur lors de l\'enregistrement de la cause');
    }
  };

  const handleDeleteCause = async (id: string) => {
    if (!isAdmin || !window.confirm('Êtes-vous sûr de vouloir supprimer cette cause ?')) return;
    
    try {
      await deleteActionCause(id);
      await loadCauses();
    } catch (error) {
      console.error('Error deleting cause:', error);
      setError('Erreur lors de la suppression de la cause');
    }
  };

  const resetCauseForm = () => {
    setCauseForm({
      type: 'Technique',
      description: '',
      frequency: 0,
      impact: 'medium',
      solutions: ['']
    });
    setEditingCause(null);
  };

  const CauseForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {editingCause ? 'Modifier la Cause' : 'Nouvelle Cause'}
            </h3>
            <button onClick={() => setShowCauseForm(false)} className="text-gray-400 hover:text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleAddCause} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={causeForm.type}
                onChange={(e) => setCauseForm(prev => ({ ...prev, type: e.target.value as any }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Technique">Technique</option>
                <option value="Client">Client</option>
                <option value="Casse">Matériel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={causeForm.description}
                onChange={(e) => setCauseForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Fréquence</label>
                <input
                  type="number"
                  min="0"
                  value={causeForm.frequency}
                  onChange={(e) => setCauseForm(prev => ({ ...prev, frequency: parseInt(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Impact</label>
                <select
                  value={causeForm.impact}
                  onChange={(e) => setCauseForm(prev => ({ ...prev, impact: e.target.value as any }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyen</option>
                  <option value="high">Élevé</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Solutions</label>
              {causeForm.solutions?.map((solution, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={solution}
                    onChange={(e) => {
                      const newSolutions = [...(causeForm.solutions || [])];
                      newSolutions[index] = e.target.value;
                      setCauseForm(prev => ({ ...prev, solutions: newSolutions }));
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Solution"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newSolutions = causeForm.solutions?.filter((_, i) => i !== index);
                      setCauseForm(prev => ({ ...prev, solutions: newSolutions }));
                    }}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setCauseForm(prev => ({ 
                  ...prev, 
                  solutions: [...(prev.solutions || []), '']
                }))}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                + Ajouter une solution
              </button>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCauseForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                {editingCause ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('actions')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'actions'
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Target className="w-5 h-5 mr-2" />
            Plan d'Actions
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'network'
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Network className="w-5 h-5 mr-2" />
            Points Noirs
          </button>
          <button
            onClick={() => setActiveTab('ideas')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'ideas'
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Lightbulb className="w-5 h-5 mr-2" />
            Idées
          </button>
        </div>
        
        <div className="flex space-x-2">
          {activeTab === 'actions' && isAdmin && (
            <>
              <button
                onClick={() => setShowCauseForm(true)}
                className="btn-secondary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Cause
              </button>
              <button
                onClick={() => setShowActionForm(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Action
              </button>
            </>
          )}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Modifier
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="btn-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-8">
        {activeTab === 'actions' && (
          <div>
            {/* Causes Identifiées Section - Moved Up */}
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg border border-blue-100">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Brain className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Causes Identifiées</h2>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => setShowCauseForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nouvelle Cause
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {causes.map((cause) => (
                    <div 
                      key={cause.id} 
                      className={`relative overflow-hidden rounded-lg p-6 transition-all duration-200 hover:shadow-lg ${
                        cause.type === 'Technique' ? 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200' :
                        cause.type === 'Client' ? 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200' :
                        'bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          cause.type === 'Technique' ? 'bg-blue-100 text-blue-800' :
                          cause.type === 'Client' ? 'bg-green-100 text-green-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {cause.type}
                        </span>
                        {isAdmin && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => {
                                setEditingCause(cause);
                                setCauseForm(cause);
                                setShowCauseForm(true);
                              }}
                              className="p-1 rounded-full hover:bg-white/50 transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteCause(cause.id)}
                              className="p-1 rounded-full hover:bg-white/50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="mt-4 text-sm font-medium text-gray-800">{cause.description}</p>

                      <div className="mt-4 flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            cause.impact === 'high' ? 'bg-red-500' :
                            cause.impact === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}></div>
                          <span className="text-gray-600">
                            Impact {
                              cause.impact === 'high' ? 'élevé' :
                              cause.impact === 'medium' ? 'moyen' : 'faible'
                            }
                          </span>
                        </div>
                        <span className="text-gray-600">
                          {cause.frequency} occurrences
                        </span>
                      </div>

                      {cause.solutions && cause.solutions.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Solutions proposées:</h4>
                          <ul className="space-y-2">
                            {cause.solutions.map((solution, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span className="text-sm text-gray-600 flex-1">{solution}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis Section */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                <Brain className="w-6 h-6 text-blue-600 mr-2" />
                Analyse des Causes Racines
              </h2>
              <ActionsList tickets={tickets} isEditing={isEditing} />
            </div>
          </div>
        )}
        {activeTab === 'network' && (
          <NetworkIssuesList isEditing={isEditing} />
        )}
        {activeTab === 'ideas' && (
          <IdeasList isEditing={isEditing} />
        )}
      </div>

      {showCauseForm && isAdmin && <CauseForm />}
    </div>
  );
}