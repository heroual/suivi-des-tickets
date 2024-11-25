import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import type { Ticket, CauseStats } from '../types';

interface CauseTypeChartProps {
  tickets: Ticket[];
}

const COLORS = ['#3B82F6', '#10B981', '#EF4444'];

export default function CauseTypeChart({ tickets }: CauseTypeChartProps) {
  const causeStats: CauseStats[] = [
    { name: 'Technique', value: tickets.filter(t => t.causeType === 'Technique').length },
    { name: 'Client', value: tickets.filter(t => t.causeType === 'Client').length },
    { name: 'Casse', value: tickets.filter(t => t.causeType === 'Casse').length },
  ].filter(stat => stat.value > 0);

  const total = causeStats.reduce((sum, stat) => sum + stat.value, 0);

  const getPercentage = (value: number) => ((value / total) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Analyse des Causes</h2>
            <p className="text-sm text-gray-600">Distribution des types d'incidents</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={causeStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                label={({ name, value }) => `${name} (${getPercentage(value)}%)`}
              >
                {causeStats.map((entry, index) => (
                  <Cell 
                    key={entry.name} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} tickets`, 'Total']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem'
                }}
              />
              <Legend 
                verticalAlign="middle" 
                align="right"
                layout="vertical"
                formatter={(value: string) => {
                  const stat = causeStats.find(s => s.name === value);
                  return [
                    `${value}: ${stat?.value} (${getPercentage(stat?.value || 0)}%)`,
                    'name'
                  ];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          {causeStats.map((stat, index) => (
            <div 
              key={stat.name}
              className={`p-4 rounded-lg ${
                index === 0 ? 'bg-blue-50' :
                index === 1 ? 'bg-green-50' :
                'bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  index === 0 ? 'text-blue-700' :
                  index === 1 ? 'text-green-700' :
                  'text-red-700'
                }`}>
                  {stat.name}
                </span>
                {index === 0 ? (
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                ) : index === 1 ? (
                  <Brain className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="flex items-end justify-between">
                <span className={`text-2xl font-bold ${
                  index === 0 ? 'text-blue-900' :
                  index === 1 ? 'text-green-900' :
                  'text-red-900'
                }`}>
                  {stat.value}
                </span>
                <span className={`text-sm ${
                  index === 0 ? 'text-blue-600' :
                  index === 1 ? 'text-green-600' :
                  'text-red-600'
                }`}>
                  {getPercentage(stat.value)}%
                </span>
              </div>
              <div className="mt-2 relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${getPercentage(stat.value)}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      index === 0 ? 'bg-blue-600' :
                      index === 1 ? 'bg-green-600' :
                      'bg-red-600'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}