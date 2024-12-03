import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAutoSignout } from '../hooks/useAutoSignout';
import { getTickets, addMultipleTickets } from '../services/firebase';
import { calculatePKI } from '../utils/pki';
import AuthModal from './AuthModal';
import MainHeader from './MainHeader';
import ExcelImport from './ExcelImport';
import PKICalculator from './PKICalculator';
import Documentation from './Documentation';
import AppInfo from './AppInfo';
import NavigationBar from './navigation/NavigationBar';
import AutoSignoutAlert from './AutoSignoutAlert';
import DashboardLayout from './layouts/DashboardLayout';
import { DateProvider } from '../contexts/DateContext';
import { logoutUser } from '../services/firebase';
import type { Ticket } from '../types';
import PKIDisplay from './PKIDisplay';
import MonthlyIndicators from './MonthlyIndicators';
import CausesSuggestions from './CausesSuggestions';
import CriticalCableTickets from './CriticalCableTickets';
import ActionPlan from './ActionPlan';
import MonthlyStats from './MonthlyStats';
import TicketForm from './TicketForm';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const remainingTime = useAutoSignout();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [showPKICalculator, setShowPKICalculator] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthModal isOpen={true} onClose={() => {}} />;
  }

  return (
    <DateProvider>
      <DashboardLayout>
        <div className="flex flex-col min-h-screen">
          <MainHeader onLogout={logoutUser} />
          <NavigationBar 
            onImportClick={() => setShowExcelImport(true)}
            onPKIClick={() => setShowPKICalculator(true)}
            onDocsClick={() => setShowDocumentation(true)}
            onInfoClick={() => setShowInfo(true)}
          />
          
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
        </div>

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

        {remainingTime <= 60 && <AutoSignoutAlert remainingTime={remainingTime} />}
      </DashboardLayout>
    </DateProvider>
  );
}