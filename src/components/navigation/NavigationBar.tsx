import React, { useState } from 'react';
import { Menu, X, LayoutDashboard, BarChart2, History, Router, Calendar, FileSpreadsheet, Calculator, BookOpen, Info } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationBarProps {
  onImportClick?: () => void;
  onPKIClick?: () => void;
  onDocsClick?: () => void;
  onInfoClick?: () => void;
}

export default function NavigationBar({ 
  onImportClick,
  onPKIClick,
  onDocsClick,
  onInfoClick
}: NavigationBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Analytics', path: '/analytics', icon: BarChart2 },
    { label: 'Historique', path: '/history', icon: History },
    { label: 'Équipements', path: '/devices', icon: Router },
    { label: 'Timeline', path: '/timeline', icon: Calendar }
  ];

  const modalItems = [
    { label: 'Import', icon: FileSpreadsheet, onClick: onImportClick },
    { label: 'PKI Calculator', icon: Calculator, onClick: onPKIClick },
    { label: 'Documentation', icon: BookOpen, onClick: onDocsClick },
    { label: 'Info', icon: Info, onClick: onInfoClick }
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-xl mb-6">
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
            <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path === '/' && location.pathname === '/');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-blue-900 shadow-lg transform scale-105'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Modal Triggers */}
              {modalItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="flex items-center px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200 whitespace-nowrap"
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path === '/' && location.pathname === '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-white hover:bg-blue-700 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}

          {/* Mobile Modal Triggers */}
          {modalItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700 hover:text-white w-full"
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}