import React, { useState } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target,
  ArrowRight,
  Calendar,
  Activity,
  MapPin,
  Zap,
  Brain,
  Network
} from 'lucide-react';
import { format, subDays, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Ticket } from '../types';

interface ActionPlanProps {
  tickets: Ticket[];
}

interface NetworkIssue {
  id: string;
  location: string;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'resolved';
  affectedCustomers: number;
}

interface Idea {
  id: string;
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  category: 'process' | 'technical' | 'customer';
  status: 'proposed' | 'approved' | 'implemented';
}

export default function ActionPlan({ tickets }: ActionPlanProps) {
  const [activeTab, setActiveTab] = useState<'actions' | 'network' | 'ideas'>('actions');
  const [showCauses, setShowCauses] = useState(false);

  // Sample network issues data
  const networkIssues: NetworkIssue[] = [
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

  // Sample improvement ideas
  const ideas: Idea[] = [
    {
      id: '1',
      title: 'Système de notification automatique',
      description: 'Mise en place d\'alertes SMS pour les clients lors des interventions',
      impact: 'Amélioration de la satisfaction client',
      effort: 'medium',
      category: 'technical',
      status: 'proposed'
    },
    {
      id: '2',
      title: 'Programme de maintenance préventive',
      description: 'Inspection régulière des points critiques du réseau',
      impact: 'Réduction des pannes de 30%',
      effort: 'high',
      category: 'process',
      status: 'approved'
    }
  ];

  const stats = {
    totalTickets: tickets.length,
    technicalIssues: tickets.filter(t => t.causeType === 'Technique').length,
    cableIssues: tickets.filter(t => t.causeType === 'Casse').length,
    clientIssues: tickets.filter(t => t.causeType === 'Client').length
  };

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

  const NetworkIssueCard = ({ issue }: { issue: NetworkIssue }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-900">{issue.location}</h4>
          <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          issue.priority === 'high' ? 'bg-red-100 text-red-800' :
          issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {issue.priority === 'high' ? 'Priorité haute' :
           issue.priority === 'medium' ? 'Priorité moyenne' :
           'Priorité basse'}
        </span>
      </div>
      <div className="mt-3 flex items-center text-sm text-gray-500">
        <Users className="w-4 h-4 mr-1" />
        {issue.affectedCustomers} clients affectés
      </div>
      <div className="mt-3 flex justify-between items-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          issue.status === 'pending' ? 'bg-gray-100 text-gray-800' :
          issue.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {issue.status === 'pending' ? 'En attente' :
           issue.status === 'in-progress' ? 'En cours' :
           'Résolu'}
        </span>
        <p className="text-sm text-gray-500">{issue.impact}</p>
      </div>
    </div>
  );

  const IdeaCard = ({ idea }: { idea: Idea }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-900">{idea.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          idea.category === 'technical' ? 'bg-purple-100 text-purple-800' :
          idea.category === 'process' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {idea.category === 'technical' ? 'Technique' :
           idea.category === 'process' ? 'Processus' :
           'Client'}
        </span>
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
        <p className="text-sm text-gray-500">{idea.impact}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Analyse et Améliorations</h2>
        </div>
        <p className="text-blue-100">
          Suivi des actions d'amélioration et points critiques
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 pb-2">
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

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'actions' && (
          <>
            {/* Causes Analysis */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Analyse des Causes
                </h3>
                <button
                  onClick={() => setShowCauses(!showCauses)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {showCauses ? 'Masquer les détails' : 'Voir les détails'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-900 font-medium">Techniques</span>
                    <span className="text-blue-600 font-bold">
                      {((stats.technicalIssues / stats.totalTickets) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 mt-2">
                    {stats.technicalIssues}
                  </p>
                  {showCauses && (
                    <div className="mt-3 text-sm text-blue-800">
                      <ul className="space-y-1">
                        <li>• Configuration équipements</li>
                        <li>• Problèmes de synchronisation</li>
                        <li>• Interférences signal</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-red-900 font-medium">Câbles</span>
                    <span className="text-red-600 font-bold">
                      {((stats.cableIssues / stats.totalTickets) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-red-900 mt-2">
                    {stats.cableIssues}
                  </p>
                  {showCauses && (
                    <div className="mt-3 text-sm text-red-800">
                      <ul className="space-y-1">
                        <li>• Coupures accidentelles</li>
                        <li>• Usure naturelle</li>
                        <li>• Vandalisme</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-900 font-medium">Clients</span>
                    <span className="text-yellow-600 font-bold">
                      {((stats.clientIssues / stats.totalTickets) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-900 mt-2">
                    {stats.clientIssues}
                  </p>
                  {showCauses && (
                    <div className="mt-3 text-sm text-yellow-800">
                      <ul className="space-y-1">
                        <li>• Mauvaise utilisation</li>
                        <li>• Configuration incorrecte</li>
                        <li>• Équipement défectueux</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Propositions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Propositions d'Amélioration
              </h3>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-900">Court Terme (1-3 mois)</h4>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-2" />
                      <span className="text-green-800">Formation continue des techniciens sur les nouvelles technologies</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-2" />
                      <span className="text-green-800">Mise en place d'un système de suivi en temps réel des interventions</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900">Moyen Terme (3-6 mois)</h4>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start">
                      <Target className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                      <span className="text-blue-800">Développement d'un programme de maintenance préventive</span>
                    </li>
                    <li className="flex items-start">
                      <Target className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                      <span className="text-blue-800">Optimisation des processus de gestion des tickets</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900">Long Terme (6-12 mois)</h4>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start">
                      <Zap className="w-5 h-5 text-purple-600 mt-0.5 mr-2" />
                      <span className="text-purple-800">Modernisation complète de l'infrastructure réseau</span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="w-5 h-5 text-purple-600 mt-0.5 mr-2" />
                      <span className="text-purple-800">Mise en place d'un système de détection précoce des pannes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'network' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {networkIssues.map(issue => (
                <NetworkIssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ideas' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ideas.map(idea => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}