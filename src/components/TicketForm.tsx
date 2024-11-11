import React, { useState } from 'react';
import { PlusCircle, Clock } from 'lucide-react';
import type { ServiceType, Ticket, Technician, CauseType } from '../types';
import { format } from 'date-fns';

interface TicketFormProps {
  onSubmit: (ticket: Omit<Ticket, 'id'>) => void;
  initialData?: Ticket;
  isEdit?: boolean;
}

export default function TicketForm({ onSubmit, initialData, isEdit = false }: TicketFormProps) {
  const [ndLogin, setNdLogin] = useState(initialData?.ndLogin || '');
  const [serviceType, setServiceType] = useState<ServiceType>(initialData?.serviceType || 'FIBRE');
  const [description, setDescription] = useState(initialData?.description || '');
  const [cause, setCause] = useState(initialData?.cause || '');
  const [causeType, setCauseType] = useState<CauseType>(initialData?.causeType || 'Technique');
  const [technician, setTechnician] = useState<Technician>(initialData?.technician || 'BRAHIM');
  const [status, setStatus] = useState(initialData?.status || 'CLOTURE');
  const [delaiRespect, setDelaiRespect] = useState(initialData?.delaiRespect ?? true);
  const [motifCloture, setMotifCloture] = useState(initialData?.motifCloture || '');
  const [dateCreation, setDateCreation] = useState<string>(
    initialData ? format(initialData.dateCreation, "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );
  const [dateCloture, setDateCloture] = useState<string>(
    initialData?.dateCloture ? format(initialData.dateCloture, "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ndLogin,
      serviceType,
      description,
      cause,
      causeType,
      technician,
      dateCreation: new Date(dateCreation),
      dateCloture: new Date(dateCloture),
      status: 'CLOTURE',
      delaiRespect,
      motifCloture,
      reopened: initialData?.reopened || false,
      reopenCount: initialData?.reopenCount || 0,
    });

    if (!isEdit) {
      setNdLogin('');
      setDescription('');
      setCause('');
      setMotifCloture('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        {isEdit ? (
          <>
            <Clock className="w-6 h-6 text-blue-600 mr-2" />
            Modifier le Ticket
          </>
        ) : (
          <>
            <PlusCircle className="w-6 h-6 text-blue-600 mr-2" />
            Nouveau Ticket Traité
          </>
        )}
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <option value="FIXE">Fixe</option>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de Création</label>
            <input
              type="datetime-local"
              value={dateCreation}
              onChange={(e) => setDateCreation(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de Clôture</label>
            <input
              type="datetime-local"
              value={dateCloture}
              onChange={(e) => setDateCloture(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Respect du Délai</label>
            <select
              value={delaiRespect ? 'true' : 'false'}
              onChange={(e) => setDelaiRespect(e.target.value === 'true')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="true">Dans les délais</option>
              <option value="false">Hors délais</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Motif de Clôture</label>
          <textarea
            value={motifCloture}
            onChange={(e) => setMotifCloture(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={2}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isEdit ? (
            <>
              <Clock className="w-5 h-5 mr-2" />
              Mettre à jour le ticket
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5 mr-2" />
              Ajouter le ticket traité
            </>
          )}
        </button>
      </div>
    </form>
  );
}