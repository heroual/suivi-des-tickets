import React, { useState } from 'react';
import { FileSpreadsheet, AlertTriangle, PlusCircle, X, Edit2, Trash2, Upload } from 'lucide-react';
import type { Ticket, ServiceType, Technician } from '../types';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

interface CriticalCableTicketsProps {
  tickets: Ticket[];
  onAddTicket?: (ticket: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'>) => void;
  onUpdateTicket?: (id: string, ticket: Omit<Ticket, 'id'>) => void;
  onDeleteTicket?: (id: string) => void;
}

interface NewCableTicket {
  ndLogin: string;
  serviceType: ServiceType;
  description: string;
  locality: string;
  technician: Technician;
}

export default function CriticalCableTickets({ 
  tickets, 
  onAddTicket,
  onUpdateTicket,
  onDeleteTicket 
}: CriticalCableTicketsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [newTicket, setNewTicket] = useState<NewCableTicket>({
    ndLogin: '',
    serviceType: 'FIBRE',
    description: '',
    locality: '',
    technician: 'BRAHIM'
  });

  const criticalTickets = tickets.filter(
    ticket => ticket.causeType === 'Casse' && 
    ticket.description.toLowerCase().includes('cable') &&
    ticket.cause.toLowerCase().includes('changement')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddTicket) {
      const fullDescription = `${newTicket.locality} - ${newTicket.description}`;
      onAddTicket({
        ndLogin: newTicket.ndLogin,
        serviceType: newTicket.serviceType,
        description: fullDescription,
        cause: 'Changement de câble nécessaire',
        causeType: 'Casse',
        technician: newTicket.technician,
        dateCreation: new Date(),
        dateCloture: new Date(),
        status: 'CLOTURE',
        delaiRespect: false,
        motifCloture: 'En attente de changement de câble'
      });
      setShowAddForm(false);
      resetForm();
    }
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    const [locality = '', ...descParts] = ticket.description.split(' - ');
    setNewTicket({
      ndLogin: ticket.ndLogin,
      serviceType: ticket.serviceType,
      description: descParts.join(' - '),
      locality,
      technician: ticket.technician
    });
    setShowEditForm(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTicket && onUpdateTicket) {
      const fullDescription = `${newTicket.locality} - ${newTicket.description}`;
      onUpdateTicket(editingTicket.id, {
        ...editingTicket,
        ndLogin: newTicket.ndLogin,
        serviceType: newTicket.serviceType,
        description: fullDescription,
        technician: newTicket.technician
      });
      setShowEditForm(false);
      resetForm();
    }
  };

  const handleDelete = (id: string) => {
    if (onDeleteTicket && confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      onDeleteTicket(id);
    }
  };

  const resetForm = () => {
    setNewTicket({
      ndLogin: '',
      serviceType: 'FIBRE',
      description: '',
      locality: '',
      technician: 'BRAHIM'
    });
    setEditingTicket(null);
  };

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

    const colWidths = [
      { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 20 }, 
      { wch: 40 }, { wch: 30 }, { wch: 15 }
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, 'tickets-critiques-cables.xlsx');
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onAddTicket) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        jsonData.forEach((row: any) => {
          const ticket = {
            ndLogin: row['ND/Login'],
            serviceType: row['Type de Service'] || 'FIBRE',
            description: `${row['Localité']} - ${row['Description']}`,
            cause: 'Changement de câble nécessaire',
            causeType: 'Casse' as const,
            technician: row['Technicien'] || 'BRAHIM',
            dateCreation: new Date(),
            dateCloture: new Date(),
            status: 'CLOTURE' as const,
            delaiRespect: false,
            motifCloture: 'En attente de changement de câble'
          };
          onAddTicket(ticket);
        });

        alert(`${jsonData.length} tickets importés avec succès`);
      } catch (error) {
        alert('Erreur lors de l\'importation du fichier Excel');
        console.error('Import error:', error);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const TicketForm = ({ isEdit = false, onSubmit }: { isEdit?: boolean, onSubmit: (e: React.FormEvent) => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {isEdit ? 'Modifier le Ticket' : 'Nouveau Ticket de Changement de Câble'}
            </h3>
            <button
              onClick={() => isEdit ? setShowEditForm(false) : setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ND/Login</label>
                <input
                  type="text"
                  required
                  value={newTicket.ndLogin}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, ndLogin: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type de Service</label>
                <select
                  value={newTicket.serviceType}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, serviceType: e.target.value as ServiceType }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="FIBRE">Fibre</option>
                  <option value="ADSL">ADSL</option>
                  <option value="DEGROUPAGE">Dégroupage</option>
                  <option value="FIXE">Fixe</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Localité</label>
              <input
                type="text"
                required
                value={newTicket.locality}
                onChange={(e) => setNewTicket(prev => ({ ...prev, locality: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ex: Quartier, Rue, Point de repère..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description du problème</label>
              <textarea
                required
                value={newTicket.description}
                onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Détails sur le problème de câble..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Technicien</label>
              <select
                value={newTicket.technician}
                onChange={(e) => setNewTicket(prev => ({ ...prev, technician: e.target.value as Technician }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="BRAHIM">BRAHIM</option>
                <option value="ABDERAHMAN">ABDERAHMAN</option>
                <option value="AXE">AXE</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => isEdit ? setShowEditForm(false) : setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {isEdit ? 'Mettre à jour' : 'Ajouter'} le ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-red-50 p-6 rounded-lg shadow-md mb-6 border-2 border-red-500">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mr-2 animate-pulse" />
          <div>
            <h2 className="text-2xl font-bold text-red-900">
              ⚠️ TICKETS CRITIQUES - Changement de Câbles
            </h2>
            <p className="text-red-700 text-sm mt-1">
              Intervention urgente requise - Priorité maximale
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {onAddTicket && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Nouveau Ticket
            </button>
          )}
          <label className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer">
            <Upload className="w-5 h-5 mr-2" />
            Importer Excel
            <input
              type="file"
              className="hidden"
              accept=".xlsx,.xls"
              onChange={handleImportExcel}
            />
          </label>
          <button
            onClick={exportToExcel}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FileSpreadsheet className="w-5 h-5 mr-2" />
            Exporter Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border-2 border-red-300 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-red-200">
              <thead className="bg-red-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-red-900 uppercase tracking-wider">
                    Numéro de ticket
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-red-900 uppercase tracking-wider">
                    ND/Login
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-red-900 uppercase tracking-wider">
                    Date d'enregistrement
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-red-900 uppercase tracking-wider">
                    Localité
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-red-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-red-200">
                {criticalTickets.map((ticket) => {
                  const locality = ticket.description.split(' - ')[0] || 'Non spécifiée';
                  
                  return (
                    <tr key={ticket.id} className="hover:bg-red-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-900">
                        {ticket.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-900">
                        {ticket.ndLogin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                        {format(ticket.dateCreation, 'dd/MM/yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                        {locality}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(ticket)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Modifier"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(ticket.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {criticalTickets.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-red-500">
                      Aucun ticket critique en attente de changement de câble
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm font-bold text-red-700 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-1" />
          {criticalTickets.length} ticket{criticalTickets.length > 1 ? 's' : ''} nécessitant un changement de câble
        </p>
        {criticalTickets.length > 0 && (
          <p className="text-sm text-red-600 animate-pulse">
            ⚠️ Action urgente requise
          </p>
        )}
      </div>

      {showAddForm && (
        <TicketForm onSubmit={handleSubmit} />
      )}

      {showEditForm && editingTicket && (
        <TicketForm isEdit onSubmit={handleUpdate} />
      )}
    </div>
  );
}