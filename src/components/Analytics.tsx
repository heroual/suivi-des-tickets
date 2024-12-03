import React, { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Ticket } from '../types';
import { calculatePKI } from '../utils/pki';
import PKIDisplay from './PKIDisplay';
import CauseTypeChart from './CauseTypeChart';
import TicketTrends from './TicketTrends';

interface AnalyticsProps {
  tickets: Ticket[];
}

export default function Analytics({ tickets = [] }: AnalyticsProps) {
  const currentMonth = new Date();
  const monthInterval = {
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  };

  const monthlyTickets = useMemo(() => 
    tickets.filter(ticket =>
      isWithinInterval(ticket.dateCreation, {
        start: monthInterval.start,
        end: monthInterval.end
      })
    ),
    [tickets, monthInterval.start, monthInterval.end]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Analytics - {format(currentMonth, 'MMMM yyyy', { locale: fr })}
      </h1>

      <PKIDisplay stats={calculatePKI(monthlyTickets)} />
      <CauseTypeChart tickets={monthlyTickets} />
      <TicketTrends tickets={monthlyTickets} />
    </div>
  );
}