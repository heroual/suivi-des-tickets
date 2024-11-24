import React, { useState, useMemo } from 'react';
import { Filter, FileSpreadsheet, Download, Search, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import type { Ticket, CauseType } from '../types';

interface AllTicketsProps {
  tickets: Ticket[];
}

export default function AllTickets({ tickets }: AllTicketsProps) {
  const [selectedCauseType, setSelectedCauseType] = useState<CauseType | 'ALL'>('ALL');
  const [searchDurée, setSearchDurée] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTickets = useMemo(() => {
    let filtered = [...tickets];

    // Apply cause type filter
    if (selectedCauseType !== 'ALL') {
      filtered = filtered.filter(ticket => ticket.causeType === selectedCauseType);
    }

    // Apply search filter
    if (searchDurée) {
      const search = searchDurée.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.ndLogin.toLowerCase().includes(search) ||
        ticket.description.toLowerCase().includes(search) ||
        ticket.cause.toLowerCase().includes(search) ||
        ticket.motifCloture?.toLowerCase().includes(search)
      );
    }

    // Sort by date, most recent first
    return filtered.sort((a, b) => b.dateCreation.getTime() - a.dateCreation.getTime());
  }, [tickets, selectedCauseType, searchDurée]);

  const stats = useMemo(() => ({
    total: filteredTickets.length,
    technique: filteredTickets.filter(t => t.causeType === 'Technique').length,
    casse: filteredTickets.filter(t => t.causeType === 'Casse').length,
    client: filteredTickets.filter(t => t.causeType === 'Client').length
  }), [filteredTickets]);

  const exportToExcel = () => {
    const data = filteredTickets.map(ticket => ({
      'Date': format(ticket.dateCreation, 'dd/MM/yyyy HH:mm', { locale: fr }),
      'ND/Login': ticket.ndLogin,
      'Service': ticket.serviceType,
      'Description': ticket.description,
      'Type de Cause': ticket.causeType,
      'Cause': ticket.cause,
      'Technicien': ticket.technician,
      'Status': ticket.status,
      'Dans les délais': ticket.delaiRespect ? 'Oui' : 'Non',
      'Réouvert': ticket.reopened ? 'Oui' : 'Non',
      'Motif de clôture': ticket.motifCloture || ''
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tickets');

    ws['!cols'] = [
      { wch: 20 }, // Date
      { wch: 15 }, // ND/Login
      { wch: 10 }, // Service
      { wch: 40 }, // Description
      { wch: 15 }, // Type de Cause
      { wch: 30 }, // Cause
      { wch: 15 }, // Technicien
      { wch: 10 }, // Status
      { wch: 15 }, // Dans les délais
      { wch: 10 }, // Réouvert
      { wch: 30 }  // Motif de clôture
    ];

    XLSX.writeFile(wb, `historique-tickets-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Historique des Tickets</h1>
            <p className="mt-1 text-sm text-gray-600">
              {stats.total} ticket{stats.total > 1 ? 's' : ''} trouvé{stats.total > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary w-full sm:w-auto"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filtres
            </button>
            <button
              onClick={exportToExcel}
              className="btn-primary w-full sm:w-auto"
            >
              <Download className="w-5 h-5 mr-2" />
              Exporter Excel
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-900">Total</div>
            <div className="mt-1 text-2xl font-semibold text-blue-700">{stats.total}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm font-medium text-green-900">Technique</div>
            <div className="mt-1 text-2xl font-semibold text-green-700">{stats.technique}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-sm font-medium text-red-900">Casse</div>
            <div className="mt-1 text-2xl font-semibold text-red-700">{stats.casse}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-sm font-medium text-yellow-900">Client</div>
            <div className="mt-1 text-2xl font-semibold text-yellow-700">{stats.client}</div>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filtres</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de Cause
                </label>
                <select
                  value={selectedCauseType}
                  onChange={(e) => setSelectedCauseType(e.target.value as CauseType | 'ALL')}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="ALL">Tous les types</option>
                  <option value="Technique">Technique</option>
                  <option value="Casse">Casse</option>
                  <option value="Client">Client</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un ticket..."
              value={searchDurée}
              onChange={(e) => setSearchDurée(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            {searchDurée && (
              <button
                onClick={() => setSearchDurée('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ND/Login
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cause
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technicien
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(ticket.dateCreation, 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ticket.ndLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {ticket.serviceType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {ticket.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ticket.causeType === 'Technique' ? 'bg-green-100 text-green-800' :
                      ticket.causeType === 'Casse' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ticket.causeType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.technician}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ticket.status === 'CLOTURE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun ticket trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}