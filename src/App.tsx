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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showPKICalculator, setShowPKICalculator] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
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
      if (!user) {
        setIsMobileMenuOpen(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const loadedTickets = await getTickets();
      setTickets(loadedTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
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
      setIsMobileMenuOpen(false);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <LayoutDashboard className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight">
                Suivi des Tickets SAV TAROUDANT
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <span className="text-sm text-gray-600">{currentUser.email}</span>
                  <button
                    onClick={() => {
                      setShowAnalytics(false);
                      setShowAllTickets(false);
                      setShowDeviceManagement(!showDeviceManagement);
                    }}
                    className="flex items-center space-x-2 rounded-md px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
                  >
                    <Router className="w-5 h-5" />
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
                    className="flex items-center space-x-2 rounded-md px-3 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100"
                  >
                    <BarChart2 className="w-5 h-5" />
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
                    className="flex items-center space-x-2 rounded-md px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100"
                  >
                    <History className="w-5 h-5" />
                    <span className="hidden sm:inline">
                      {showAllTickets ? 'Tableau de bord' : 'Historique'}
                    </span>
                  </button>
                  <button
                    onClick={() => setShowExcelImport(true)}
                    className="flex items-center space-x-2 rounded-md px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100"
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                    <span className="hidden sm:inline">Importer Excel</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 rounded-md px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 rounded-md px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Connexion</span>
                </button>
              )}
              <button
                onClick={() => setShowDocumentation(true)}
                className="rounded-md p-2 bg-purple-50 text-purple-600 hover:bg-purple-100"
                title="Documentation"
              >
                <BookOpen className="w-5 h-5" />
              </button>
              <button
                className="rounded-md p-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
                onClick={() => setShowPKICalculator(true)}
              >
                <Calculator className="w-5 h-5" />
              </button>
              <button
                className="rounded-md p-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
                onClick={() => setShowInfo(true)}
              >
                <Info className="w-5 h-5" />
              </button>
              {currentUser && (
                <button
                  className="md:hidden rounded-md p-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? 'Fermer' : 'Nouveau Ticket'}
                </button>
              )}
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
                  {currentUser && (
                    <div className="hidden md:block">
                      <TicketForm onSubmit={handleNewTicket} />
                    </div>
                  )}
                  {!currentUser && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Connectez-vous pour créer un ticket
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Vous devez être connecté pour pouvoir créer de nouveaux tickets.
                        </p>
                        <button
                          onClick={() => setShowAuthModal(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <LogIn className="w-5 h-5 mr-2" />
                          Se connecter
                        </button>
                      </div>
                    </div>
                  )}
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
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <ExcelImport 
        isOpen={showExcelImport} 
        onClose={() => setShowExcelImport(false)}
        onImport={handleImportTickets}
      />
      <Documentation 
        isOpen={showDocumentation} 
        onClose={() => setShowDocumentation(false)} 
      />
    </div>
  );
}

export default App;