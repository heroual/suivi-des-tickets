import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useAutoSignout } from './hooks/useAutoSignout';
import AuthModal from './components/AuthModal';
import MainHeader from './components/MainHeader';
import DashboardLayout from './components/layouts/DashboardLayout';
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
import { logoutUser } from './services/firebase';

export default function App() {
  const { user, loading } = useAuth();
  const remainingTime = useAutoSignout();

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
    <div className="min-h-screen bg-gray-100 dark:bg-dark-50">
      <MainHeader onLogout={logoutUser} />
      <NavigationBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics tickets={[]} />} />
          <Route path="/history" element={<AllTickets tickets={[]} />} />
          <Route path="/devices" element={<DeviceManagement />} />
          <Route path="/timeline" element={<YearlyTimeline tickets={[]} />} />
          <Route path="/import" element={
            <ExcelImport 
              isOpen={true} 
              onClose={() => {}} 
              onImport={() => {}} 
            />
          } />
          <Route path="/pki" element={
            <PKICalculator 
              isOpen={true} 
              onClose={() => {}} 
            />
          } />
          <Route path="/docs" element={
            <Documentation 
              isOpen={true} 
              onClose={() => {}} 
            />
          } />
          <Route path="/info" element={
            <AppInfo 
              isOpen={true} 
              onClose={() => {}} 
            />
          } />
        </Routes>
      </div>

      {remainingTime <= 60 && <AutoSignoutAlert remainingTime={remainingTime} />}
    </div>
  );
}