import React, { useState, useMemo } from 'react';
import { Filter, FileSpreadsheet, Download } from 'lucide-react';
import TicketList from './TicketList';
import type { Ticket, CauseType } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as XLSX from 'xlsx';

interface AllTicketsProps {
  tickets: Ticket[];
}

export default function AllTickets({ tickets }: AllTicketsProps) {
  const [selectedCauseType, setSelectedCauseType] = useState<CauseType | 'ALL'>('ALL');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTickets = useMemo(() => {
    if (selectedCauseType === 'ALL') return tickets;
    return tickets.filter(ticket => ticket.causeType === selectedCauseType);
  }, [tickets, selectedCauseType]);

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

    // Set column widths
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
      </div>

      {/* Tickets List */}
      <TicketList 
        tickets={filteredTickets} 
        showOnlyNew={false}
      />
    </div>
  );
}