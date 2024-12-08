import React, { useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Ticket } from '../types';
import { parse, format } from 'date-fns';
import { addMultipleTickets } from '../services/firebase';
import { validateTicketData } from '../utils/ticketValidation';
import { generateExcelTemplate } from '../utils/excelTemplate';

interface ExcelImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
}

interface ImportStatus {
  type: 'success' | 'error' | 'warning';
  message: string;
}

export default function ExcelImport({ isOpen, onClose, onImport }: ExcelImportProps) {
  const [status, setStatus] = useState<ImportStatus | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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
        try {
          const validatedTicket = validateTicketData(row);
          tickets.push(validatedTicket);
        } catch (error) {
          errors.push(`Ligne ${index + 2}: ${error instanceof Error ? error.message : 'Erreur de format'}`);
        }
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

      // Import tickets to database
      const result = await addMultipleTickets(tickets);
      
      let message = `${result.success} tickets importés avec succès`;
      let type: ImportStatus['type'] = 'success';

      if (result.duplicates > 0) {
        message += `\n${result.duplicates} tickets ignorés (déjà existants)`;
        type = 'warning';
      }

      if (result.failed.length > 0) {
        message += `\n${result.failed.length} tickets non importés en raison d'erreurs`;
        type = 'warning';
      }

      setStatus({ type, message });
      
      if (result.success > 0) {
        onImport();
      }

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
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileSpreadsheet className="w-8 h-8 text-blue-600 mr-2" />
              Importer des tickets
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Template Download Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-4">Modèle d'importation</h3>
              <div className="flex items-start space-x-4">
                <div className="flex-grow">
                  <p className="text-blue-800 mb-4">
                    Téléchargez notre modèle Excel pour vous assurer que vos données sont correctement formatées.
                  </p>
                  <button
                    onClick={generateExcelTemplate}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Télécharger le modèle
                  </button>
                </div>
                <div className="flex-shrink-0 bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-2">Structure requise :</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• ndLogin (ex: ND123456)</li>
                    <li>• serviceType (FIBRE/ADSL/DEGROUPAGE/FIXE)</li>
                    <li>• dateCreation (format: JJ/MM/AAAA HH:mm)</li>
                    <li>• dateCloture (format: JJ/MM/AAAA HH:mm)</li>
                    <li>• description (texte libre)</li>
                    <li>• cause (texte libre)</li>
                    <li>• causeType (Technique/Client/Casse)</li>
                    <li>• technician (BRAHIM/ABDERAHMAN/AXE)</li>
                    <li>• delaiRespect (true/false)</li>
                    <li>• motifCloture (texte libre)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Importer votre fichier</h3>
              <div className="flex justify-center">
                <label className="relative cursor-pointer w-full">
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    disabled={loading}
                  />
                  <div className="flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                    {loading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-blue-600 mb-3" />
                        <div className="text-center">
                          <p className="text-gray-600 mb-1">
                            Cliquez pour sélectionner votre fichier Excel
                          </p>
                          <p className="text-sm text-gray-500">
                            Format accepté : .xlsx, .xls
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Status Messages */}
            {status && (
              <div className={`p-4 rounded-lg ${
                status.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' :
                status.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                'bg-red-50 border-l-4 border-red-500'
              }`}>
                <div className="flex items-start">
                  {status.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2" />
                  ) : status.type === 'warning' ? (
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 mr-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2" />
                  )}
                  <p className={`text-sm whitespace-pre-line ${
                    status.type === 'success' ? 'text-green-700' :
                    status.type === 'warning' ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
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