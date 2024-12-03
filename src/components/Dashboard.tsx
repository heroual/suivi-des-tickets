import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { addMultipleTickets } from '../services/firebase';
import PKIDisplay from './PKIDisplay';
import Documentation from './Documentation';
import AppInfo from './AppInfo';
import DateBar from './DateBar';
import { calculatePKI } from '../utils/pki';
import type { Ticket } from '../types';
import MonthlyIndicators from './MonthlyIndicators';
import CausesSuggestions from './CausesSuggestions';
import CriticalCableTickets from './CriticalCableTickets';
import ActionPlan from './ActionPlan';
import MonthlyStats from './MonthlyStats';
import TicketForm from './TicketForm';
import FeedbackButton from './FeedbackButton';
import FeedbackModal from './FeedbackModal';

export default function Dashboard() {
  const { user } = useAuth();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const handleNewTicket = async (ticketData: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'>) => {
    try {
      await addMultipleTickets([ticketData]);
    } catch (error) {
      console.error('Error adding ticket:', error);
    }
  };

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <DateBar />
      <PKIDisplay stats={calculatePKI([])} />
      <MonthlyIndicators tickets={[]} />
      <MonthlyStats tickets={[]} />
      <CausesSuggestions tickets={[]} />
      
      <div className="space-y-6">
        <CriticalCableTickets 
          tickets={[]}
          onAddTicket={handleNewTicket}
          onUpdateTicket={() => {}}
          onDeleteTicket={() => {}}
        />
        <ActionPlan tickets={[]} />
      </div>
      
      <div className="space-y-6">
        <TicketForm onSubmit={handleNewTicket} />
      </div>

      <FeedbackButton onClick={() => setShowFeedbackModal(true)} />

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={() => {
          setShowFeedbackModal(false);
        }}
      />
    </div>
  );
}