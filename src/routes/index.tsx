import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layouts
import MainLayout from '../components/MainLayout';
import AdminLayout from '../components/admin/AdminLayout';

// Pages
import Dashboard from '../pages/Dashboard';
import TicketsPage from '../pages/TicketsPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import DevicesPage from '../pages/DevicesPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import Settings from '../pages/admin/Settings';

export default function AppRoutes() {
  const { isAdmin, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      {/* Main Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="devices" element={<DevicesPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          isAdmin ? (
            <AdminLayout>
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="settings" element={<Settings />} />
              </Routes>
            </AdminLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}