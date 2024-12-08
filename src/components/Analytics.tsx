import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useMemo } from 'react';
import { Users, Calendar, Download, TrendingUp, AlertTriangle } from 'lucide-react';
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
          pki: 0,
          performance: { success: 0, warning: 0, critical: 0 }
        });
      }

      const techStats = stats.get(ticket.technician);
      techStats.total++;
      
      if (ticket.status === 'CLOTURE') {
        techStats.resolved++;
        if (ticket.delaiRespect) {
          techStats.onTime++;
          techStats.performance.success++;
        } else {
          techStats.performance.warning++;
        }
        if (ticket.reopened) {
          techStats.reopened++;
          techStats.performance.critical++;
        }
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
      .sort((a, b) => b.pki - a.pki);
  }, [monthlyTickets]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-lg p-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {format(currentMonth, 'MMMM yyyy', { locale: fr })}
              </p>
            </div>
          </div>
          <button className="btn-primary flex items-center space-x-2 text-sm">
            <Download className="w-4 h-4" />
            <span>Exporter les données</span>
          </button>
        </div>
      </div>

      <PKIDisplay stats={calculatePKI(monthlyTickets)} />
      
      {/* Technician Analytics Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-lg p-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Performance des Techniciens</h2>
                <p className="text-sm text-gray-500 mt-1">Vue détaillée des performances individuelles</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600">Excellent</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs text-gray-600">Moyen</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-600">À améliorer</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Technicien
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span>Performance</span>
                    </div>
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Résolus
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dans les Délais
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Réouverts
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PKI
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {technicianStats.map((tech, index) => (
                  <tr key={tech.name} 
                      className={`
                        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        hover:bg-gray-100 transition-colors duration-150 ease-in-out
                      `}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className={`
                            h-full w-full rounded-full flex items-center justify-center text-white text-sm font-medium
                            ${tech.pki >= 90 ? 'bg-green-500' : tech.pki >= 70 ? 'bg-amber-500' : 'bg-red-500'}
                          `}>
                            {tech.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{tech.name}</div>
                          <div className="text-xs text-gray-500 sm:hidden">
                            Total: {tech.total} | Résolus: {tech.resolved}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500"
                            style={{
                              width: `${(tech.onTime / tech.total) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {tech.total}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {tech.resolved}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {tech.onTime}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-center">
                      <div className="flex items-center justify-center">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          {tech.reopened}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                        ${tech.pki >= 90 ? 'bg-green-100 text-green-800' :
                          tech.pki >= 70 ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'}`}>
                        {tech.pki.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-100 rounded-lg p-3">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Analyse des Causes</h2>
              <p className="text-sm text-gray-500 mt-1">Distribution des types de problèmes</p>
            </div>
          </div>
          <CauseTypeChart tickets={monthlyTickets} />
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-100 rounded-lg p-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Évolution des Tickets</h2>
              <p className="text-sm text-gray-500 mt-1">Tendance sur la période</p>
            </div>
          </div>
          <TicketTrends tickets={monthlyTickets} />
        </div>
      </div>
    </div>
  );
}