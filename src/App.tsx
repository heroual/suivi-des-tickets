import ActionPlanButton from './components/ActionPlanButton';
import ActionPlanModal from './components/ActionPlanModal';
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
  const [showActionPlan, setShowActionPlan] = useState(false);

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

  const calculateDailyStats = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayTickets = tickets.filter(
      (ticket) => format(ticket.dateCreation, 'yyyy-MM-dd') === today
    );

    const stats: DailyStats = {
      date: format(new Date(), 'd MMM', { locale: fr }),
      total: todayTickets.length,
      resolus: todayTickets.filter((t) => t.status === 'CLOTURE').length,
      horsDelai: todayTickets.filter((t) => !t.delaiRespect).length,
      reouvertures: todayTickets.filter((t) => t.reopened).length,
    };

    setDailyStats((prev) => {
      const existing = prev.find((s) => s.date === stats.date);
      if (existing) {
        return prev.map((s) => (s.date === stats.date ? stats : s));
      }
      return [...prev, stats].slice(-7);
    });
  };

  useEffect(() => {
    calculateDailyStats();
  }, [tickets]);

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

  const handleImportTickets = async (importedTickets: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'>[]) => {
    try {
      await addMultipleTickets(importedTickets);
      await loadTickets();
      setShowExcelImport(false);
    } catch (error) {
      console.error('Error importing tickets:', error);
      alert('Failed to import tickets. Please try again.');
    }
  };

  const handleCloseTicket = async (id: string) => {
    try {
      const updateData = {
        status: 'CLOTURE' as const,
        dateCloture: new Date(),
        delaiRespect: new Date().getTime() - tickets.find(t => t.id === id)!.dateCreation.getTime() <= 24 * 60 * 60 * 1000,
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

  const pki = calculatePKI(tickets);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthModal isOpen={true} onClose={() => setShowAuthModal(false)} />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
          <p className="text-gray-700 mb-4">{error}</p>
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
    <div className="min-h-screen bg-gray-100 pb-safe-bottom">
      {/* Fixed Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <LayoutDashboard className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  STICKETS
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-medium">
                  Suivi des Tickets SAV TAROUDANT
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Futuristic Navigation Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-xl mb-6">
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
                  ? 'bg-white text-blue-900 shadow-lg transform scale-105'
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
                  ? 'bg-white text-blue-900 shadow-lg transform scale-105'
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
                  ? 'bg-white text-blue-900 shadow-lg transform scale-105'
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
                  ? 'bg-white text-blue-900 shadow-lg transform scale-105'
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
                  ? 'bg-white text-blue-900 shadow-lg transform scale-105'
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

      {/* Date Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-blue-600 mr-3" />
            <span className="text-lg font-medium text-gray-900">
              {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Semaine {format(new Date(), 'w', { locale: fr })}
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
              <CriticalCableTickets 
                tickets={tickets}
                onAddTicket={handleNewTicket}
                onUpdateTicket={updateTicket}
                onDeleteTicket={handleCloseTicket}
              />
              <ActionPlan tickets={tickets} />
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              <MonthlyStats tickets={tickets} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TicketForm onSubmit={handleNewTicket} />
                <Dashboard dailyStats={dailyStats} />
                <CauseTypeChart tickets={tickets} />
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
      <ActionPlanButton onClick={() => setShowActionPlan(true)} />
      <ActionPlanModal 
        isOpen={showActionPlan}
        onClose={() => setShowActionPlan(false)}
        tickets={tickets}
      />
    </div>
  );
}

export default App;