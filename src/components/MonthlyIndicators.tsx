import React, { useState } from 'react';
import { FileSpreadsheet, Calendar, TrendingUp, Download, Filter, AlertCircle } from 'lucide-react';
import type { Ticket, CauseType } from '../types';
import { format, startOfMonth, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as XLSX from 'xlsx';

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

  const calculateStats = (): IndicatorStats => {
    const monthStart = startOfMonth(new Date());
    const today = new Date();

    const monthlyTickets = tickets.filter(ticket =>
      isWithinInterval(ticket.dateCreation, { start: monthStart, end: today })
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
    const monthStart = startOfMonth(new Date());
    const today = new Date();
    
    const monthlyTickets = tickets.filter(ticket =>
      isWithinInterval(ticket.dateCreation, { start: monthStart, end: today })
    );

    const summaryData = [
      ['Indicateurs Mensuels', `${format(monthStart, 'MMMM yyyy', { locale: fr })}`],
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

    const ticketDetails = monthlyTickets.map(ticket => ({
      'Date de création': format(ticket.dateCreation, 'dd/MM/yyyy HH:mm'),
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
    XLSX.utils.book_append_sheet(wb, wsDetails, 'Détails des tickets');

    wsSummary['!cols'] = [{ wch: 25 }, { wch: 15 }];
    wsDetails['!cols'] = Array(Object.keys(ticketDetails[0] || {}).length).fill({ wch: 20 });

    XLSX.writeFile(wb, `indicateurs-mensuels-${format(new Date(), 'yyyy-MM')}.xlsx`);
  };

  const getPercentage = (value: number, total: number) => 
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-start sm:items-center space-x-3">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mt-1 sm:mt-0" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                Indicateurs du Mois
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {format(startOfMonth(new Date()), 'd MMMM', { locale: fr })} au {format(new Date(), 'd MMMM', { locale: fr })}
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm text-blue-900 font-medium">Total Tickets</h3>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <p className="text-lg sm:text-3xl font-bold text-blue-900 mt-1 sm:mt-2">{stats.total}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm text-green-900 font-medium">Résolus</h3>
              <div className="text-xs sm:text-sm font-medium text-green-600">
                {getPercentage(stats.resolved, stats.total)}%
              </div>
            </div>
            <p className="text-lg sm:text-3xl font-bold text-green-900 mt-1 sm:mt-2">{stats.resolved}</p>
          </div>

          <div className="bg-amber-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm text-amber-900 font-medium">Dans les Délais</h3>
              <div className="text-xs sm:text-sm font-medium text-amber-600">
                {getPercentage(stats.onTime, stats.total)}%
              </div>
            </div>
            <p className="text-lg sm:text-3xl font-bold text-amber-900 mt-1 sm:mt-2">{stats.onTime}</p>
          </div>

          <div className="bg-red-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm text-red-900 font-medium">Réouvertures</h3>
              <div className="text-xs sm:text-sm font-medium text-red-600">
                {getPercentage(stats.reopened, stats.total)}%
              </div>
            </div>
            <p className="text-lg sm:text-3xl font-bold text-red-900 mt-1 sm:mt-2">{stats.reopened}</p>
          </div>
        </div>

        {showDetails && (
          <div className="space-y-6">
            {/* Causes */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Répartition par Type de Cause</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {Object.entries(stats.byCause).map(([cause, count]) => (
                  <div key={cause} className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{cause}</span>
                      <span className="text-xs text-gray-600">
                        {getPercentage(count, stats.total)}%
                      </span>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">{count}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Répartition par Service</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {Object.entries(stats.byService).map(([service, count]) => (
                  <div key={service} className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{service}</span>
                      <span className="text-xs text-gray-600">
                        {getPercentage(count, stats.total)}%
                      </span>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">{count}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Techniciens */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Répartition par Technicien</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {Object.entries(stats.byTechnician).map(([tech, count]) => (
                  <div key={tech} className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                    <span>