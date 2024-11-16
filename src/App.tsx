import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Info, Calculator, LogIn, LogOut, FileSpreadsheet, History, BookOpen, BarChart2, Router } from 'lucide-react';
import { User } from 'firebase/auth';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import AllTickets from './components/AllTickets';
import Dashboard from './components/Dashboard';
import DailySummary from './components/DailySummary';
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
import type { Ticket, DailyStats } from './types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { calculatePKI } from './utils/pki';
import { addTicket, getTickets, updateTicket, auth, logoutUser, addMultipleTickets } from './services/firebase';

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showPKICalculator, setShowPKICalculator] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [showAllTickets, setShowAllTickets] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showDeviceManagement, setShowDeviceManagement] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setShowAuthModal(!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadTickets();
    }
  }, [currentUser]);

  const loadTickets = async () => {
    try {
      const loadedTickets = await getTickets();
      setTickets(loadedTickets);
    } catch (error) {
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
      const id = await addTicket(newTicket);
      setTickets((prev) => [...prev, { ...newTicket, id }]);
    } catch (error) {
      console.error('Error adding ticket:', error);
    }
  };

  const handleImportTickets = async (importedTickets: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'>[]) => {
    try {
      const newTickets = await addMultipleTickets(importedTickets);
      setTickets((prev) => [...prev, ...newTickets]);
      setShowExcelImport(false);
    } catch (error) {
      console.error('Error importing tickets:', error);
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
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === id
            ? { ...ticket, ...updateData }
            : ticket
        )
      );
    } catch (error) {
      console.error('Error closing ticket:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error logging out:', error);
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

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <LayoutDashboard className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    STICKETS
                  </h1>
                  <p className="text-lg text-gray-600 font-medium">
                    Suivi des Tickets SAV TAROUDANT
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setShowAnalytics(false);
                    setShowAllTickets(false);
                    setShowDeviceManagement(!showDeviceManagement);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <Router className="w-6 h-6" />
                  <span className="hidden sm:inline">
                    {showDeviceManagement ? 'Tableau de bord' : 'Équipements'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setShowDeviceManagement(false);
                    setShowAllTickets(false);
                    setShowAnalytics(!showAnalytics);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                >
                  <BarChart2 className="w-6 h-6" />
                  <span className="hidden sm:inline">
                    {showAnalytics ? 'Tableau de bord' : 'Analytiques'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setShowDeviceManagement(false);
                    setShowAnalytics(false);
                    setShowAllTickets(!showAllTickets);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <History className="w-6 h-6" />
                  <span className="hidden sm:inline">
                    {showAllTickets ? 'Tableau de bord' : 'Historique'}
                  </span>
                </button>

                <button
                  onClick={() => setShowExcelImport(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                >
                  <FileSpreadsheet className="w-6 h-6" />
                  <span className="hidden sm:inline">Importer Excel</span>
                </button>

                {currentUser ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-6 h-6" />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <LogIn className="w-6 h-6" />
                    <span className="hidden sm:inline">Connexion</span>
                  </button>
                )}

                <button
                  onClick={() => setShowDocumentation(true)}
                  className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                  title="Documentation"
                >
                  <BookOpen className="w-6 h-6" />
                </button>

                <button
                  className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  onClick={() => setShowPKICalculator(true)}
                >
                  <Calculator className="w-6 h-6" />
                </button>

                <button
                  className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  onClick={() => setShowInfo(true)}
                >
                  <Info className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {showAnalytics ? (
          <Analytics tickets={tickets} />
        ) : showAllTickets ? (
          <AllTickets tickets={tickets} />
        ) : showDeviceManagement ? (
          <DeviceManagement />
        ) : (
          <>
            <PKIDisplay stats={pki} />
            <MonthlyIndicators tickets={tickets} />
            <DailySummary tickets={tickets} />
            <CriticalCableTickets 
              tickets={tickets}
              onAddTicket={handleNewTicket}
              onUpdateTicket={updateTicket}
              onDeleteTicket={handleCloseTicket}
            />
            
            <div className="grid grid-cols-1 gap-6">
              <MonthlyStats tickets={tickets} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <TicketForm onSubmit={handleNewTicket} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Dashboard dailyStats={dailyStats} />
                    <CauseTypeChart tickets={tickets} />
                  </div>
                </div>
                <TicketList 
                  tickets={tickets}
                  showOnlyNew={true}
                />
              </div>
            </div>
          </>
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
    </div>
  );
}

export default App;