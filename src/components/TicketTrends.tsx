import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Ticket } from '../types';

interface TicketTrendsProps {
  tickets: Ticket[];
}

export default function TicketTrends({ tickets }: TicketTrendsProps) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weeklyData = daysInWeek.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayTickets = tickets.filter(
      ticket => format(ticket.dateCreation, 'yyyy-MM-dd') === dayStr
    );

    return {
      date: format(day, 'EEE', { locale: fr }),
      total: dayTickets.length,
      resolved: dayTickets.filter(t => t.status === 'CLOTURE').length,
      onTime: dayTickets.filter(t => t.delaiRespect).length
    };
  });

  const COLORS = ['#3B82F6', '#10B981', '#EF4444'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Évolution des Tickets</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" name="Total" fill="#3B82F6" />
            <Bar dataKey="resolved" name="Résolus" fill="#10B981" />
            <Bar dataKey="onTime" name="Dans les délais" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}