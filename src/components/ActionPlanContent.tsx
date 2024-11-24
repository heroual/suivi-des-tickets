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

export default function ActionPlanContent({ tickets }: ActionPlanContentProps) {
  const [activeTab, setActiveTab] = useState<'actions' | 'network' | 'ideas'>('actions');
  const [isEditing, setIsEditing] = useState(false);
  const [showActionForm, setShowActionForm] = useState(false);
  const [showCauseForm, setShowCauseForm] = useState(false);

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

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'actions' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6">
              <Brain className="w-6 h-6 text-blue-600 mr-2" />
              Analyse des Causes Racines
            </h2>
            <ActionsList tickets={tickets} isEditing={isEditing} />
          </div>
        )}
        {activeTab === 'network' && (
          <NetworkIssuesList isEditing={isEditing} />
        )}
        {activeTab === 'ideas' && (
          <IdeasList isEditing={isEditing} />
        )}
      </div>
    </div>
  );
}