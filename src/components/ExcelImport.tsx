import React, { useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Ticket } from '../types';

interface ExcelImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (tickets: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'>[]) => void;
}

interface ImportStatus {
  type: 'success' | 'error';
  message: string;
}

export default function ExcelImport({ isOpen, onClose, onImport }: ExcelImportProps) {
  const [status, setStatus] = useState<ImportStatus | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validateTicket = (row: any): boolean => {
    return (
      row.ndLogin &&
      ['FIBRE', 'ADSL', 'DEGROUPAGE'].includes(row.serviceType) &&
      row.description &&
      row.cause &&
      ['Technique', 'Client', 'Casse'].includes(row.causeType) &&
      ['BRAHIM', 'ABDERAHMAN', 'AXE'].includes(row.technician)
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const tickets: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'>[] = [];
      const errors: string[] = [];

      jsonData.forEach((row: any, index) => {
        if (!validateTicket(row)) {
          errors.push(`Ligne ${index + 2}: Données invalides ou manquantes`);
          return;
        }

        tickets.push({
          ndLogin: row.ndLogin,
          serviceType: row.serviceType,
          description: row.description,
          cause: row.cause,
          causeType: row.causeType,
          technician: row.technician,
          dateCreation: new Date(),
          status: 'EN_COURS',
          delaiRespect: true,
        });
      });

      if (errors.length > 0) {
        setStatus({
          type: 'error',
          message: `Erreurs détectées:\n${errors.join('\n')}`,
        });
        return;
      }

      if (tickets.length === 0) {
        setStatus({
          type: 'error',
          message: 'Aucun ticket valide trouvé dans le fichier',
        });
        return;
      }

      onImport(tickets);
      setStatus({
        type: 'success',
        message: `${tickets.length} tickets importés avec succès`,
      });

      // Reset file input
      e.target.value = '';
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Erreur lors de la lecture du fichier Excel',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Importer des tickets</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Format attendu :</h3>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>ndLogin (texte)</li>
                <li>serviceType (FIBRE, ADSL, ou DEGROUPAGE)</li>
                <li>description (texte)</li>
                <li>cause (texte)</li>
                <li>causeType (Technique, Client, ou Casse)</li>
                <li>technician (BRAHIM, ABDERAHMAN, ou AXE)</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={loading}
                />
                <div className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                  {loading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-blue-600 mr-3" />
                      <span className="text-gray-600">
                        Cliquez pour sélectionner un fichier Excel
                      </span>
                    </>
                  )}
                </div>
              </label>
            </div>

            {status && (
              <div
                className={`p-4 rounded-lg ${
                  status.type === 'success'
                    ? 'bg-green-50 border-l-4 border-green-500'
                    : 'bg-red-50 border-l-4 border-red-500'
                }`}
              >
                <div className="flex items-start">
                  {status.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2" />
                  )}
                  <p
                    className={`text-sm ${
                      status.type === 'success' ? 'text-green-700' : 'text-red-700'
                    } whitespace-pre-line`}
                  >
                    {status.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}