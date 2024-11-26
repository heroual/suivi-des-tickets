import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Info, Calculator, LogIn, LogOut, FileSpreadsheet, History, BookOpen, BarChart2, Router, Menu, X as CloseIcon, Calendar, Zap } from 'lucide-react';
import { User } from 'firebase/auth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import TicketForm from './components/TicketForm';
import AllTickets from './components/AllTickets';
import Dashboard from './components/Dashboard';
import CauseTypeChart from './components/CauseTypeChart';
import MonthlyStats from './components/MonthlyStats';
import MonthlyIndicators from './components/MonthlyIndicators';
import AppInfo from './components/AppInfo';
import PKIDisplay from './components/PKIDisplay';
import PKICalculator from './components/PKICalculator';
import AuthModal from './components/AuthModal';
import ExcelImport from './components/ExcelImport';
import CriticalCableTickets from './components/CriticalCableTickets';
import Documentation from './components/Documentation';
import Analytics from './components/Analytics';
import DeviceManagement from './components/DeviceManagement';
import AutoSignoutAlert from './components/AutoSignoutAlert';
import ActionPlan from './components/ActionPlan';
import YearlyTimeline from './components/YearlyTimeline';
import ThemeToggle from './components/ThemeToggle';
import type { Ticket, DailyStats } from './types';
import { calculatePKI } from './utils/pki';
import { addTicket, getTickets, updateTicket, auth, logoutUser, addMultipleTickets } from './services/firebase';

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showPKICalculator, setShowPKICalculator] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [showAllTickets, setShowAllTickets] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showDeviceManagement, setShowDeviceManagement] = useState(false);
  const [showYearlyTimeline, setShowYearlyTimeline] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(300);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setShowAuthModal(!user);
      setLoading(false);
      
      if (user) {
        loadTickets();
      } else {
        setTickets([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadTickets = async () => {
    try {
      setError(null);
      const loadedTickets = await getTickets();
      setTickets(loadedTickets);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load tickets';
      setError(errorMessage);
      console.error('Error loading tickets:', error);
    }
  };

  const handleNewTicket = async (ticketData: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'>) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    try {
      const newTicket: Omit<Ticket, 'id'> = {
        ...ticketData,
        reopened: false,
        reopenCount: 0,
      };
      await addTicket(newTicket);
      await loadTickets();
    } catch (error) {
      console.error('Error adding ticket:', error);
      alert('Failed to add ticket. Please try again.');
    }
  };

  const handleCloseTicket = async (id: string) => {
    try {
      const updateData = {
        status: 'CLOTURE' as const,
        dateCloture: new Date(),
        delaiRespect: true,
      };
      await updateTicket(id, updateData);
      await loadTickets();
    } catch (error) {
      console.error('Error closing ticket:', error);
      alert('Failed to close ticket. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  const handleImportTickets = async (tickets: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'>[]) => {
    try {
      await addMultipleTickets(tickets);
      await loadTickets();
    } catch (error) {
      console.error('Error importing tickets:', error);
      alert('Failed to import tickets. Please try again.');
    }
  };

  const pki = calculatePKI(tickets);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthModal isOpen={true} onClose={() => setShowAuthModal(false)} />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-50">
        <div className="bg-white dark:bg-dark p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Data</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={loadTickets}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-50 pb-safe-bottom transition-colors duration-300">
      <header className="bg-white dark:bg-dark shadow-lg sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl transition-colors duration-300">
                <LayoutDashboard className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight transition-colors duration-300">
                  STICKETS
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">
                  Suivi des Tickets SAV TAROUDANT
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 dark:from-blue-800 dark:via-blue-700 dark:to-blue-800 shadow-xl mb-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between space-x-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => {
                setShowAnalytics(false);
                setShowAllTickets(false);
                setShowDeviceManagement(false);
                setShowYearlyTimeline(false);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                !showAnalytics && !showAllTickets && !showDeviceManagement && !showYearlyTimeline
                  ? 'bg-white text-blue-900 shadow-lg transform scale-105 dark:bg-dark-900 dark:text-blue-400'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Zap className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setShowAnalytics(true);
                setShowAllTickets(false);
                setShowDeviceManagement(false);
                setShowYearlyTimeline(false);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                showAnalytics
                  ? 'bg-white text-blue-900 shadow-lg transform scale-105 dark:bg-dark-900 dark:text-blue-400'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <BarChart2 className="w-5 h-5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => {
                setShowAllTickets(true);
                setShowAnalytics(false);
                setShowDeviceManagement(false);
                setShowYearlyTimeline(false);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                showAllTickets
                  ? 'bg-white text-blue-900 shadow-lg transform scale-105 dark:bg-dark-900 dark:text-blue-400'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <History className="w-5 h-5" />
              <span>Historique</span>
            </button>

            <button
              onClick={() => {
                setShowDeviceManagement(true);
                setShowAnalytics(false);
                setShowAllTickets(false);
                setShowYearlyTimeline(false);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                showDeviceManagement
                  ? 'bg-white text-blue-900 shadow-lg transform scale-105 dark:bg-dark-900 dark:text-blue-400'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Router className="w-5 h-5" />
              <span>Équipements</span>
            </button>

            <button
              onClick={() => {
                setShowYearlyTimeline(true);
                setShowAnalytics(false);
                setShowAllTickets(false);
                setShowDeviceManagement(false);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                showYearlyTimeline
                  ? 'bg-white text-blue-900 shadow-lg transform scale-105 dark:bg-dark-900 dark:text-blue-400'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Timeline</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowExcelImport(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span>Import</span>
              </button>

              <button
                onClick={() => setShowPKICalculator(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
              >
                <Calculator className="w-5 h-5" />
                <span>PKI</span>
              </button>

              <button
                onClick={() => setShowDocumentation(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
              >
                <BookOpen className="w-5 h-5" />
                <span>Docs</span>
              </button>

              <button
                onClick={() => setShowInfo(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
              >
                <Info className="w-5 h-5" />
                <span>Info</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-red-500 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 mb-20 sm:mb-6 space-y-8">
        {showYearlyTimeline ? (
          <YearlyTimeline tickets={tickets} />
        ) : showAnalytics ? (
          <Analytics tickets={tickets} />
        ) : showAllTickets ? (
          <AllTickets tickets={tickets} />
        ) : showDeviceManagement ? (
          <DeviceManagement />
        ) : (
          <div className="space-y-8">
            <PKIDisplay stats={pki} />
            <MonthlyIndicators tickets={tickets} />
            <div className="space-y-8">
              <MonthlyStats tickets={tickets} />
              <CriticalCableTickets 
                tickets={tickets}
                onAddTicket={handleNewTicket}
                onUpdateTicket={updateTicket}
                onDeleteTicket={handleCloseTicket}
              />
              <ActionPlan tickets={tickets} />
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              <CauseTypeChart tickets={tickets} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="lg:col-span-2">
                  <TicketForm onSubmit={handleNewTicket} />
                </div>
                <div className="lg:col-span-2">
                  <Dashboard dailyStats={dailyStats} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <AppInfo isOpen={showInfo} onClose={() => setShowInfo(false)} />
      <PKICalculator isOpen={showPKICalculator} onClose={() => setShowPKICalculator(false)} />
      <ExcelImport 
        isOpen={showExcelImport} 
        onClose={() => setShowExcelImport(false)}
        onImport={handleImportTickets}
      />
      <Documentation 
        isOpen={showDocumentation} 
        onClose={() => setShowDocumentation(false)} 
      />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      {currentUser && <AutoSignoutAlert remainingTime={remainingTime} />}
      <ThemeToggle />
    </div>
  );
}

export default App;