import React, { useState } from 'react';
import { FileSpreadsheet, Calendar, TrendingUp, Download, Filter, AlertCircle } from 'lucide-react';
import type { Ticket, CauseType } from '../types';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { useDateFilter } from '../contexts/DateContext';

interface MonthlyIndicatorsProps {
  tickets: Ticket[];
}

interface IndicatorStats {
  total: number;
  resolved: number;
  onTime: number;
  reopened: number;
  byCause: Record<CauseType, number>;
  byService: Record<string, number>;
  byTechnician: Record<string, number>;
}

export default function MonthlyIndicators({ tickets }: MonthlyIndicatorsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { selectedDate } = useDateFilter();

  const calculateStats = (): IndicatorStats => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);

    const monthlyTickets = tickets.filter(ticket =>
      isWithinInterval(ticket.dateCreation, { start: monthStart, end: monthEnd })
    );

    const stats: IndicatorStats = {
      total: monthlyTickets.length,
      resolved: monthlyTickets.filter(t => t.status === 'CLOTURE').length,
      onTime: monthlyTickets.filter(t => t.delaiRespect).length,
      reopened: monthlyTickets.filter(t => t.reopened).length,
      byCause: {
        'Technique': monthlyTickets.filter(t => t.causeType === 'Technique').length,
        'Client': monthlyTickets.filter(t => t.causeType === 'Client').length,
        'Casse': monthlyTickets.filter(t => t.causeType === 'Casse').length
      },
      byService: {},
      byTechnician: {}
    };

    monthlyTickets.forEach(ticket => {
      stats.byService[ticket.serviceType] = (stats.byService[ticket.serviceType] || 0) + 1;
      stats.byTechnician[ticket.technician] = (stats.byTechnician[ticket.technician] || 0) + 1;
    });

    return stats;
  };

  const stats = calculateStats();

  const exportToExcel = () => {
    const monthName = format(selectedDate, 'MMMM yyyy', { locale: fr });
    
    const summaryData = [
      ['Indicateurs Mensuels', monthName],
      [''],
      ['Statistiques Générales'],
      ['Total des tickets', stats.total],
      ['Tickets résolus', stats.resolved],
      ['Tickets dans les délais', stats.onTime],
      ['Tickets réouverts', stats.reopened],
      [''],
      ['Répartition par Type de Cause'],
      ...Object.entries(stats.byCause).map(([cause, count]) => [cause, count]),
      [''],
      ['Répartition par Service'],
      ...Object.entries(stats.byService).map(([service, count]) => [service, count]),
      [''],
      ['Répartition par Technicien'],
      ...Object.entries(stats.byTechnician).map(([tech, count]) => [tech, count])
    ];

    const ticketDetails = stats.total > 0 ? stats.total : tickets.map(ticket => ({
      'Date de création': format(new Date(ticket.dateCreation), 'dd/MM/yyyy HH:mm'),
      'ND/Login': ticket.ndLogin,
      'Service': ticket.serviceType,
      'Description': ticket.description,
      'Cause': ticket.cause,
      'Type de cause': ticket.causeType,
      'Technicien': ticket.technician,
      'Statut': ticket.status,
      'Dans les délais': ticket.delaiRespect ? 'Oui' : 'Non',
      'Réouvert': ticket.reopened ? 'Oui' : 'Non',
      'Motif de clôture': ticket.motifCloture || ''
    }));

    const wb = XLSX.utils.book_new();
    
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Résumé');

    const wsDetails = XLSX.utils.json_to_sheet(ticketDetails);
    XLSX.utils.book_append_sheet(wb, wsDetails, 'Détails');

    XLSX.writeFile(wb, `Indicateurs_${monthName.replace(' ', '_')}.xlsx`);
  };

  const getPercentage = (value: number, total: number) => 
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg overflow-hidden mb-6">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-dark-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-start sm:items-center space-x-3">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 mt-1 sm:mt-0" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                Indicateurs du Mois
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {format(startOfMonth(selectedDate), 'd MMMM', { locale: fr })} au {format(endOfMonth(selectedDate), 'd MMMM', { locale: fr })}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="btn-secondary w-full sm:w-auto"
            >
              <Filter className="w-5 h-5 mr-2" />
              {showDetails ? 'Masquer les détails' : 'Afficher les détails'}
            </button>
            <button
              onClick={exportToExcel}
              className="btn-primary w-full sm:w-auto"
            >
              <Download className="w-5 h-5 mr-2" />
              Exporter en Excel
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* KPI Cards - Mobile First Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Tickets */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
                <FileSpreadsheet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Resolved Tickets */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tickets Résolus</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.resolved}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* On Time Tickets */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dans les Délais</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.onTime}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-2">
                <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Reopened Tickets */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tickets Réouverts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.reopened}</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 rounded-full p-2">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="mt-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Filter className="w-4 h-4" />
            <span>{showDetails ? 'Masquer les détails' : 'Afficher les détails'}</span>
          </button>

          {showDetails && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* By Cause */}
              <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Par Cause</h3>
                <div className="space-y-2">
                  {Object.entries(stats.byCause).map(([cause, count]) => (
                    <div key={cause} className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">{cause}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Service */}
              <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Par Service</h3>
                <div className="space-y-2">
                  {Object.entries(stats.byService).map(([service, count]) => (
                    <div key={service} className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">{service}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Technician */}
              <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Par Technicien</h3>
                <div className="space-y-2">
                  {Object.entries(stats.byTechnician).map(([tech, count]) => (
                    <div key={tech} className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">{tech}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}