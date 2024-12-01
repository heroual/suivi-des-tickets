import React, { createContext, useContext, useState } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';

interface DateContextType {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  dateRange: {
    start: Date;
    end: Date;
  };
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export function DateProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dateRange = {
    start: startOfMonth(selectedDate),
    end: endOfMonth(selectedDate)
  };

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate, dateRange }}>
      {children}
    </DateContext.Provider>
  );
}

export function useDateFilter() {
  const context = useContext(DateContext);
  if (context === undefined) {
    throw new Error('useDateFilter must be used within a DateProvider');
  }
  return context;
}