import React from 'react';
import { CheckCircle, Clock, AlertCircle, User } from 'lucide-react';
import type { Ticket } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TicketListProps {
  tickets: Ticket[];
  onCloseTicket: (id: string) => void;
}

export default function TicketList({ tickets, onCloseTicket }: TicketListProps) {
  const getStatusIcon = (ticket: Ticket) => {
    if (ticket.status === 'CLOTURE') {
      return ticket.delaiRespect ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500" />
      );
    }
    return <Clock className="w-5 h-5 text-yellow-500" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Tickets en cours</h2>
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(ticket)}
                  <span className="font-medium text-blue-600">{ticket.ndLogin}</span>
                  <span className="font-medium">{ticket.serviceType}</span>
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-1" />
                    <span className="text-sm">{ticket.technician}</span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {format(ticket.dateCreation, "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{ticket.description}</p>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                <span className="font-medium">Type: {ticket.causeType}</span>
                <span>Cause: {ticket.cause}</span>
              </div>
              {ticket.status === 'EN_COURS' && (
                <button
                  onClick={() => onCloseTicket(ticket.id)}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Clôturer le ticket
                </button>
              )}
            </div>
          ))}
          {tickets.length === 0 && (
            <p className="text-center text-gray-500 py-4">Aucun ticket en cours</p>
          )}
        </div>
      </div>
    </div>
  );
}