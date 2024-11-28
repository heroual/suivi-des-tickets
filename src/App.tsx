import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useAutoSignout } from './hooks/useAutoSignout';
import { getTickets } from './services/firebase';
import AuthModal from './components/AuthModal';
import MainHeader from './components/MainHeader';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import AllTickets from './components/AllTickets';
import DeviceManagement from './components/DeviceManagement';
import YearlyTimeline from './components/YearlyTimeline';
import ExcelImport from './components/ExcelImport';
import PKICalculator from './components/PKICalculator';
import Documentation from './components/Documentation';
import AppInfo from './components/AppInfo';
import NavigationBar from './components/navigation/NavigationBar';
import AutoSignoutAlert from './components/AutoSignoutAlert';
import DashboardLayout from './components/layouts/DashboardLayout';
import { logoutUser } from './services/firebase';
import type { Ticket } from './types';

export default function App() {
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
    <DashboardLayout>
      <MainHeader onLogout={logoutUser} />
      <NavigationBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<Dashboard tickets={tickets} onTicketsUpdate={loadTickets} />} />
          <Route path="/analytics" element={<Analytics tickets={tickets} />} />
          <Route path="/history" element={<AllTickets tickets={tickets} />} />
          <Route path="/devices" element={<DeviceManagement />} />
          <Route path="/timeline" element={<YearlyTimeline tickets={tickets} />} />
        </Routes>
      </div>

      {showExcelImport && (
        <ExcelImport 
          isOpen={showExcelImport} 
          onClose={() => setShowExcelImport(false)} 
          onImport={loadTickets}
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
  );
}