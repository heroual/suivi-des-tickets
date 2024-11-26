import React from 'react';
import { BarChart2, History, Router, Calendar, Zap, FileSpreadsheet, Calculator, BookOpen, Info, LogOut } from 'lucide-react';

interface NavigationTabsProps {
  showAnalytics: boolean;
  showAllTickets: boolean;
  showDeviceManagement: boolean;
  showYearlyTimeline: boolean;
  setShowAnalytics: (show: boolean) => void;
  setShowAllTickets: (show: boolean) => void;
  setShowDeviceManagement: (show: boolean) => void;
  setShowYearlyTimeline: (show: boolean) => void;
  setShowExcelImport: (show: boolean) => void;
  setShowPKICalculator: (show: boolean) => void;
  setShowDocumentation: (show: boolean) => void;
  setShowInfo: (show: boolean) => void;
}

export default function NavigationTabs({
  showAnalytics,
  showAllTickets,
  showDeviceManagement,
  showYearlyTimeline,
  setShowAnalytics,
  setShowAllTickets,
  setShowDeviceManagement,
  setShowYearlyTimeline,
  setShowExcelImport,
  setShowPKICalculator,
  setShowDocumentation,
  setShowInfo
}: NavigationTabsProps) {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 dark:from-blue-800 dark:via-blue-700 dark:to-blue-800 shadow-xl mb-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between space-x-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => {
              setShowAnalytics(false);
              setShowAllTickets(false);
              setShowDeviceManagement(false);
              setShowYearlyTimeline(false);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              !showAnalytics && !showAllTickets && !showDeviceManagement && !showYearlyTimeline
                ? 'bg-white text-blue-900 shadow-lg transform scale-105 dark:bg-dark-900 dark:text-blue-400'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              setShowAnalytics(true);
              setShowAllTickets(false);
              setShowDeviceManagement(false);
              setShowYearlyTimeline(false);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              showAnalytics
                ? 'bg-white text-blue-900 shadow-lg transform scale-105 dark:bg-dark-900 dark:text-blue-400'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <BarChart2 className="w-5 h-5" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => {
              setShowAllTickets(true);
              setShowAnalytics(false);
              setShowDeviceManagement(false);
              setShowYearlyTimeline(false);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              showAllTickets
                ? 'bg-white text-blue-900 shadow-lg transform scale-105 dark:bg-dark-900 dark:text-blue-400'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <History className="w-5 h-5" />
            <span>Historique</span>
          </button>

          <button
            onClick={() => {
              setShowDeviceManagement(true);
              setShowAnalytics(false);
              setShowAllTickets(false);
              setShowYearlyTimeline(false);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              showDeviceManagement
                ? 'bg-white text-blue-900 shadow-lg transform scale-105 dark:bg-dark-900 dark:text-blue-400'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Router className="w-5 h-5" />
            <span>Équipements</span>
          </button>

          <button
            onClick={() => {
              setShowYearlyTimeline(true);
              setShowAnalytics(false);
              setShowAllTickets(false);
              setShowDeviceManagement(false);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              showYearlyTimeline
                ? 'bg-white text-blue-900 shadow-lg transform scale-105 dark:bg-dark-900 dark:text-blue-400'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>Timeline</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowExcelImport(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span>Import</span>
            </button>

            <button
              onClick={() => setShowPKICalculator(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
            >
              <Calculator className="w-5 h-5" />
              <span>PKI</span>
            </button>

            <button
              onClick={() => setShowDocumentation(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
            >
              <BookOpen className="w-5 h-5" />
              <span>Docs</span>
            </button>

            <button
              onClick={() => setShowInfo(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
            >
              <Info className="w-5 h-5" />
              <span>Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}