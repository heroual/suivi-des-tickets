import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Target,
  Brain,
  Network,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  AlertTriangle,
  BarChart2,
  CheckCircle 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Ticket, CauseType } from '../types';
import { useAuth } from '../hooks/useAuth';
import AccessDeniedMessage from './AccessDeniedMessage';

interface CausesSuggestionsProps {
  tickets: Ticket[];
}

interface CauseAnalysis {
  type: CauseType;
  count: number;
  description: string;
  suggestions: string[];
  impact: 'high' | 'medium' | 'low';
}

export default function CausesSuggestions({ tickets }: CausesSuggestionsProps) {
  const { isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('month');
  const [editingCause, setEditingCause] = useState<CauseAnalysis | null>(null);

  const [formData, setFormData] = useState<Partial<CauseAnalysis>>({
    type: 'Technique',
    description: '',
    suggestions: [''],
    impact: 'medium'
  });

  const currentMonth = new Date();
  const monthInterval = {
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  };

  const monthlyTickets = tickets.filter(ticket =>
    ticket.dateCreation >= monthInterval.start && 
    ticket.dateCreation <= monthInterval.end
  );

  const causes: CauseAnalysis[] = [
    {
      type: 'Technique',
      count: monthlyTickets.filter(t => t.causeType === 'Technique').length,
      description: 'Problèmes techniques récurrents',
      suggestions: [
        'Mettre en place une maintenance préventive régulière',
        'Former les techniciens aux nouvelles technologies',
        'Documenter les solutions pour les problèmes fréquents'
      ],
      impact: 'high'
    },
    {
      type: 'Client',
      count: monthlyTickets.filter(t => t.causeType === 'Client').length,
      description: 'Problèmes liés aux clients',
      suggestions: [
        'Améliorer la communication avec les clients',
        'Mettre en place des guides d\'utilisation',
        'Organiser des sessions de formation client'
      ],
      impact: 'medium'
    },
    {
      type: 'Casse',
      count: monthlyTickets.filter(t => t.causeType === 'Casse').length,
      description: 'Dommages matériels',
      suggestions: [
        'Renforcer la protection des équipements',
        'Former les techniciens aux bonnes pratiques',
        'Mettre en place un système de surveillance'
      ],
      impact: 'high'
    }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#EF4444'];

  const pieData = causes.map(cause => ({
    name: cause.type,
    value: cause.count
  }));

  const totalCauses = causes.reduce((acc, cause) => acc + cause.count, 0);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    // Handle form submission
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'Technique',
      description: '',
      suggestions: [''],
      impact: 'medium'
    });
    setEditingCause(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Causes Détectées et Suggestions
            </h2>
            <p className="text-sm text-gray-600">
              {totalCauses} causes identifiées en {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month')}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
          
          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle Cause
            </button>
          )}
        </div>
      </div>

      {!isAdmin && <AccessDeniedMessage />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Répartition des Causes
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Causes List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {causes.map((cause, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className={`rounded-full p-2 ${
                      cause.type === 'Technique' ? 'bg-blue-100' :
                      cause.type === 'Client' ? 'bg-green-100' :
                      'bg-red-100'
                    }`}>
                      <BarChart2 className={`w-5 h-5 ${
                        cause.type === 'Technique' ? 'text-blue-600' :
                        cause.type === 'Client' ? 'text-green-600' :
                        'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{cause.type}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(cause.impact)}`}>
                          Impact {cause.impact === 'high' ? 'élevé' : cause.impact === 'medium' ? 'moyen' : 'faible'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{cause.description}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingCause(cause);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Suggestions d'amélioration:</h5>
                  <ul className="space-y-2">
                    {cause.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {cause.count} occurrences ce mois
                  </span>
                  <span className="text-gray-500">
                    {((cause.count / totalCauses) * 100).toFixed(1)}% du total
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingCause ? 'Modifier la Cause' : 'Nouvelle Cause'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type de Cause</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as CauseType }))}
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
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Impact</label>
                  <select
                    value={formData.impact}
                    onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value as 'high' | 'medium' | 'low' }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="high">Élevé</option>
                    <option value="medium">Moyen</option>
                    <option value="low">Faible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Suggestions</label>
                  {formData.suggestions?.map((suggestion, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={suggestion}
                        onChange={(e) => {
                          const newSuggestions = [...(formData.suggestions || [])];
                          newSuggestions[index] = e.target.value;
                          setFormData(prev => ({ ...prev, suggestions: newSuggestions }));
                        }}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Suggestion d'amélioration"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newSuggestions = formData.suggestions?.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, suggestions: newSuggestions }));
                        }}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      suggestions: [...(prev.suggestions || []), '']
                    }))}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Ajouter une suggestion
                  </button>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2 inline" />
                    {editingCause ? 'Mettre à jour' : 'Ajouter'}
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