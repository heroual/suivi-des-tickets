import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Info, Calculator } from 'lucide-react';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import Dashboard from './components/Dashboard';
import DailySummary from './components/DailySummary';
import CauseTypeChart from './components/CauseTypeChart';
import MonthlyStats from './components/MonthlyStats';
import AppInfo from './components/AppInfo';
import PKIDisplay from './components/PKIDisplay';
import PKICalculator from './components/PKICalculator';
import type { Ticket, DailyStats } from './types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { saveTickets, loadTickets } from './utils/storage';
import { calculatePKI } from './utils/pki';

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showPKICalculator, setShowPKICalculator] = useState(false);

  useEffect(() => {
    const savedTickets = loadTickets();
    if (savedTickets.length > 0) {
      setTickets(savedTickets);
    }
  }, []);

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
    saveTickets(tickets);
  }, [tickets]);

  const handleNewTicket = (ticketData: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Math.random().toString(36).substr(2, 9),
      reopened: false,
      reopenCount: 0,
    };
    setTickets((prev) => [...prev, newTicket]);
    setIsMobileMenuOpen(false);
  };

  const handleCloseTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? {
              ...ticket,
              status: 'CLOTURE',
              dateCloture: new Date(),
              delaiRespect: new Date().getTime() - ticket.dateCreation.getTime() <= 24 * 60 * 60 * 1000,
            }
          : ticket
      )
    );
  };

  const handleReopenTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? {
              ...ticket,
              status: 'EN_COURS',
              dateCloture: undefined,
              reopened: true,
              reopenCount: ticket.reopenCount + 1,
            }
          : ticket
      )
    );
  };

  const pki = calculatePKI(tickets);

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
              <button
                className="md:hidden rounded-md p-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? 'Fermer' : 'Nouveau Ticket'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <PKIDisplay stats={pki} />
        <DailySummary tickets={tickets} />
        
        {/* Mobile Form Overlay */}
        <div className={`md:hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-40 transition-opacity ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className={`fixed inset-x-0 bottom-0 transform transition-transform ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="bg-white rounded-t-xl shadow-lg max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <TicketForm onSubmit={handleNewTicket} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <MonthlyStats tickets={tickets} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="hidden md:block">
                <TicketForm onSubmit={handleNewTicket} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Dashboard dailyStats={dailyStats} />
                <CauseTypeChart tickets={tickets} />
              </div>
            </div>
            <TicketList 
              tickets={tickets} 
              onCloseTicket={handleCloseTicket} 
              onReopenTicket={handleReopenTicket}
            />
          </div>
        </div>
      </main>

      <AppInfo isOpen={showInfo} onClose={() => setShowInfo(false)} />
      <PKICalculator isOpen={showPKICalculator} onClose={() => setShowPKICalculator(false)} />
    </div>
  );
}

export default App;