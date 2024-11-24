import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="fixed bottom-4 left-4 z-40 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        <Sun className={`w-6 h-6 text-white absolute transition-all duration-300 ${
          isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
        }`} />
        <Moon className={`w-6 h-6 text-white absolute transition-all duration-300 ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
        }`} />
      </div>
    </button>
  );
}