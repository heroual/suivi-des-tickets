import React, { useMemo } from 'react';
import { format, eachMonthOfInterval, startOfYear, endOfYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Clock, AlertTriangle, Download } from 'lucide-react';
import type { Ticket } from '../types';
import { getMonthlyClosedTickets } from '../utils/pki';
import * as XLSX from 'xlsx';

interface YearlyTimelineProps {
  tickets: Ticket[];
}

interface MonthlyStats {
  month: string;
  total: number;
  horsDelai: number;
  reouvertures: number;
  technique: number;
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
      const monthTickets = getMonthlyClosedTickets(tickets, month);

      return {
        month: format(month, 'MMM', { locale: fr }),
        total: monthTickets.length,
        horsDelai: monthTickets.filter(t => !t.delaiRespect).length,
        reouvertures: monthTickets.filter(t => t.reopened).length,
        technique: monthTickets.filter(t => t.causeType === 'Technique').length,
        client: monthTickets.filter(t => t.causeType === 'Client').length,
        cable: monthTickets.filter(t => t.causeType === 'Casse').length
      };
    });
  }, [tickets]);

  const yearTotals = useMemo(() => ({
    total: monthlyStats.reduce((acc, month) => acc + month.total, 0),
    horsDelai: monthlyStats.reduce((acc, month) => acc + month.horsDelai, 0),
    reouvertures: monthlyStats.reduce((acc, month) => acc + month.reouvertures, 0)
  }), [monthlyStats]);

  const exportToExcel = () => {
    const summaryData = [
      ['Statistiques Annuelles des Tickets Clôturés', new Date().getFullYear().toString()],
      [''],
      ['Totaux'],
      ['Total tickets clôturés', yearTotals.total],
      ['Hors délai', yearTotals.horsDelai],
      ['Réouvertures', yearTotals.reouvertures],
      [''],
      ['Détails Mensuels'],
      [
        'Mois',
        'Total Clôturés',
        'Hors délai',
        'Réouvertures',
        'Technique',
        'Client',
        'Câble'
      ],
      ...monthlyStats.map(month => [
        month.month,
        month.total,
        month.horsDelai,
        month.reouvertures,
        month.technique,
        month.client,
        month.cable
      ])
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(summaryData);
    
    ws['!cols'] = [
      { wch: 15 }, // Month
      { wch: 15 }, // Total
      { wch: 12 }, // Hors délai
      { wch: 12 }, // Réouvertures
      { wch: 10 }, // Technique
      { wch: 10 }, // Client
      { wch: 10 }  // Cable
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Statistiques Annuelles');
    XLSX.writeFile(wb, `statistiques-clotures-${new Date().getFullYear()}.xlsx`);
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
                Timeline des Clôtures {new Date().getFullYear()}
              </h1>
              <p className="text-gray-600">Vue d'ensemble des tickets clôturés par mois</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-blue-900 font-medium">Total Clôturés</h3>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-2">{yearTotals.total}</p>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-red-900 font-medium">Hors Délai</h3>
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-900 mt-2">{yearTotals.horsDelai}</p>
            <p className="text-sm text-red-600 mt-1">
              {yearTotals.total > 0 ? ((yearTotals.horsDelai / yearTotals.total) * 100).toFixed(1) : 0}%
            </p>
          </div>

          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-amber-900 font-medium">Réouvertures</h3>
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-900 mt-2">{yearTotals.reouvertures}</p>
            <p className="text-sm text-amber-600 mt-1">
              {yearTotals.total > 0 ? ((yearTotals.reouvertures / yearTotals.total) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Timeline Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Évolution Mensuelle des Clôtures</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" name="Total Clôturés" fill="#3B82F6" />
              <Bar dataKey="horsDelai" name="Hors Délai" fill="#EF4444" />
              <Bar dataKey="reouvertures" name="Réouvertures" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Details Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Détails Mensuels des Clôtures</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mois
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Clôturés
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hors Délai
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {month.total}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      {month.horsDelai}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                      {month.reouvertures}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {month.technique}
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