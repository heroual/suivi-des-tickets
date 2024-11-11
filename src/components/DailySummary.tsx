import React from 'react';
import { Ticket } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DailySummaryProps {
  tickets: Ticket[];
}

export default function DailySummary({ tickets }: DailySummaryProps) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayTickets = tickets.filter(
    (ticket) => format(ticket.dateCreation, 'yyyy-MM-dd') === today
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
        </h2>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
          <span className="font-semibold">{todayTickets.length}</span> tickets aujourd'hui
        </div>
      </div>
    </div>
  );
}