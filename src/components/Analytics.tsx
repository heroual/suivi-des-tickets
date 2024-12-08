import React, { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Ticket } from '../types';
import { calculatePKI } from '../utils/pki';
import PKIDisplay from './PKIDisplay';
import CauseTypeChart from './CauseTypeChart';
import TicketTrends from './TicketTrends';
import { Users } from 'lucide-react';

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

  const technicianStats = useMemo(() => {
    const stats = new Map();

    monthlyTickets.forEach(ticket => {
      if (!ticket.technician) return;

      if (!stats.has(ticket.technician)) {
        stats.set(ticket.technician, {
          total: 0,
          resolved: 0,
          onTime: 0,
          reopened: 0,
          pki: 0
        });
      }

      const techStats = stats.get(ticket.technician);
      techStats.total++;
      
      if (ticket.status === 'CLOTURE') {
        techStats.resolved++;
        if (ticket.delaiRespect) techStats.onTime++;
        if (ticket.reopened) techStats.reopened++;
      }

      // Calculate PKI for technician
      if (techStats.resolved > 0) {
        techStats.pki = (techStats.onTime / techStats.resolved) * 100;
      }
    });

    return Array.from(stats.entries())
      .map(([name, stats]) => ({
        name,
        ...stats
      }))
      .sort((a, b) => b.pki - a.pki); // Sort by PKI descending
  }, [monthlyTickets]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Analytics - {format(currentMonth, 'MMMM yyyy', { locale: fr })}
      </h1>

      <PKIDisplay stats={calculatePKI(monthlyTickets)} />
      
      {/* Technician Analytics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Performance des Techniciens</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technicien
                </th>
                <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Tickets
                </th>
                <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Résolus
                </th>
                <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dans les Délais
                </th>
                <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Réouverts
                </th>
                <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PKI
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {technicianStats.map((tech, index) => (
                <tr key={tech.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tech.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {tech.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {tech.resolved}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {tech.onTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {tech.reopened}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={`font-semibold ${
                      tech.pki >= 90 ? 'text-green-600' :
                      tech.pki >= 70 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {tech.pki.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CauseTypeChart tickets={monthlyTickets} />
      <TicketTrends tickets={monthlyTickets} />
    </div>
  );
}