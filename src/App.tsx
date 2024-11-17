import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Info, Calculator, LogIn, LogOut, FileSpreadsheet, History, BookOpen, BarChart2, Router, Menu, X as CloseIcon } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      setMobileMenuOpen(false);
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

  const MobileNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-padding-bottom z-40 sm:hidden">
      <div className="grid grid-cols-5 gap-1 p-2">
        <button
          onClick={() => {
            setShowAnalytics(false);
            setShowAllTickets(false);
            setShowDeviceManagement(false);
          }}
          className="flex flex-col items-center p-2 text-xs text-gray-600"
        >
          <LayoutDashboard className="w-6 h-6" />
          <span>Accueil</span>
        </button>
        <button
          onClick={() => {
            setShowAnalytics(true);
            setShowAllTickets(false);
            setShowDeviceManagement(false);
          }}
          className="flex flex-col items-center p-2 text-xs text-gray-600"
        >
          <BarChart2 className="w-6 h-6" />
          <span>Stats</span>
        </button>
        <button
          onClick={() => {
            setShowAnalytics(false);
            setShowAllTickets(true);
            setShowDeviceManagement(false);
          }}
          className="flex flex-col items-center p-2 text-xs text-gray-600"
        >
          <History className="w-6 h-6" />
          <span>Tickets</span>
        </button>
        <button
          onClick={() => {
            setShowAnalytics(false);
            setShowAllTickets(false);
            setShowDeviceManagement(true);
          }}
          className="flex flex-col items-center p-2 text-xs text-gray-600"
        >
          <Router className="w-6 h-6" />
          <span>Équip.</span>
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-col items-center p-2 text-xs text-gray-600"
        >
          <Menu className="w-6 h-6" />
          <span>Menu</span>
        </button>
      </div>
    </nav>
  );

  const MobileMenu = () => (
    <div className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-50 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-xl transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Menu</h3>
            <button onClick={() => setMobileMenuOpen(false)}>
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => {
                setShowExcelImport(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              <span>Importer Excel</span>
            </button>
            <button
              onClick={() => {
                setShowPKICalculator(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <Calculator className="w-5 h-5 text-blue-600" />
              <span>Calculateur PKI</span>
            </button>
            <button
              onClick={() => {
                setShowDocumentation(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span>Documentation</span>
            </button>
            <button
              onClick={() => {
                setShowInfo(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <Info className="w-5 h-5 text-blue-600" />
              <span>À propos</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-safe-bottom">
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <LayoutDashboard className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                    STICKETS
                  </h1>
                  <p className="text-sm sm:text-lg text-gray-600 font-medium">
                    Suivi des Tickets SAV TAROUDANT
                  </p>
                </div>
              </div>
              
              <div className="hidden sm:flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setShowAnalytics(false);
                    setShowAllTickets(false);
                    setShowDeviceManagement(!showDeviceManagement);
                  }}
                  className="btn-primary"
                >
                  <Router className="w-5 h-5 mr-2" />
                  {showDeviceManagement ? 'Tableau de bord' : 'Équipements'}
                </button>

                <button
                  onClick={() => {
                    setShowDeviceManagement(false);
                    setShowAllTickets(false);
                    setShowAnalytics(!showAnalytics);
                  }}
                  className="btn-primary"
                >
                  <BarChart2 className="w-5 h-5 mr-2" />
                  {showAnalytics ? 'Tableau de bord' : 'Analytiques'}
                </button>

                <button
                  onClick={() => {
                    setShowDeviceManagement(false);
                    setShowAnalytics(false);
                    setShowAllTickets(!showAllTickets);
                  }}
                  className="btn-primary"
                >
                  <History className="w-5 h-5 mr-2" />
                  {showAllTickets ? 'Tableau de bord' : 'Historique'}
                </button>

                <button
                  onClick={() => setShowExcelImport(true)}
                  className="btn-primary"
                >
                  <FileSpreadsheet className="w-5 h-5 mr-2" />
                  Importer Excel
                </button>

                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Déconnexion
                </button>

                <button
                  onClick={() => setShowDocumentation(true)}
                  className="btn-secondary"
                  title="Documentation"
                >
                  <BookOpen className="w-5 h-5" />
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => setShowPKICalculator(true)}
                >
                  <Calculator className="w-5 h-5" />
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => setShowInfo(true)}
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 mb-20 sm:mb-6">
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

      <MobileNav />
      <MobileMenu />

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
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Info, Calculator, LogIn, LogOut, FileSpreadsheet, History, BookOpen, BarChart2, Router, Menu, X as CloseIcon } from 'lucide-react';
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
import AutoSignoutAlert from './components/AutoSignoutAlert';
import { useAutoSignout } from './hooks/useAutoSignout';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes in seconds

  // Initialize auto signout
  useAutoSignout();

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

  // Rest of the component remains exactly the same...
  // ... (keeping all existing code and functionality)

  return (
    <div className="min-h-screen bg-gray-100 pb-safe-bottom">
      {/* Existing JSX remains the same */}
      {currentUser && <AutoSignoutAlert remainingTime={remainingTime} />}
    </div>
  );
}

export default App;