import React from 'react';
import { LayoutDashboard, LogOut, Settings, Bell, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

interface MainHeaderProps {
  onLogout: () => void;
}

export default function MainHeader({ onLogout }: MainHeaderProps) {
  const { isAdmin, user } = useAuth();

  return (
    <>
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
            
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  <span className="font-medium">Administration</span>
                </Link>
              )}
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {isAdmin && (
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="h-4 w-px bg-white/30" />
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                Administrateur
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}