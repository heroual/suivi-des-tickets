import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getTickets, addMultipleTickets, logoutUser } from '../services/firebase';
import MainHeader from './MainHeader';
import ExcelImport from './ExcelImport';
import PKICalculator from './PKICalculator';
import Documentation from './Documentation';
import AppInfo from './AppInfo';
import NavigationBar from './navigation/NavigationBar';
import DateBar from './DateBar';
import { calculatePKI } from '../utils/pki';
import type { Ticket } from '../types';
import PKIDisplay from './PKIDisplay';
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
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [showPKICalculator, setShowPKICalculator] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadTickets();
    }
  }, [user]);

  const loadTickets = async () => {
    try {
      const loadedTickets = await getTickets();
      setTickets(loadedTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  };

  const handleNewTicket = async (ticketData: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'>) => {
    try {
      await addMultipleTickets([ticketData]);
      await loadTickets();
    } catch (error) {
      console.error('Error adding ticket:', error);
    }
  };

  const handleImportTickets = async (tickets: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'>[]) => {
    try {
      await addMultipleTickets(tickets);
      await loadTickets();
    } catch (error) {
      console.error('Error importing tickets:', error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader onLogout={logoutUser} />
      <NavigationBar 
        onImportClick={() => setShowExcelImport(true)}
        onPKIClick={() => setShowPKICalculator(true)}
        onDocsClick={() => setShowDocumentation(true)}
        onInfoClick={() => setShowInfo(true)}
      />
      
      <DateBar />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PKIDisplay stats={calculatePKI(tickets)} />
        <MonthlyIndicators tickets={tickets} />
        <MonthlyStats tickets={tickets} />
        <CausesSuggestions tickets={tickets} />
        
        <div className="space-y-6">
          <CriticalCableTickets 
            tickets={tickets}
            onAddTicket={handleNewTicket}
            onUpdateTicket={loadTickets}
            onDeleteTicket={loadTickets}
          />
          <ActionPlan tickets={tickets} />
        </div>
        
        <div className="space-y-6">
          <TicketForm onSubmit={handleNewTicket} />
        </div>
      </div>

      <FeedbackButton onClick={() => setShowFeedbackModal(true)} />

      {showExcelImport && (
        <ExcelImport 
          isOpen={showExcelImport} 
          onClose={() => setShowExcelImport(false)} 
          onImport={handleImportTickets}
        />
      )}

      {showPKICalculator && (
        <PKICalculator 
          isOpen={showPKICalculator} 
          onClose={() => setShowPKICalculator(false)} 
        />
      )}

      {showDocumentation && (
        <Documentation 
          isOpen={showDocumentation} 
          onClose={() => setShowDocumentation(false)} 
        />
      )}

      {showInfo && (
        <AppInfo 
          isOpen={showInfo} 
          onClose={() => setShowInfo(false)} 
        />
      )}

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={() => {
          setShowFeedbackModal(false);
          // Reload feedbacks if needed
        }}
      />
    </div>
  );
}