import React from 'react';
import TicketList from './TicketList';
import type { Ticket } from '../types';

interface AllTicketsProps {
  tickets: Ticket[];
}

export default function AllTickets({ tickets }: AllTicketsProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Historique des Tickets</h1>
        <p className="mt-1 text-sm text-gray-600">
          Consultez l'historique complet des tickets de support
        </p>
      </div>
      <TicketList tickets={tickets} showOnlyNew={false} />
    </div>
  );
}