import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import type { ServiceType, Ticket, Technician, CauseType } from '../types';

interface TicketFormProps {
  onSubmit: (ticket: Omit<Ticket, 'id'>) => void;
}

export default function TicketForm({ onSubmit }: TicketFormProps) {
  const [ndLogin, setNdLogin] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('FIBRE');
  const [description, setDescription] = useState('');
  const [cause, setCause] = useState('');
  const [causeType, setCauseType] = useState<CauseType>('Technique');
  const [technician, setTechnician] = useState<Technician>('BRAHIM');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ndLogin,
      serviceType,
      description,
      cause,
      causeType,
      technician,
      dateCreation: new Date(),
      status: 'EN_COURS',
      delaiRespect: true,
    });
    setNdLogin('');
    setDescription('');
    setCause('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Nouveau Ticket</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ND/LOGIN</label>
          <input
            type="text"
            value={ndLogin}
            onChange={(e) => setNdLogin(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Entrez le ND ou LOGIN"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type de Service</label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value as ServiceType)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="FIBRE">Fibre Optique</option>
              <option value="ADSL">ADSL</option>
              <option value="DEGROUPAGE">Dégroupage</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Technicien</label>
            <select
              value={technician}
              onChange={(e) => setTechnician(e.target.value as Technician)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="BRAHIM">BRAHIM</option>
              <option value="ABDERAHMAN">ABDERAHMAN</option>
              <option value="AXE">AXE</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type de Cause</label>
            <select
              value={causeType}
              onChange={(e) => setCauseType(e.target.value as CauseType)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Technique">Technique</option>
              <option value="Client">Client</option>
              <option value="Casse">Casse</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Détail de la Cause</label>
            <input
              type="text"
              value={cause}
              onChange={(e) => setCause(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Créer le ticket
        </button>
      </div>
    </form>
  );
}