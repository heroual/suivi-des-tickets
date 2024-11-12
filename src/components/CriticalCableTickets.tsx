import React from 'react';
import { FileSpreadsheet, AlertTriangle } from 'lucide-react';
import type { Ticket } from '../types';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

interface CriticalCableTicketsProps {
  tickets: Ticket[];
}

export default function CriticalCableTickets({ tickets }: CriticalCableTicketsProps) {
  const criticalTickets = tickets.filter(
    ticket => ticket.causeType === 'Casse' && 
    ticket.description.toLowerCase().includes('cable') &&
    ticket.cause.toLowerCase().includes('changement')
  );

  const exportToExcel = () => {
    const data = criticalTickets.map(ticket => ({
      'Numéro de ticket': ticket.id,
      'ND/Login': ticket.ndLogin,
      'Date d\'enregistrement': format(ticket.dateCreation, 'dd/MM/yyyy HH:mm'),
      'Localité': ticket.description.split(' - ')[0] || 'Non spécifiée',
      'Description': ticket.description,
      'Cause': ticket.cause,
      'Technicien': ticket.technician
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tickets Critiques');

    // Adjust column widths
    const colWidths = [
      { wch: 15 }, // Numéro de ticket
      { wch: 15 }, // ND/Login
      { wch: 20 }, // Date d'enregistrement
      { wch: 20 }, // Localité
      { wch: 40 }, // Description
      { wch: 30 }, // Cause
      { wch: 15 }  // Technicien
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, 'tickets-critiques-cables.xlsx');
  };

  if (criticalTickets.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
          <h2 className="text-xl font-semibold text-red-900">
            Tickets Critiques - Changement de Câbles
          </h2>
        </div>
        <button
          onClick={exportToExcel}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <FileSpreadsheet className="w-5 h-5 mr-2" />
          Exporter Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-red-200">
          <thead>
            <tr className="bg-red-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
                Numéro de ticket
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
                ND/Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
                Date d'enregistrement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
                Localité
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-red-200">
            {criticalTickets.map((ticket) => {
              const locality = ticket.description.split(' - ')[0] || 'Non spécifiée';
              
              return (
                <tr key={ticket.id} className="hover:bg-red-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-900">
                    {ticket.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                    {ticket.ndLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                    {format(ticket.dateCreation, 'dd/MM/yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                    {locality}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-red-700">
        <p className="font-medium">
          {criticalTickets.length} ticket{criticalTickets.length > 1 ? 's' : ''} nécessitant un changement de câble
        </p>
      </div>
    </div>
  );
}