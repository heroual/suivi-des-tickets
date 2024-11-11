import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Ticket } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

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
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayTickets = tickets.filter(
      ticket => format(ticket.dateCreation, 'yyyy-MM-dd') === dayStr
    );

    return {
      date: format(day, 'd MMM', { locale: fr }),
      total: dayTickets.length,
      resolus: dayTickets.filter(t => t.status === 'CLOTURE').length,
      horsDelai: dayTickets.filter(t => !t.delaiRespect).length,
      reouvertures: dayTickets.filter(t => t.reopened).length,
    };
  });

  const monthTotals = {
    tickets: tickets.filter(t => 
      t.dateCreation >= monthInterval.start && 
      t.dateCreation <= monthInterval.end
    ).length,
    resolus: tickets.filter(t => 
      t.dateCreation >= monthInterval.start && 
      t.dateCreation <= monthInterval.end && 
      t.status === 'CLOTURE'
    ).length,
    horsDelai: tickets.filter(t => 
      t.dateCreation >= monthInterval.start && 
      t.dateCreation <= monthInterval.end && 
      !t.delaiRespect
    ).length,
    reouvertures: tickets.filter(t => 
      t.dateCreation >= monthInterval.start && 
      t.dateCreation <= monthInterval.end && 
      t.reopened
    ).length,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Statistiques du Mois {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h2>
        <div className="flex gap-4">
          <div className="text-sm">
            <span className="text-blue-600 font-semibold">{monthTotals.tickets}</span> Total
          </div>
          <div className="text-sm">
            <span className="text-green-600 font-semibold">{monthTotals.resolus}</span> Résolus
          </div>
          <div className="text-sm">
            <span className="text-red-600 font-semibold">{monthTotals.horsDelai}</span> Hors Délai
          </div>
          <div className="text-sm">
            <span className="text-amber-600 font-semibold">{monthTotals.reouvertures}</span> Réouvertures
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
            <Bar dataKey="total" name="Total" fill="#3B82F6" />
            <Bar dataKey="resolus" name="Résolus" fill="#10B981" />
            <Bar dataKey="horsDelai" name="Hors Délai" fill="#EF4444" />
            <Bar dataKey="reouvertures" name="Réouvertures" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}