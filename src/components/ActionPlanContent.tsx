import React, { useState } from 'react';
import { 
  Lightbulb, 
  Target,
  Brain,
  Network,
  Plus,
  Edit2,
  Trash2,
  Save,
  X
} from 'lucide-react';
import type { Ticket } from '../types';
import NetworkIssuesList from './NetworkIssuesList';
import IdeasList from './IdeasList';
import ActionsList from './ActionsList';

interface ActionPlanContentProps {
  tickets: Ticket[];
}

interface Action {
  id: string;
  title: string;
  description: string;
  term: 'short' | 'medium' | 'long';
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface Cause {
  id: string;
  type: 'Technique' | 'Client' | 'Casse';
  description: string;
  frequency: number;
  impact: 'low' | 'medium' | 'high';
  solutions: string[];
}

export default function ActionPlanContent({ tickets }: ActionPlanContentProps) {
  const [activeTab, setActiveTab] = useState<'actions' | 'network' | 'ideas'>('actions');
  const [isEditing, setIsEditing] = useState(false);
  const [showActionForm, setShowActionForm] = useState(false);
  const [showCauseForm, setShowCauseForm] = useState(false);
  const [editingAction, setEditingAction] = useState<Action | null>(null);
  const [editingCause, setEditingCause] = useState<Cause | null>(null);

  const [actionForm, setActionForm] = useState<Partial<Action>>({
    title: '',
    description: '',
    term: 'short',
    status: 'pending',
    priority: 'medium'
  });

  const [causeForm, setCauseForm] = useState<Partial<Cause>>({
    type: 'Technique',
    description: '',
    frequency: 0,
    impact: 'medium',
    solutions: ['']
  });

  const handleAddAction = () => {
    setEditingAction(null);
    setActionForm({
      title: '',
      description: '',
      term: 'short',
      status: 'pending',
      priority: 'medium'
    });
    setShowActionForm(true);
  };

  const handleAddCause = () => {
    setEditingCause(null);
    setCauseForm({
      type: 'Technique',
      description: '',
      frequency: 0,
      impact: 'medium',
      solutions: ['']
    });
    setShowCauseForm(true);
  };

  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to save action
    setShowActionForm(false);
  };

  const handleSaveCause = (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to save cause
    setShowCauseForm(false);
  };

  const ActionForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {editingAction ? 'Modifier l\'action' : 'Nouvelle action'}
            </h3>
            <button onClick={() => setShowActionForm(false)} className="text-gray-400 hover:text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSaveAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Titre</label>
              <input
                type="text"
                value={actionForm.title}
                onChange={(e) => setActionForm(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={actionForm.description}
                onChange={(e) => setActionForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Terme</label>
                <select
                  value={actionForm.term}
                  onChange={(e) => setActionForm(prev => ({ ...prev, term: e.target.value as any }))}
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
                  value={actionForm.priority}
                  onChange={(e) => setActionForm(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <select
                value={actionForm.status}
                onChange={(e) => setActionForm(prev => ({ ...prev, status: e.target.value as any }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="pending">En attente</option>
                <option value="in-progress">En cours</option>
                <option value="completed">Terminé</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowActionForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                {editingAction ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const CauseForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {editingCause ? 'Modifier la cause' : 'Nouvelle cause'}
            </h3>
            <button onClick={() => setShowCauseForm(false)} className="text-gray-400 hover:text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSaveCause} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={causeForm.type}
                onChange={(e) => setCauseForm(prev => ({ ...prev, type: e.target.value as any }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Technique">Technique</option>
                <option value="Client">Client</option>
                <option value="Casse">Casse</option>
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

            <div>
              <label className="block text-sm font-medium text-gray-700">Fréquence (nombre de cas)</label>
              <input
                type="number"
                value={causeForm.frequency}
                onChange={(e) => setCauseForm(prev => ({ ...prev, frequency: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Solutions proposées</label>
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
                    placeholder="Solution proposée"
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
                {editingCause ? 'Mettre à jour' : 'Ajouter'}
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
          {activeTab === 'actions' && (
            <>
              <button
                onClick={handleAddCause}
                className="btn-secondary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Cause
              </button>
              <button
                onClick={handleAddAction}
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

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'actions' && (
          <ActionsList tickets={tickets} isEditing={isEditing} />
        )}
        {activeTab === 'network' && (
          <NetworkIssuesList isEditing={isEditing} />
        )}
        {activeTab === 'ideas' && (
          <IdeasList isEditing={isEditing} />
        )}
      </div>

      {showActionForm && <ActionForm />}
      {showCauseForm && <CauseForm />}
    </div>
  );
}