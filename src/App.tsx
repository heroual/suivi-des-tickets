import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useAutoSignout } from './hooks/useAutoSignout';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import AllTickets from './components/AllTickets';
import DeviceManagement from './components/DeviceManagement';
import YearlyTimeline from './components/YearlyTimeline';
import AutoSignoutAlert from './components/AutoSignoutAlert';
import { DateProvider } from './contexts/DateContext';

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
    <DateProvider>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/history" element={<AllTickets tickets={[]} />} />
          <Route path="/devices" element={<DeviceManagement />} />
          <Route path="/timeline" element={<YearlyTimeline tickets={[]} />} />
        </Routes>

        {remainingTime <= 60 && <AutoSignoutAlert remainingTime={remainingTime} />}
      </div>
    </DateProvider>
  );
}