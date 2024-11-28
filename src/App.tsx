import React from 'react';
import { useAuth } from './hooks/useAuth';
import { useAutoSignout } from './hooks/useAutoSignout';
import AuthModal from './components/AuthModal';
import MainHeader from './components/MainHeader';
import DashboardLayout from './components/layouts/DashboardLayout';
import Dashboard from './components/Dashboard';
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
      
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </div>
  );
}