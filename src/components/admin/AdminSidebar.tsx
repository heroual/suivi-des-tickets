import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  AlertTriangle, 
  Settings,
  Mail,
  FileText,
  BarChart2
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Users, label: 'Gestion Utilisateurs', path: '/admin/users' },
  { icon: Wrench, label: 'Gestion Techniciens', path: '/admin/technicians' },
  { icon: AlertTriangle, label: 'Causes Incidents', path: '/admin/causes' },
  { icon: Mail, label: 'Notifications', path: '/admin/notifications' },
  { icon: FileText, label: 'Rapports', path: '/admin/reports' },
  { icon: BarChart2, label: 'Statistiques', path: '/admin/stats' },
  { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-dark shadow-lg pt-20">
      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-dark-100 transition-colors ${
                isActive ? 'bg-blue-50 dark:bg-dark-100 border-l-4 border-blue-500' : ''
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className={isActive ? 'font-medium text-blue-500' : ''}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}