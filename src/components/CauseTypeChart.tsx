import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Types de Causes</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={causeStats}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {causeStats.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}