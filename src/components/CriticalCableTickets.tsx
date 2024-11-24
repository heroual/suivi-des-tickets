import React, { useState } from 'react';
import { AlertTriangle, PlusCircle, X, Edit2, Trash2, Upload, Loader } from 'lucide-react';
import type { Ticket, ServiceType, Technician } from '../types';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { auth } from '../services/firebase';

interface CriticalCableTicketsProps {
  tickets: Ticket[];
  onAddTicket?: (ticket: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'>) => void;
  onUpdateTicket?: (id: string, ticket: Partial<Ticket>) => void;
  onDeleteTicket?: (id: string) => void;
}

interface NewCableTicket {
  ndLogin: string;
  locality: string;
  technician: Technician;
}

export default function CriticalCableTickets({ 
  tickets, 
  onAddTicket,
  onUpdateTicket,
  onDeleteTicket 
}: CriticalCableTicketsProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [newTicket, setNewTicket] = useState<NewCableTicket>({
    ndLogin: '',
    locality: '',
    technician: 'BRAHIM'
  });

  const criticalTickets = tickets.filter(
    ticket => ticket.causeType === 'Casse' && 
    ticket.status === 'EN_COURS'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddTicket) return;

    try {
      onAddTicket({
        ndLogin: newTicket.ndLogin,
        serviceType: 'FIBRE',
        description: `${newTicket.locality} - Changement de câble nécessaire`,
        cause: 'Changement de câble',
        causeType: 'Casse',
        technician: newTicket.technician,
        dateCreation: new Date(),
        dateCloture: undefined,
        status: 'EN_COURS',
        delaiRespect: false,
        motifCloture: ''
      });
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error adding ticket:', error);
      alert('Erreur lors de l\'ajout du ticket. Veuillez réessayer.');
    }
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    const locality = ticket.description.split(' - ')[0] || '';
    setNewTicket({
      ndLogin: ticket.ndLogin,
      locality,
      technician: ticket.technician
    });
    setShowForm(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTicket || !onUpdateTicket) return;

    try {
      onUpdateTicket(editingTicket.id, {
        ndLogin: newTicket.ndLogin,
        description: `${newTicket.locality} - Changement de câble nécessaire`,
        technician: newTicket.technician
      });
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Erreur lors de la mise à jour du ticket. Veuillez réessayer.');
    }
  };

  const confirmDelete = (ticket: Ticket) => {
    setTicketToDelete(ticket);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!ticketToDelete || !onDeleteTicket) return;

    try {
      setDeletingTicketId(ticketToDelete.id);
      await onDeleteTicket(ticketToDelete.id);
      setShowDeleteConfirm(false);
      setTicketToDelete(null);
    } catch (error) {
      console.error('Error deleting ticket:', error);
      alert('Erreur lors de la suppression du ticket. Veuillez réessayer.');
    } finally {
      setDeletingTicketId(null);
    }
  };

  const resetForm = () => {
    setNewTicket({
      ndLogin: '',
      locality: '',
      technician: 'BRAHIM'
    });
    setEditingTicket(null);
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onAddTicket) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Process in batches of 10
      const batchSize = 10;
      for (let i = 0; i < jsonData.length; i += batchSize) {
        const batch = jsonData.slice(i, i + batchSize);
        await Promise.all(batch.map(async (row: any) => {
          try {
            const ticket = {
              ndLogin: row['ND/Login'] || '',
              serviceType: 'FIBRE' as ServiceType,
              description: `${row['Localité'] || ''} - Changement de câble nécessaire`,
              cause: 'Changement de câble',
              causeType: 'Casse' as const,
              technician: row['Technicien'] || 'BRAHIM',
              dateCreation: new Date(),
              status: 'EN_COURS' as const,
              delaiRespect: false,
              motifCloture: ''
            };
            await onAddTicket(ticket);
          } catch (error) {
            console.error('Error importing ticket:', error);
          }
        }));
      }

      alert('Import Duréeiné avec succès');
    } catch (error) {
      console.error('Import error:', error);
      alert('Erreur lors de l\'importation. Vérifiez le format du fichier.');
    }

    e.target.value = '';
  };

  const DeleteConfirmationModal = () => {
    if (!showDeleteConfirm || !ticketToDelete) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmer la suppression</h3>
          <p className="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer le ticket pour {ticketToDelete.ndLogin} ?
            Cette action est irréversible.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              disabled={deletingTicketId === ticketToDelete.id}
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 flex items-center"
              disabled={deletingTicketId === ticketToDelete.id}
            >
              {deletingTicketId === ticketToDelete.id ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TicketForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingTicket ? 'Modifier le Ticket' : 'Nouveau Ticket Critique'}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={editingTicket ? handleUpdate : handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700">Localité</label>
              <input
                type="text"
                required
                value={newTicket.locality}
                onChange={(e) => setNewTicket(prev => ({ ...prev, locality: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ex: Quartier, Rue..."
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

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                {editingTicket ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-red-50 p-4 rounded-lg shadow-md mb-6 border border-red-200">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h2 className="text-lg font-semibold text-red-900">
            Tickets Critiques ({criticalTickets.length})
          </h2>
        </div>
        
        {auth.currentUser && (
          <div className="flex space-x-2">
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary bg-red-600 hover:bg-red-700"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Nouveau
            </button>
            <label className="btn-primary bg-red-600 hover:bg-red-700 cursor-pointer">
              <Upload className="w-5 h-5 mr-2" />
              Importer
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={handleImportExcel}
              />
            </label>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {criticalTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-red-900">{ticket.ndLogin}</div>
                <div className="text-sm text-gray-600">{ticket.description}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {format(ticket.dateCreation, 'dd/MM/yyyy HH:mm')}
                </div>
              </div>
              {auth.currentUser && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(ticket)}
                    className="text-blue-600 hover:text-blue-800"
                    disabled={deletingTicketId === ticket.id}
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => confirmDelete(ticket)}
                    className="text-red-600 hover:text-red-800"
                    disabled={deletingTicketId === ticket.id}
                  >
                    {deletingTicketId === ticket.id ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {criticalTickets.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            Aucun ticket critique en attente
          </div>
        )}
      </div>

      {showForm && <TicketForm />}
      <DeleteConfirmationModal />
    </div>
  );
}