import React, { useState } from 'react';
import Footer from '../Footer';
import FeedbackSection from '../FeedbackSection';
import FeedbackButton from '../FeedbackButton';
import FeedbackModal from '../FeedbackModal';
import NavigationBar from '../navigation/NavigationBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-dark-50">
      <NavigationBar />
      
      <main className="flex-grow">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {children}
        </div>
      </main>

      <FeedbackSection />
      
      <FeedbackButton onClick={() => setShowFeedbackModal(true)} />
      
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={() => {
          setShowFeedbackModal(false);
        }}
      />

      <Footer />
    </div>
  );
}