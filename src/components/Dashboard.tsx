import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, AlertTriangle, Activity } from 'lucide-react';
import type { DailyStats } from '../types';

interface DashboardProps {
  dailyStats: DailyStats[];
}

const COLORS = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B'];

export default function Dashboard({ dailyStats }: DashboardProps) {
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

      {/* Summary Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Résumé des 7 derniers jours</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Résolus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hors Délai
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Réouvertures
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dailyStats.slice(-7).map((stat, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {stat.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {stat.resolus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      {stat.horsDelai}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                      {stat.reouvertures}
                    </span>
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