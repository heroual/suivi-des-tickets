import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DailyStats } from '../types';

interface DashboardProps {
  dailyStats: DailyStats[];
}

export default function Dashboard({ dailyStats }: DashboardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Statistiques des Tickets</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" name="Total" fill="#3B82F6" key="bar-total" />
            <Bar dataKey="resolus" name="Résolus" fill="#10B981" key="bar-resolus" />
            <Bar dataKey="horsDelai" name="Hors Délai" fill="#EF4444" key="bar-horsDelai" />
            <Bar dataKey="reouvertures" name="Réouvertures" fill="#F59E0B" key="bar-reouvertures" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}