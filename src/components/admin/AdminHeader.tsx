import React from 'react';
import { Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AdminHeader() {
  const { user, logoutUser } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-0 bg-white dark:bg-dark shadow-sm z-50 h-16">
      <div className="flex items-center justify-between h-full px-8 ml-64">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Administration STICKETS
        </h1>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-dark-100">
            <Bell className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-dark-100">
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200 dark:border-dark-100">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.email}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Administrateur</p>
            </div>
            
            <button
              onClick={logoutUser}
              className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}