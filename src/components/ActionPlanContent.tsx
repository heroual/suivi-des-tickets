import React, { useState } from 'react';
import { 
  Lightbulb, 
  Target,
  Brain,
  Network,
  Plus,
  Edit2,
  Trash2,
  Save
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

  const TabButton = ({ tab, current, icon: Icon, label }: { 
    tab: 'actions' | 'network' | 'ideas', 
    current: string, 
    icon: any, 
    label: string 
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
        tab === current
          ? 'bg-blue-100 text-blue-700'
          : 'hover:bg-gray-100 text-gray-600'
      }`}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
        <div className="flex space-x-4">
          <TabButton 
            tab="actions" 
            current={activeTab} 
            icon={Target} 
            label="Plan d'Actions" 
          />
          <TabButton 
            tab="network" 
            current={activeTab} 
            icon={Network} 
            label="Points Noirs" 
          />
          <TabButton 
            tab="ideas" 
            current={activeTab} 
            icon={Lightbulb} 
            label="Idées" 
          />
        </div>
        
        <div className="flex space-x-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Modifier
              </button>
              <button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </button>
            </>
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
    </div>
  );
}