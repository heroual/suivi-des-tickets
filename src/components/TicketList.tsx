import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, User, RefreshCw, Search } from 'lucide-react';
import type { Ticket } from '../types';
import { format } from 'date-fns';

interface TicketListProps {
  tickets: Ticket[];
  showOnlyNew?: boolean;
}

export default function TicketList({ tickets, showOnlyNew = false }: TicketListProps) {
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter tickets based on search and new status
  const filteredTickets = tickets.filter(ticket => {
    const isNew = new Date(ticket.dateCreation).toDateString() === new Date().toDateString();
    if (showOnlyNew && !isNew) return false;

    const search = searchTerm.toLowerCase();
    const ndLogin = String(ticket.ndLogin).toLowerCase();
    const description = String(ticket.description).toLowerCase();
    const cause = String(ticket.cause).toLowerCase();
    const motifCloture = ticket.motifCloture ? String(ticket.motifCloture).toLowerCase() : '';

    return ndLogin.includes(search) ||
           description.includes(search) ||
           cause.includes(search) ||
           motifCloture.includes(search);
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          {showOnlyNew ? 'Nouveaux Tickets' : 'Tous les Tickets'}
        </h2>
        
        {/* Search Bar */}
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un ticket..."
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
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
                  {ticket.reopened && (
                    <div className="flex items-center text-amber-600">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        Réouvert {ticket.reopenCount > 1 ? `(${ticket.reopenCount}x)` : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2">
                <p className="text-gray-700">{ticket.description}</p>
                <div className="mt-1 text-sm text-gray-600">
                  <p><span className="font-medium">Cause:</span> {ticket.causeType} - {ticket.cause}</p>
                  {ticket.motifCloture && (
                    <p><span className="font-medium">Motif de clôture:</span> {ticket.motifCloture}</p>
                  )}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                <span>
                  Créé le: {format(ticket.dateCreation, 'dd/MM/yyyy HH:mm')}
                </span>
                {ticket.dateCloture && (
                  <span>
                    Clôturé le: {format(ticket.dateCloture, 'dd/MM/yyyy HH:mm')}
                  </span>
                )}
                <span className={ticket.delaiRespect ? 'text-green-600' : 'text-red-600'}>
                  {ticket.delaiRespect ? 'Dans les délais' : 'Hors délais'}
                </span>
              </div>
            </div>
          ))}
          {filteredTickets.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              {searchTerm ? 'Aucun ticket ne correspond à votre recherche' : 'Aucun ticket disponible'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}