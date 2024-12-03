import React from 'react';
import Footer from '../Footer';
import FeedbackSection from '../FeedbackSection';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-dark-50">
      <main className="flex-grow">
        {children}
      </main>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FeedbackSection />
      </div>

      <Footer />
    </div>
  );
}