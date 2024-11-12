import React from 'react';
import { Ticket } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, Upload, Calculator } from 'lucide-react';

interface DailySummaryProps {
  tickets: Ticket[];
}

export default function DailySummary({ tickets }: DailySummaryProps) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayTickets = tickets.filter(
    (ticket) => format(ticket.dateCreation, 'yyyy-MM-dd') === today
  );

  // Calculate tickets by type
  const createdTickets = todayTickets.filter(ticket => !ticket.imported);
  const importedTickets = todayTickets.filter(ticket => ticket.imported);
  const totalTickets = todayTickets.length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">
          {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
        </h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
            <FileText className="w-5 h-5 mr-2" />
            <span className="font-semibold">{createdTickets.length}</span>
            <span className="ml-1">créés</span>
          </div>
          <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <Upload className="w-5 h-5 mr-2" />
            <span className="font-semibold">{importedTickets.length}</span>
            <span className="ml-1">importés</span>
          </div>
          <div className="flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
            <Calculator className="w-5 h-5 mr-2" />
            <span className="font-semibold">{totalTickets}</span>
            <span className="ml-1">total</span>
          </div>
        </div>
      </div>
    </div>
  );
}