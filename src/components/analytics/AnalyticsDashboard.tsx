import React from 'react';
import { TrendingUp, Users, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useDateFilter } from '../../contexts/DateContext';
import type { Ticket } from '../../types';

interface AnalyticsDashboardProps {
  tickets: Ticket[];
}

export default function AnalyticsDashboard({ tickets }: AnalyticsDashboardProps) {
  const { selectedDate } = useDateFilter();

  const stats = {
    total: tickets.length,
    resolved: tickets.filter(t => t.status === 'CLOTURE').length,
    onTime: tickets.filter(t => t.delaiRespect).length,
    reopened: tickets.filter(t => t.reopened).length
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Tableau de Bord Analytique - {format(selectedDate, 'MMMM yyyy', { locale: fr })}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-blue-900 font-medium">Total Tickets</h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-900 mt-2">{stats.total}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-green-900 font-medium">Tickets Résolus</h3>
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-900 mt-2">{stats.resolved}</p>
          <p className="text-sm text-green-600 mt-1">
            {stats.total > 0 ? `${((stats.resolved / stats.total) * 100).toFixed(1)}%` : '0%'}
          </p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-yellow-900 font-medium">Dans les Délais</h3>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.onTime}</p>
          <p className="text-sm text-yellow-600 mt-1">
            {stats.total > 0 ? `${((stats.onTime / stats.total) * 100).toFixed(1)}%` : '0%'}
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-red-900 font-medium">Réouvertures</h3>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-900 mt-2">{stats.reopened}</p>
          <p className="text-sm text-red-600 mt-1">
            {stats.total > 0 ? `${((stats.reopened / stats.total) * 100).toFixed(1)}%` : '0%'}
          </p>
        </div>
      </div>
    </div>
  );
}