import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useAutoSignout } from './hooks/useAutoSignout';
import AuthModal from './components/AuthModal';
import MainHeader from './components/MainHeader';
import NavigationBar from './components/navigation/NavigationBar';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import AllTickets from './components/AllTickets';
import DeviceManagement from './components/DeviceManagement';
import YearlyTimeline from './components/YearlyTimeline';
import AutoSignoutAlert from './components/AutoSignoutAlert';
import { DateProvider } from './contexts/DateContext';
import DashboardLayout from './components/layouts/DashboardLayout';
import { useTickets } from './hooks/useTickets';
import Documentation from './components/Documentation';
import PKICalculator from './components/PKICalculator';
import ExcelImport from './components/ExcelImport';
import AppInfo from './components/AppInfo';
import { logoutUser } from './services/firebase';

export default function App() {
  const { user, loading } = useAuth();
  const remainingTime = useAutoSignout();
  const { tickets } = useTickets();
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [showPKICalculator, setShowPKICalculator] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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
      <div className="min-h-screen bg-gray-100">
        <MainHeader onLogout={logoutUser} />
        <NavigationBar 
          onImportClick={() => setShowExcelImport(true)}
          onPKIClick={() => setShowPKICalculator(true)}
          onDocsClick={() => setShowDocumentation(true)}
          onInfoClick={() => setShowInfo(true)}
        />
        
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics tickets={tickets} />} />
            <Route path="/history" element={<AllTickets tickets={tickets} />} />
            <Route path="/devices" element={<DeviceManagement />} />
            <Route path="/timeline" element={<YearlyTimeline tickets={tickets} />} />
          </Routes>

          {remainingTime <= 60 && <AutoSignoutAlert remainingTime={remainingTime} />}

          {/* Modals */}
          {showExcelImport && (
            <ExcelImport 
              isOpen={showExcelImport} 
              onClose={() => setShowExcelImport(false)} 
              onImport={async (tickets) => {
                try {
                  // Handle import logic
                  setShowExcelImport(false);
                } catch (error) {
                  console.error('Error importing tickets:', error);
                }
              }}
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
        </DashboardLayout>
      </div>
    </DateProvider>
  );
}