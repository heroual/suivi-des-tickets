import React from 'react';
import Footer from '../Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-dark-50">
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}