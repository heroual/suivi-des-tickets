import React, { useMemo } from 'react';
import { format, eachMonthOfInterval, startOfYear, endOfYear, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Clock, AlertTriangle, Download } from 'lucide-react';
import type { Ticket } from '../types';
import * as XLSX from 'xlsx';

interface YearlyTimelineProps {
  tickets: Ticket[];
}

interface MonthlyStats {
  month: string;
  total: number;
  resolved: number;
  onTime: number;
  reopened: number;
  technical: number;
  client: number;
  cable: number;
}

export default function YearlyTimeline({ tickets }: YearlyTimelineProps) {
  const monthlyStats = useMemo(() => {
    const year = new Date().getFullYear();
    const months = eachMonthOfInterval({
      start: startOfYear(new Date(year, 0)),
      end: endOfYear(new Date(year, 0))
    });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const monthTickets = tickets.filter(ticket =>
        isWithinInterval(ticket.dateCreation, { start: monthStart, end: monthEnd })
      );

      return {
        month: format(month, 'MMM', { locale: fr }),
        total: monthTickets.length,
        resolved: monthTickets.filter(t => t.status === 'CLOTURE').length,
        onTime: monthTickets.filter(t => t.delaiRespect).length,
        reopened: monthTickets.filter(t => t.reopened).length,
        technical: monthTickets.filter(t => t.causeType === 'Technique').length,
        client: monthTickets.filter(t => t.causeType === 'Client').length,
        cable: monthTickets.filter(t => t.causeType === 'Casse').length
      };
    });
  }, [tickets]);

  const yearTotals = useMemo(() => ({
    total: monthlyStats.reduce((acc, month) => acc + month.total, 0),
    resolved: monthlyStats.reduce((acc, month) => acc + month.resolved, 0),
    onTime: monthlyStats.reduce((acc, month) => acc + month.onTime, 0),
    reopened: monthlyStats.reduce((acc, month) => acc + month.reopened, 0)
  }), [monthlyStats]);

  const exportToExcel = () => {
    const summaryData = [
      ['Statistiques Annuelles', new Date().getFullYear().toString()],
      [''],
      ['Totaux'],
      ['Total tickets', yearTotals.total],
      ['Tickets résolus', yearTotals.resolved],
      ['Dans les délais', yearTotals.onTime],
      ['Réouvertures', yearTotals.reopened],
      [''],
      ['Détails Mensuels'],
      [
        'Mois',
        'Total',
        'Résolus',
        'Dans les délais',
        'Réouvertures',
        'Technique',
        'Client',
        'Câble'
      ],
      ...monthlyStats.map(month => [
        month.month,
        month.total,
        month.resolved,
        month.onTime,
        month.reopened,
        month.technical,
        month.client,
        month.cable
      ])
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, // Month
      { wch: 10 }, // Total
      { wch: 10 }, // Resolved
      { wch: 15 }, // On Time
      { wch: 12 }, // Reopened
      { wch: 10 }, // Technical
      { wch: 10 }, // Client
      { wch: 10 }  // Cable
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Statistiques Annuelles');
    XLSX.writeFile(wb, `statistiques-annuelles-${new Date().getFullYear()}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Timeline Annuelle {new Date().getFullYear()}
              </h1>
              <p className="text-gray-600">Vue d'ensemble des performances mensuelles</p>
            </div>
          </div>
          <button
            onClick={exportToExcel}
            className="btn-primary"
          >
            <Download className="w-5 h-5 mr-2" />
            Exporter Excel
          </button>
        </div>

        {/* Annual KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-blue-900 font-medium">Total Tickets</h3>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-2">{yearTotals.total}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-green-900 font-medium">Tickets Résolus</h3>
              <div className="text-sm font-medium text-green-600">
                {yearTotals.total > 0 ? ((yearTotals.resolved / yearTotals.total) * 100).toFixed(1) : 0}%
              </div>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-2">{yearTotals.resolved}</p>
          </div>

          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-amber-900 font-medium">Dans les Délais</h3>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-900 mt-2">{yearTotals.onTime}</p>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-red-900 font-medium">Réouvertures</h3>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-900 mt-2">{yearTotals.reopened}</p>
          </div>
        </div>
      </div>

      {/* Monthly Timeline Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Évolution Mensuelle</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" name="Total" fill="#3B82F6" />
              <Bar dataKey="resolved" name="Résolus" fill="#10B981" />
              <Bar dataKey="onTime" name="Dans les délais" fill="#F59E0B" />
              <Bar dataKey="reopened" name="Réouvertures" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cause Types Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Types de Causes par Mois</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="technical" name="Technique" fill="#6366F1" />
              <Bar dataKey="client" name="Client" fill="#F59E0B" />
              <Bar dataKey="cable" name="Câble" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Details Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Détails Mensuels</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mois
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Résolus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dans les délais
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Réouvertures
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technique
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Câble
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyStats.map((month, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {month.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {month.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {month.resolved}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                      {month.onTime}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      {month.reopened}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {month.technical}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {month.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {month.cable}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}