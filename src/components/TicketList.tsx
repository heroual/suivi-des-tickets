import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, User, RefreshCw, Search, X } from 'lucide-react';
import type { Ticket } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TicketListProps {
  tickets: Ticket[];
  showOnlyNew?: boolean;
  onCloseTicket?: (id: string) => Promise<void>;
}

export default function TicketList({ tickets, showOnlyNew = false, onCloseTicket }: TicketListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [closingTicketId, setClosingTicketId] = useState<string | null>(null);

  const handleCloseTicket = async (id: string) => {
    if (!onCloseTicket) return;
    
    try {
      setClosingTicketId(id);
      await onCloseTicket(id);
    } catch (error) {
      console.error('Error closing ticket:', error);
      alert('Erreur lors de la clôture du ticket. Veuillez réessayer.');
    } finally {
      setClosingTicketId(null);
    }
  };

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

  const filteredTickets = tickets.filter(ticket => {
    const isNew = new Date(ticket.dateCreation).toDateString() === new Date().toDateString();
    if (showOnlyNew && !isNew) return false;

    const search = searchTerm.toLowerCase();
    return (
      ticket.ndLogin.toLowerCase().includes(search) ||
      ticket.description.toLowerCase().includes(search) ||
      ticket.cause.toLowerCase().includes(search) ||
      (ticket.motifCloture?.toLowerCase().includes(search) ?? false)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {showOnlyNew ? 'Nouveaux Tickets' : 'Tous les Tickets'}
          </h2>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
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
                  <span className="text-sm px-2 py-1 rounded-full bg-gray-100">
                    {ticket.serviceType}
                  </span>
                </div>
                {ticket.status === 'EN_COURS' && onCloseTicket && (
                  <button
                    onClick={() => handleCloseTicket(ticket.id)}
                    disabled={closingTicketId === ticket.id}
                    className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {closingTicketId === ticket.id ? (
                      <span className="flex items-center">
                        <Clock className="animate-spin h-4 w-4 mr-2" />
                        Clôture...
                      </span>
                    ) : (
                      'Clôturer'
                    )}
                  </button>
                )}
              </div>

              <div className="mt-2">
                <p className="text-gray-700">{ticket.description}</p>
                <div className="mt-2 text-sm text-gray-500 space-y-1">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {ticket.technician}
                  </div>
                  {ticket.reopened && (
                    <div className="flex items-center text-amber-600">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Réouvert {ticket.reopenCount > 1 ? `(${ticket.reopenCount}x)` : ''}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-500 space-x-4">
                <span>
                  Créé le: {format(ticket.dateCreation, 'dd/MM/yyyy HH:mm', { locale: fr })}
                </span>
                {ticket.dateCloture && (
                  <span>
                    Clôturé le: {format(ticket.dateCloture, 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </span>
                )}
              </div>
            </div>
          ))}

          {filteredTickets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'Aucun ticket ne correspond à votre recherche' : 'Aucun ticket disponible'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}