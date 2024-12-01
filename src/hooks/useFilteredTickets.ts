import { useMemo } from 'react';
import { isWithinInterval } from 'date-fns';
import { useDateFilter } from '../contexts/DateContext';
import type { Ticket } from '../types';

export function useFilteredTickets(tickets: Ticket[]) {
  const { dateRange } = useDateFilter();

  return useMemo(() => {
    return tickets.filter(ticket => 
      isWithinInterval(ticket.dateCreation, {
        start: dateRange.start,
        end: dateRange.end
      })
    );
  }, [tickets, dateRange]);
}