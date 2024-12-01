import React, { useState, useEffect } from 'react';
import PKIDisplay from './PKIDisplay';
import MonthlyIndicators from './MonthlyIndicators';
import CausesSuggestions from './CausesSuggestions';
import CriticalCableTickets from './CriticalCableTickets';
import ActionPlan from './ActionPlan';
import MonthlyStats from './MonthlyStats';
import TicketForm from './TicketForm';
import DateBar from './DateBar';
import CauseTypeChart from './CauseTypeChart';
import { useFilteredTickets } from '../hooks/useFilteredTickets';
import type { Ticket } from '../types';
import { calculatePKI } from '../utils/pki';

interface DashboardProps {
  tickets: Ticket[];
  onTicketsUpdate: () => Promise<void>;
}

export default function Dashboard({ tickets, onTicketsUpdate }: DashboardProps) {
  const filteredTickets = useFilteredTickets(tickets);
  const pki = calculatePKI(filteredTickets);

  const handleNewTicket = async (ticketData: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'>) => {
    try {
      await onTicketsUpdate();
    } catch (error) {
      console.error('Error adding ticket:', error);
    }
  };

  return (
    <div className="space-y-6">
      <DateBar />
      <PKIDisplay stats={pki} />
      <MonthlyIndicators tickets={filteredTickets} />
      <MonthlyStats tickets={filteredTickets} />
      <CausesSuggestions tickets={filteredTickets} />
      
      <div className="space-y-6">
        <CriticalCableTickets 
          tickets={filteredTickets}
          onAddTicket={handleNewTicket}
          onUpdateTicket={onTicketsUpdate}
          onDeleteTicket={onTicketsUpdate}
        />
        <ActionPlan tickets={filteredTickets} />
      </div>
      
      <div className="space-y-6">
        <TicketForm onSubmit={handleNewTicket} />
        <CauseTypeChart tickets={filteredTickets} />
      </div>
    </div>
  );
}