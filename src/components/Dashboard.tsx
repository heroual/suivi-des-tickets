import React, { useState, useEffect } from 'react';
import { getTickets } from '../services/firebase';
import PKIDisplay from './PKIDisplay';
import MonthlyIndicators from './MonthlyIndicators';
import CausesSuggestions from './CausesSuggestions';
import CriticalCableTickets from './CriticalCableTickets';
import ActionPlan from './ActionPlan';
import MonthlyStats from './MonthlyStats';
import TicketForm from './TicketForm';
import DateBar from './DateBar';
import DashboardStats from './Dashboard';
import CauseTypeChart from './CauseTypeChart';
import type { Ticket } from '../types';
import { calculatePKI } from '../utils/pki';

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const loadedTickets = await getTickets();
      setTickets(loadedTickets);
      setError(null);
    } catch (error) {
      console.error('Error loading tickets:', error);
      setError('Failed to load tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewTicket = async (ticketData: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'>) => {
    try {
      await loadTickets();
    } catch (error) {
      console.error('Error reloading tickets:', error);
      setError('Failed to update tickets. Please try again.');
    }
  };

  const handleUpdateTicket = async (id: string, data: Partial<Ticket>) => {
    try {
      await loadTickets();
    } catch (error) {
      console.error('Error updating ticket:', error);
      setError('Failed to update ticket. Please try again.');
    }
  };

  const handleCloseTicket = async (id: string) => {
    try {
      await loadTickets();
    } catch (error) {
      console.error('Error closing ticket:', error);
      setError('Failed to close ticket. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const pki = calculatePKI(tickets);

  return (
    <div className="space-y-6">
      <DateBar />
      <PKIDisplay stats={pki} />
      <MonthlyIndicators tickets={tickets} />
      <MonthlyStats tickets={tickets} />
      <CausesSuggestions tickets={tickets} />
      
      <div className="space-y-6">
        <CriticalCableTickets 
          tickets={tickets}
          onAddTicket={handleNewTicket}
          onUpdateTicket={handleUpdateTicket}
          onDeleteTicket={handleCloseTicket}
        />
        <ActionPlan tickets={tickets} />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TicketForm onSubmit={handleNewTicket} />
          <CauseTypeChart tickets={tickets} />
        </div>
      </div>
    </div>
  );
}