import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTickets } from '../hooks/useTickets';
import { useDateFilter } from '../contexts/DateContext';
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
import FeedbackSection from './FeedbackSection';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { tickets, loading, error, refreshTickets } = useTickets();
  const { selectedDate } = useDateFilter();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    criticalTickets: true,
    actionPlan: true,
    ticketForm: true,
    feedback: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ErrorMessage message={error} onRetry={refreshTickets} />
      </div>
    );
  }

  // Filter tickets for selected month
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const monthlyTickets = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.dateCreation);
    return ticketDate >= monthStart && ticketDate <= monthEnd;
  });

  const monthlyPKI = calculatePKI(monthlyTickets);

  const SectionHeader = ({ title, section }: { title: string; section: keyof typeof expandedSections }) => (
    <div 
      className="flex items-center justify-between bg-white p-4 rounded-t-xl shadow-sm cursor-pointer hover:bg-gray-50"
      onClick={() => toggleSection(section)}
    >
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {expandedSections[section] ? (
        <ChevronUp className="w-5 h-5 text-gray-500" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-500" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Section - Always Visible */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <DateBar />
          <div className="mt-6">
            <PKIDisplay stats={monthlyPKI} isMonthly={true} />
          </div>
        </div>

        {/* Monthly Indicators */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Indicateurs Mensuels</h2>
          <MonthlyIndicators tickets={monthlyTickets} />
        </div>

        {/* Monthly Stats */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques Mensuelles</h2>
          <MonthlyStats tickets={monthlyTickets} />
        </div>

        {/* Causes and Suggestions */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Analyse des Causes</h2>
          <CausesSuggestions tickets={monthlyTickets} />
        </div>

        {/* Critical Cable Tickets Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <SectionHeader title="Tickets Câbles Critiques" section="criticalTickets" />
          {expandedSections.criticalTickets && (
            <div className="p-4 sm:p-6">
              <CriticalCableTickets 
                tickets={monthlyTickets}
                onAddTicket={refreshTickets}
                onUpdateTicket={refreshTickets}
                onDeleteTicket={refreshTickets}
              />
            </div>
          )}
        </div>

        {/* Action Plan Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <SectionHeader title="Plan d'Action" section="actionPlan" />
          {expandedSections.actionPlan && (
            <div className="p-4 sm:p-6">
              <ActionPlan tickets={monthlyTickets} />
            </div>
          )}
        </div>

        {/* Ticket Form Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <SectionHeader title="Nouveau Ticket" section="ticketForm" />
          {expandedSections.ticketForm && (
            <div className="p-4 sm:p-6">
              <TicketForm onSubmit={refreshTickets} />
            </div>
          )}
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <SectionHeader title="Feedback" section="feedback" />
          {expandedSections.feedback && (
            <div className="p-4 sm:p-6">
              <FeedbackSection />
            </div>
          )}
        </div>
      </div>

      {/* Floating Feedback Button */}
      <div className="fixed bottom-6 right-6">
        <FeedbackButton onClick={() => setShowFeedbackModal(true)} />
      </div>

      {/* Feedback Modal */}
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