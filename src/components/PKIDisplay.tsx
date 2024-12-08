import React from 'react';
import { TrendingUp, Clock, RefreshCw, Target } from 'lucide-react';
import type { PKIStats } from '../types';

interface PKIDisplayProps {
  stats: PKIStats;
  isMonthly?: boolean;
}

export default function PKIDisplay({ stats, isMonthly = false }: PKIDisplayProps) {
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  const getScoreColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Target className="w-6 h-6 text-blue-600 mr-2" />
        {isMonthly ? 'PKI du Mois' : 'Indicateurs de Performance (PKI)'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">PKI Global</span>
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(stats.globalPKI)}`}>
            {formatPercent(stats.globalPKI)}
          </div>
          {isMonthly && (
            <p className="text-sm text-blue-600 mt-1">Objectif: 75%</p>
          )}
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700">Taux de Résolution</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(stats.resolutionRate * 100)}`}>
            {formatPercent(stats.resolutionRate * 100)}
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-amber-700">Respect des Délais</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(stats.delaiRespectRate * 100)}`}>
            {formatPercent(stats.delaiRespectRate * 100)}
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-700">Stabilité (Non-réouverture)</span>
            <RefreshCw className="w-5 h-5 text-purple-600" />
          </div>
          <div className={`text-2xl font-bold ${getScoreColor((1 - stats.reopenRate) * 100)}`}>
            {formatPercent((1 - stats.reopenRate) * 100)}
          </div>
        </div>
      </div>
    </div>
  );
}