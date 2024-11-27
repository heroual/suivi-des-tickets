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
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ActionPlan as ActionPlanType, ActionCause, Ticket } from '../types';
import { 
  addActionPlan, 
  updateActionPlan, 
  deleteActionPlan, 
  getActionPlans,
  addActionCause,
  updateActionCause,
  deleteActionCause,
  getActionCauses
} from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import AccessDeniedMessage from './AccessDeniedMessage';

interface ActionPlanProps {
  tickets: Ticket[];
}

export default function ActionPlan({ tickets }: ActionPlanProps) {
  const { isAdmin } = useAuth();
  const [plans, setPlans] = useState<ActionPlanType[]>([]);
  const [causes, setCauses] = useState<ActionCause[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showCauseForm, setShowCauseForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ActionPlanType | null>(null);
  const [editingCause, setEditingCause] = useState<ActionCause | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [planForm, setPlanForm] = useState<Partial<ActionPlanType>>({
    Titre: '',
    description: '',
    Durée: 'short',
    status: 'pending',
    priority: 'medium',
    progress: 0,
    assignedTo: ''
  });

  const [causeForm, setCauseForm] = useState<Partial<ActionCause>>({
    type: 'Technique',
    description: '',
    frequency: 0,
    impact: 'medium',
    solutions: ['']
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [loadedPlans, loadedCauses] = await Promise.all([
        getActionPlans(),
        getActionCauses()
      ]);
      setPlans(loadedPlans);
      setCauses(loadedCauses);
      setError(null);
    } catch (error) {
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    try {
      if (editingPlan) {
        await updateActionPlan(editingPlan.id, planForm);
      } else {
        await addActionPlan(planForm as Omit<ActionPlanType, 'id' | 'createdAt' | 'updatedAt'>);
      }
      await loadData();
      setShowPlanForm(false);
      resetPlanForm();
    } catch (error) {
      console.error('Error saving plan:', error);
      setError('Erreur lors de l\'enregistrement du plan. Veuillez réessayer.');
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!isAdmin || !window.confirm('Êtes-vous sûr de vouloir supprimer ce plan d\'action ?')) return;
    
    try {
      await deleteActionPlan(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting plan:', error);
      setError('Erreur lors de la suppression du plan. Veuillez réessayer.');
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
      await loadData();
      setShowCauseForm(false);
      resetCauseForm();
    } catch (error) {
      console.error('Error saving cause:', error);
      setError('Erreur lors de l\'enregistrement de la cause. Veuillez réessayer.');
    }
  };

  const handleDeleteCause = async (id: string) => {
    if (!isAdmin || !window.confirm('Êtes-vous sûr de vouloir supprimer cette cause ?')) return;
    
    try {
      await deleteActionCause(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting cause:', error);
      setError('Erreur lors de la suppression de la cause. Veuillez réessayer.');
    }
  };

  const resetPlanForm = () => {
    setPlanForm({
      Titre: '',
      description: '',
      Durée: 'short',
      status: 'pending',
      priority: 'medium',
      progress: 0,
      assignedTo: ''
    });
    setEditingPlan(null);
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

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Brain className="w-6 h-6 text-blue-600 mr-2" />
          Plans d'Action
        </h2>
        {isAdmin && (
          <div className="flex space-x-2">
            <button
              onClick={() => setShowCauseForm(true)}
              className="btn-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Cause
            </button>
            <button
              onClick={() => setShowPlanForm(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Plan
            </button>
          </div>
        )}
      </div>

      {!isAdmin && <AccessDeniedMessage />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">{plan.Titre}</h4>
                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
              </div>
              {isAdmin && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingPlan(plan);
                      setPlanForm(plan);
                      setShowPlanForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">
                    {plan.Durée === 'short' ? 'Court terme' :
                     plan.Durée === 'medium' ? 'Moyen terme' :
                     'Long terme'}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  plan.priority === 'high' ? 'bg-red-100 text-red-800' :
                  plan.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {plan.priority === 'high' ? 'Priorité haute' :
                   plan.priority === 'medium' ? 'Priorité moyenne' :
                   'Priorité basse'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{plan.assignedTo || 'Non assigné'}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  plan.status === 'completed' ? 'bg-green-100 text-green-800' :
                  plan.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {plan.status === 'completed' ? 'Terminé' :
                   plan.status === 'in-progress' ? 'En cours' :
                   'En attente'}
                </span>
              </div>

              {plan.dueDate && (
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">
                    Échéance: {format(plan.dueDate, 'PP', { locale: fr })}
                  </span>
                </div>
              )}

              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      Progression
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      {plan.progress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div
                    style={{ width: `${plan.progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPlanForm && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingPlan ? 'Modifier le Plan d\'Action' : 'Nouveau Plan d\'Action'}
                </h3>
                <button onClick={() => setShowPlanForm(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddPlan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Titre</label>
                  <input
                    type="text"
                    value={planForm.Titre}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, Titre: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={planForm.description}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Durée</label>
                    <select
                      value={planForm.Durée}
                      onChange={(e) => setPlanForm(prev => ({ ...prev, Durée: e.target.value as any }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="short">Court terme</option>
                      <option value="medium">Moyen terme</option>
                      <option value="long">Long terme</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priorité</label>
                    <select
                      value={planForm.priority}
                      onChange={(e) => setPlanForm(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <select
                      value={planForm.status}
                      onChange={(e) => setPlanForm(prev => ({ ...prev, status: e.target.value as any }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="pending">En attente</option>
                      <option value="in-progress">En cours</option>
                      <option value="completed">Terminé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Progression (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={planForm.progress}
                      onChange={(e) => setPlanForm(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigné à</label>
                  <input
                    type="text"
                    value={planForm.assignedTo}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date d'échéance</label>
                  <input
                    type="date"
                    value={planForm.dueDate ? format(planForm.dueDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setPlanForm(prev => ({ 
                      ...prev, 
                      dueDate: e.target.value ? new Date(e.target.value) : undefined 
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPlanForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {editingPlan ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showCauseForm && isAdmin && (
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
      )}
    </div>
  );
}