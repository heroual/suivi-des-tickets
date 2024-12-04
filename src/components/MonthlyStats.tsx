import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Ticket } from '../types';
import { getDailyClosedTickets } from '../utils/pki';

interface MonthlyStatsProps {
  tickets: Ticket[];
}

export default function MonthlyStats({ tickets }: MonthlyStatsProps) {
  const currentMonth = new Date();
  const monthInterval = {
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  };

  const daysInMonth = eachDayOfInterval(monthInterval);
  const monthlyData = daysInMonth.map(day => {
    const dayTickets = getDailyClosedTickets(tickets, day);

    return {
      date: format(day, 'd MMM', { locale: fr }),
      total: dayTickets.length,
      resolus: dayTickets.length, // All tickets are resolved since we're filtering by closure date
      horsDelai: dayTickets.filter(t => !t.delaiRespect).length,
      reouvertures: dayTickets.filter(t => t.reopened).length,
    };
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Tickets Clôturés - {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h2>
        <div className="flex gap-4">
          <div className="text-sm">
            <span className="text-blue-600 font-semibold">
              {monthlyData.reduce((acc, day) => acc + day.total, 0)}
            </span> Total Clôturés
          </div>
          <div className="text-sm">
            <span className="text-red-600 font-semibold">
              {monthlyData.reduce((acc, day) => acc + day.horsDelai, 0)}
            </span> Hors Délai
          </div>
          <div className="text-sm">
            <span className="text-amber-600 font-semibold">
              {monthlyData.reduce((acc, day) => acc + day.reouvertures, 0)}
            </span> Réouvertures
          </div>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="total" 
              name="Tickets Clôturés" 
              fill="#3B82F6" 
              key={`total-${monthInterval.start.getTime()}`} 
            />
            <Bar 
              dataKey="horsDelai" 
              name="Hors Délai" 
              fill="#EF4444" 
              key={`horsDelai-${monthInterval.start.getTime()}`} 
            />
            <Bar 
              dataKey="reouvertures" 
              name="Réouvertures" 
              fill="#F59E0B" 
              key={`reouvertures-${monthInterval.start.getTime()}`} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}