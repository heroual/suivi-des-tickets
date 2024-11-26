import React from 'react';
import { LayoutDashboard, LogOut } from 'lucide-react';

interface MainHeaderProps {
  onLogout: () => void;
}

export default function MainHeader({ onLogout }: MainHeaderProps) {
  return (
    <header className="bg-white dark:bg-dark shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl transition-colors duration-300">
              <LayoutDashboard className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight transition-colors duration-300">
                STICKETS
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">
                Suivi des Tickets SAV TAROUDANT
              </p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}