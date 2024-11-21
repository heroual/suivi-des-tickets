import React, { useMemo } from 'react';
import { Ticket } from '../types';
import { format, subDays, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target,
  ArrowRight,
  Calendar,
  Activity
} from 'lucide-react';

interface ActionPlanProps {
  tickets: Ticket[];
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
  deadline: Date;
  status: 'pending' | 'in-progress' | 'completed';
  metrics: {
    current: number;
    target: number;
    unit: string;
  };
}

export default function ActionPlan({ tickets }: ActionPlanProps) {
  const stats = useMemo(() => {
    const last30Days = tickets.filter(ticket => 
      isWithinInterval(ticket.dateCreation, {
        start: subDays(new Date(), 30),
        end: new Date()
      })
    );

    const totalTickets = last30Days.length;
    const resolvedOnTime = last30Days.filter(t => t.delaiRespect).length;
    const reopenedTickets = last30Days.filter(t => t.reopened).length;
    const technicalIssues = last30Days.filter(t => t.causeType === 'Technique').length;
    const cableIssues = last30Days.filter(t => t.causeType === 'Casse').length;

    return {
      totalTickets,
      resolvedOnTime,
      reopenedTickets,
      technicalIssues,
      cableIssues,
      resolutionRate: totalTickets > 0 ? (resolvedOnTime / totalTickets) * 100 : 0,
      reopenRate: totalTickets > 0 ? (reopenedTickets / totalTickets) * 100 : 0
    };
  }, [tickets]);

  const actionPlan = useMemo((): ActionItem[] => {
    const plans: ActionItem[] = [];

    // Resolution Rate Action
    if (stats.resolutionRate < 85) {
      plans.push({
        id: 'improve-resolution',
        title: 'Amélioration du taux de résolution',
        description: 'Mettre en place un système de suivi plus rigoureux des interventions',
        priority: 'high',
        impact: 'Augmentation du taux de résolution de 15%',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: 'pending',
        metrics: {
          current: Math.round(stats.resolutionRate),
          target: 85,
          unit: '%'
        }
      });
    }

    // Reopen Rate Action
    if (stats.reopenRate > 10) {
      plans.push({
        id: 'reduce-reopens',
        title: 'Réduction des réouvertures',
        description: 'Analyser les causes principales des réouvertures et former les techniciens',
        priority: 'high',
        impact: 'Réduction du taux de réouverture de 50%',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
        status: 'pending',
        metrics: {
          current: Math.round(stats.reopenRate),
          target: 5,
          unit: '%'
        }
      });
    }

    // Cable Issues Action
    if (stats.cableIssues > stats.totalTickets * 0.2) {
      plans.push({
        id: 'cable-maintenance',
        title: 'Programme de maintenance préventive',
        description: 'Identifier et remplacer les câbles à risque avant les pannes',
        priority: 'medium',
        impact: 'Réduction des incidents câbles de 30%',
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        status: 'pending',
        metrics: {
          current: stats.cableIssues,
          target: Math.round(stats.cableIssues * 0.7),
          unit: 'incidents'
        }
      });
    }

    return plans;
  }, [stats]);

  const TimelineItem = ({ item }: { item: ActionItem }) => (
    <div className="relative pl-8 pb-8">
      <div className="absolute left-0 top-0 mt-1 -ml-3">
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          item.status === 'completed' ? 'border-green-500 bg-green-100' :
          item.status === 'in-progress' ? 'border-blue-500 bg-blue-100' :
          'border-gray-500 bg-gray-100'
        }`}>
          {item.status === 'completed' ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : item.status === 'in-progress' ? (
            <Clock className="w-4 h-4 text-blue-500" />
          ) : (
            <Target className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            item.priority === 'high' ? 'bg-red-100 text-red-800' :
            item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {item.priority === 'high' ? 'Priorité haute' :
             item.priority === 'medium' ? 'Priorité moyenne' :
             'Priorité basse'}
          </span>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              Échéance: {format(item.deadline, 'd MMM yyyy', { locale: fr })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              Impact: {item.impact}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progression</span>
            <span className="text-sm text-gray-600">
              {item.metrics.current} {item.metrics.unit} 
              <ArrowRight className="w-4 h-4 inline mx-1" /> 
              {item.metrics.target} {item.metrics.unit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                item.priority === 'high' ? 'bg-red-500' :
                item.priority === 'medium' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{
                width: `${Math.min(100, (item.metrics.current / item.metrics.target) * 100)}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Plan d'Actions</h2>
        </div>
        <p className="text-blue-100">
          Basé sur l'analyse des {stats.totalTickets} derniers tickets sur 30 jours
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux de résolution</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolutionRate.toFixed(1)}%</p>
            </div>
            <TrendingUp className={`w-8 h-8 ${
              stats.resolutionRate >= 85 ? 'text-green-500' : 'text-yellow-500'
            }`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux de réouverture</p>
              <p className="text-2xl font-bold text-gray-900">{stats.reopenRate.toFixed(1)}%</p>
            </div>
            <AlertTriangle className={`w-8 h-8 ${
              stats.reopenRate <= 10 ? 'text-green-500' : 'text-red-500'
            }`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Incidents techniques</p>
              <p className="text-2xl font-bold text-gray-900">{stats.technicalIssues}</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Incidents câbles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cableIssues}</p>
            </div>
            <AlertTriangle className={`w-8 h-8 ${
              stats.cableIssues <= stats.totalTickets * 0.2 ? 'text-green-500' : 'text-red-500'
            }`} />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-50 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Actions Recommandées</h3>
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-0 w-px bg-gray-200"></div>
          <div className="space-y-6">
            {actionPlan.map(item => (
              <TimelineItem key={item.id} item={item} />
            ))}
            {actionPlan.length === 0 && (
              <div className="pl-8 flex items-center space-x-3 text-green-600">
                <CheckCircle className="w-6 h-6" />
                <p className="text-lg font-medium">Tous les indicateurs sont au vert !</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}