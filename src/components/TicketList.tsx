import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, User, RefreshCw, Trash2, Edit, Search, X } from 'lucide-react';
import type { Ticket } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import TicketForm from './TicketForm';

interface TicketListProps {
  tickets: Ticket[];
  onUpdateTicket?: (id: string, ticket: Omit<Ticket, 'id'>) => void;
  onDeleteTicket?: (id: string) => void;
}

export default function TicketList({ tickets, onUpdateTicket, onDeleteTicket }: TicketListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

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

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setShowEditModal(true);
  };

  const handleUpdate = (updatedTicket: Omit<Ticket, 'id'>) => {
    if (editingTicket && onUpdateTicket) {
      onUpdateTicket(editingTicket.id, updatedTicket);
      setShowEditModal(false);
      setEditingTicket(null);
    }
  };

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy HH:mm');
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Liste des Tickets</h2>
          
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
                    <div className="flex items-center text-amber-600">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        Réouverture: {ticket.reopened ? 'Oui' : 'Non'}
                        {ticket.reopenCount > 0 && ` (${ticket.reopenCount}x)`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {onUpdateTicket && (
                      <button
                        onClick={() => handleEdit(ticket)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        title="Modifier"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    )}
                    {onDeleteTicket && (
                      <button
                        onClick={() => onDeleteTicket(ticket.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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
                    Créé le: {formatDate(ticket.dateCreation)}
                  </span>
                  {ticket.dateCloture && (
                    <span>
                      Clôturé le: {formatDate(ticket.dateCloture)}
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

      {/* Edit Modal */}
      {showEditModal && editingTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Modifier le Ticket</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <TicketForm
                onSubmit={handleUpdate}
                initialData={editingTicket}
                isEdit={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}