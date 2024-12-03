import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTickets } from '../hooks/useTickets';
import PKIDisplay from './PKIDisplay';
import Documentation from './Documentation';
import AppInfo from './AppInfo';
import DateBar from './DateBar';
import { calculatePKI } from '../utils/pki';
import MonthlyIndicators from './MonthlyIndicators';
import CausesSuggestions from './CausesSuggestions';
import CriticalCableTickets from './CriticalCableTickets';
import ActionPlan from './ActionPlan';
import MonthlyStats from './MonthlyStats';
import TicketForm from './TicketForm';
import FeedbackButton from './FeedbackButton';
import FeedbackModal from './FeedbackModal';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

export default function Dashboard() {
  const { user } = useAuth();
  const { tickets, loading, error, refreshTickets } = useTickets();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refreshTickets} />;
  }

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <DateBar />
      <PKIDisplay stats={calculatePKI(tickets)} />
      <MonthlyIndicators tickets={tickets} />
      <MonthlyStats tickets={tickets} />
      <CausesSuggestions tickets={tickets} />
      
      <div className="space-y-6">
        <CriticalCableTickets 
          tickets={tickets}
          onAddTicket={refreshTickets}
          onUpdateTicket={refreshTickets}
          onDeleteTicket={refreshTickets}
        />
        <ActionPlan tickets={tickets} />
      </div>
      
      <div className="space-y-6">
        <TicketForm onSubmit={refreshTickets} />
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