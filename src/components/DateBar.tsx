import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DateBar() {
  return (
    <div className="bg-white dark:bg-dark rounded-lg shadow-sm p-4 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center">
        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
        <span className="text-lg font-medium text-gray-900 dark:text-white">
          {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
        </span>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Semaine {format(new Date(), 'w', { locale: fr })}
      </div>
    </div>
  );
}