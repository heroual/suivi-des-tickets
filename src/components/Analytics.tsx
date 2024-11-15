import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Download, TrendingUp, Users, Clock, AlertTriangle, Activity, Filter } from 'lucide-react';
import type { Ticket, ServiceType, Technician, CauseType } from '../types';
import * as XLSX from 'xlsx';

interface AnalyticsProps {
  tickets: Ticket[];
}

interface TechnicianPerformance {
  name: string;
  totalTickets: number;
  resolvedOnTime: number;
  efficiency: number;
  averageResolutionTime: number;
}

export default function Analytics({ tickets }: AnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '15d' | '30d'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'tickets' | 'resolution' | 'causes'>('tickets');

  const currentMonth = new Date();
  const monthInterval = {
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  };

  const monthlyTickets = useMemo(() => 
    tickets.filter(ticket => 
      isWithinInterval(ticket.dateCreation, monthInterval)
    ),
    [tickets, monthInterval.start, monthInterval.end]
  );

  // Calcul des KPIs
  const kpis = useMemo(() => {
    const total = monthlyTickets.length;
    const resolved = monthlyTickets.filter(t => t.status === 'CLOTURE').length;
    const onTime = monthlyTickets.filter(t => t.delaiRespect).length;
    const reopened = monthlyTickets.filter(t => t.reopened).length;

    return {
      total,
      resolved,
      resolutionRate: total > 0 ? (resolved / total) * 100 : 0,
      onTimeRate: total > 0 ? (onTime / total) * 100 : 0,
      reopenRate: total > 0 ? (reopened / total) * 100 : 0,
    };
  }, [monthlyTickets]);

  // Analyse des causes
  const causeAnalysis = useMemo(() => {
    const causes = monthlyTickets.reduce((acc, ticket) => {
      acc[ticket.causeType] = (acc[ticket.causeType] || 0) + 1;
      return acc;
    }, {} as Record<CauseType, number>);

    return Object.entries(causes).map(([name, value]) => ({
      name,
      value,
      percentage: (value / monthlyTickets.length) * 100
    }));
  }, [monthlyTickets]);

  // Performance des techniciens
  const technicianPerformance = useMemo(() => {
    const performance: Record<Technician, TechnicianPerformance> = {
      'BRAHIM': { name: 'BRAHIM', totalTickets: 0, resolvedOnTime: 0, efficiency: 0, averageResolutionTime: 0 },
      'ABDERAHMAN': { name: 'ABDERAHMAN', totalTickets: 0, resolvedOnTime: 0, efficiency: 0, averageResolutionTime: 0 },
      'AXE': { name: 'AXE', totalTickets: 0, resolvedOnTime: 0, efficiency: 0, averageResolutionTime: 0 }
    };

    monthlyTickets.forEach(ticket => {
      const tech = performance[ticket.technician];
      tech.totalTickets++;
      if (ticket.delaiRespect) tech.resolvedOnTime++;
      
      if (ticket.dateCloture) {
        const resolutionTime = ticket.dateCloture.getTime() - ticket.dateCreation.getTime();
        tech.averageResolutionTime = (tech.averageResolutionTime * (tech.totalTickets - 1) + resolutionTime) / tech.totalTickets;
      }
    });

    Object.values(performance).forEach(tech => {
      tech.efficiency = tech.totalTickets > 0 ? (tech.resolvedOnTime / tech.totalTickets) * 100 : 0;
    });

    return Object.values(performance);
  }, [monthlyTickets]);

  const COLORS = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B'];

  const exportToExcel = () => {
    const summaryData = [
      ['Synthèse des Performances - ' + format(currentMonth, 'MMMM yyyy', { locale: fr })],
      [''],
      ['KPIs Principaux'],
      ['Total des tickets', kpis.total],
      ['Taux de résolution', `${kpis.resolutionRate.toFixed(1)}%`],
      ['Respect des délais', `${kpis.onTimeRate.toFixed(1)}%`],
      ['Taux de réouverture', `${kpis.reopenRate.toFixed(1)}%`],
      [''],
      ['Analyse des Causes'],
      ...causeAnalysis.map(cause => [cause.name, cause.value, `${cause.percentage.toFixed(1)}%`]),
      [''],
      ['Performance des Techniciens'],
      ['Technicien', 'Total Tickets', 'Résolus à temps', 'Efficacité', 'Temps moyen de résolution (h)'],
      ...technicianPerformance.map(tech => [
        tech.name,
        tech.totalTickets,
        tech.resolvedOnTime,
        `${tech.efficiency.toFixed(1)}%`,
        (tech.averageResolutionTime / (1000 * 60 * 60)).toFixed(1)
      ])
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Style the worksheet
    ws['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 25 }];
    
    XLSX.utils.book_append_sheet(wb, ws, 'Synthèse');
    XLSX.writeFile(wb, `synthese-performances-${format(currentMonth, 'yyyy-MM')}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de Bord Analytique - {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          </h1>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="7d">7 derniers jours</option>
                <option value="15d">15 derniers jours</option>
                <option value="30d">30 derniers jours</option>
              </select>
            </div>
            <button
              onClick={exportToExcel}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-5 h-5 mr-2" />
              Exporter le rapport
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-blue-900 font-medium">Total Tickets</h3>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-900 mt-2">{kpis.total}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-green-900 font-medium">Taux de Résolution</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-900 mt-2">
              {kpis.resolutionRate.toFixed(1)}%
            </p>
          </div>

          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-amber-900 font-medium">Respect des Délais</h3>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-amber-900 mt-2">
              {kpis.onTimeRate.toFixed(1)}%
            </p>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-red-900 font-medium">Taux de Réouverture</h3>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-900 mt-2">
              {kpis.reopenRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cause Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Analyse des Causes</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={causeAnalysis}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                >
                  {causeAnalysis.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Technician Performance */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Performance des Techniciens</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={technicianPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="totalTickets" name="Total Tickets" fill="#3B82F6" />
                <Bar yAxisId="left" dataKey="resolvedOnTime" name="Résolus à temps" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Performance Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">Détail des Performances</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technicien
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Tickets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Résolus à temps
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficacité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Temps moyen de résolution
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {technicianPerformance.map((tech) => (
                <tr key={tech.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tech.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tech.totalTickets}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tech.resolvedOnTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tech.efficiency.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(tech.averageResolutionTime / (1000 * 60 * 60)).toFixed(1)}h
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