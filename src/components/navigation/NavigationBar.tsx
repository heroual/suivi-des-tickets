import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import NavigationItem from './NavigationItem';
import { useAuth } from '../../hooks/useAuth';

export default function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navigationItems = [
    { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
    { label: 'Analytics', path: '/analytics', icon: 'BarChart2' },
    { label: 'Tickets', path: '/tickets', icon: 'Ticket' },
    { label: 'Équipements', path: '/devices', icon: 'Router' },
    { label: 'Timeline', path: '/timeline', icon: 'Calendar' },
    ...(isAdmin ? [{ label: 'Administration', path: '/admin', icon: 'Settings' }] : [])
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 dark:from-blue-800 dark:via-blue-700 dark:to-blue-800 shadow-xl mb-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:justify-between sm:w-full">
            <div className="flex items-center space-x-4">
              {navigationItems.map((item) => (
                <NavigationItem
                  key={item.path}
                  {...item}
                  isActive={location.pathname === item.path}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.path}
              {...item}
              isActive={location.pathname === item.path}
              isMobile
            />
          ))}
        </div>
      </div>
    </nav>
  );
}