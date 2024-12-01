import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subMonths, addMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useDateFilter } from '../contexts/DateContext';

export default function DateBar() {
  const { selectedDate, setSelectedDate } = useDateFilter();

  const handlePreviousMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [year, month] = event.target.value.split('-').map(Number);
    setSelectedDate(new Date(year, month));
  };

  // Générer les options pour les 12 derniers mois
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      value: `${date.getFullYear()}-${date.getMonth()}`,
      label: format(date, 'MMMM yyyy', { locale: fr })
    };
  });

  return (
    <div className="bg-white dark:bg-dark rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <select
            value={`${selectedDate.getFullYear()}-${selectedDate.getMonth()}`}
            onChange={handleMonthChange}
            className="text-lg font-medium text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {monthOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousMonth}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}