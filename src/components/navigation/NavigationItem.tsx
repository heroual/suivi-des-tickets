import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

interface NavigationItemProps {
  label: string;
  path: string;
  icon: keyof typeof Icons;
  isActive: boolean;
  isMobile?: boolean;
}

export default function NavigationItem({ label, path, icon, isActive, isMobile = false }: NavigationItemProps) {
  const Icon = Icons[icon];

  if (isMobile) {
    return (
      <Link
        to={path}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-blue-700 text-white'
            : 'text-white hover:bg-blue-700 hover:text-white'
        }`}
      >
        <Icon className="w-5 h-5 mr-3" />
        {label}
      </Link>
    );
  }

  return (
    <Link
      to={path}
      className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-white text-blue-900 shadow-lg transform scale-105 dark:bg-dark-900 dark:text-blue-400'
          : 'text-white hover:bg-white/10'
      }`}
    >
      <Icon className="w-5 h-5 mr-2" />
      <span>{label}</span>
    </Link>
  );
}