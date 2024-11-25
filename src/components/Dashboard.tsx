import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, AlertTriangle, Activity, Edit2, Save, Plus, Trash2, X } from 'lucide-react';
import type { DailyStats, ActionCause } from '../types';
import { useAuth } from '../hooks/useAuth';
import { getActionCauses, addActionCause, updateActionCause, deleteActionCause } from '../services/firebase';

interface DashboardProps {
  dailyStats: DailyStats[];
}

const COLORS = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B'];

export default function Dashboard({ dailyStats }: DashboardProps) {
  const { isAdmin } = useAuth();
  const [causes, setCauses] = useState<ActionCause[]>([]);
  const [showCauseForm, setShowCauseForm] = useState(false);
  const [editingCause, setEditingCause] = useState<ActionCause | null>(null);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
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
    }
  };

  const handleDeleteCause = async (id: string) => {
    if (!isAdmin || !window.confirm('Êtes-vous sûr de vouloir supprimer cette cause ?')) return;
    
    try {
      await deleteActionCause(id);
      await loadCauses();
    } catch (error) {
      console.error('Error deleting cause:', error);
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

  const latestStats = dailyStats[dailyStats.length - 1] || {
    total: 0,
    resolus: 0,
    horsDelai: 0,
    reouvertures: 0
  };

  const pieData = [
    { name: 'Résolus', value: latestStats.resolus },
    { name: 'En cours', value: latestStats.total - latestStats.resolus },
    { name: 'Hors délai', value: latestStats.horsDelai },
    { name: 'Réouvertures', value: latestStats.reouvertures }
  ];

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
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Tickets</p>
              <h3 className="text-2xl font-bold mt-1">{latestStats.total}</h3>
            </div>
            <div className="bg-blue-400 bg-opacity-40 rounded-full p-3">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-blue-100">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            Aujourd'hui
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Tickets Résolus</p>
              <h3 className="text-2xl font-bold mt-1">{latestStats.resolus}</h3>
            </div>
            <div className="bg-green-400 bg-opacity-40 rounded-full p-3">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-100">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            {((latestStats.resolus / latestStats.total) * 100).toFixed(1)}% du total
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100">Hors Délai</p>
              <h3 className="text-2xl font-bold mt-1">{latestStats.horsDelai}</h3>
            </div>
            <div className="bg-amber-400 bg-opacity-40 rounded-full p-3">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-amber-100">
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            Nécessite attention
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Réouvertures</p>
              <h3 className="text-2xl font-bold mt-1">{latestStats.reouvertures}</h3>
            </div>
            <div className="bg-red-400 bg-opacity-40 rounded-full p-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-red-100">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            À surveiller
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Évolution des Tickets</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Bar dataKey="total" name="Total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolus" name="Résolus" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="horsDelai" name="Hors Délai" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reouvertures" name="Réouvertures" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition des Tickets</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Causes Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Causes Identifiées</h3>
          {isAdmin && (
            <button
              onClick={() => setShowCauseForm(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Cause
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {causes.map((cause) => (
              <div 
                key={cause.id} 
                className={`rounded-lg p-4 ${
                  cause.type === 'Technique' ? 'bg-blue-50' :
                  cause.type === 'Client' ? 'bg-green-50' : 'bg-amber-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cause.type === 'Technique' ? 'bg-blue-100 text-blue-800' :
                      cause.type === 'Client' ? 'bg-green-100 text-green-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {cause.type}
                    </span>
                    <p className="mt-2 text-sm font-medium">{cause.description}</p>
                  </div>
                  {isAdmin && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingCause(cause);
                          setCauseForm(cause);
                          setShowCauseForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCause(cause.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Fréquence: {cause.frequency}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cause.impact === 'high' ? 'bg-red-100 text-red-800' :
                      cause.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      Impact {
                        cause.impact === 'high' ? 'élevé' :
                        cause.impact === 'medium' ? 'moyen' : 'faible'
                      }
                    </span>
                  </div>
                  {cause.solutions && cause.solutions.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-900">Solutions proposées:</h4>
                      <ul className="mt-2 space-y-1">
                        {cause.solutions.map((solution, index) => (
                          <li key={index} className="text-sm text-gray-600">• {solution}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCauseForm && isAdmin && <CauseForm />}
    </div>
  );
}