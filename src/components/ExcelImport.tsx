import React, { useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Ticket } from '../types';
import { validateTicketData } from '../utils/ticketValidation';
import { generateExcelTemplate } from '../utils/excelTemplate';
import type { ImportError } from '../services/firebase/tickets';

interface ExcelImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
}

interface ImportStatus {
  type: 'success' | 'error' | 'warning';
  message: string;
  errors?: ImportError[];
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
      
      // Convert Excel dates to proper format
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        dateNF: 'dd/MM/yyyy HH:mm'
      });

      // Validate each row
      const validationErrors: ImportError[] = [];
      jsonData.forEach((row: any, index) => {
        try {
          validateTicketData(row);
        } catch (error) {
          validationErrors.push({
            row: index + 2, // +2 for Excel row number (header + 1-based index)
            ndLogin: row.ndLogin,
            field: 'validation',
            message: error instanceof Error ? error.message : 'Erreur de validation',
            value: JSON.stringify(row)
          });
        }
      });

      if (validationErrors.length > 0) {
        setStatus({
          type: 'error',
          message: 'Des erreurs de validation ont été détectées. Vérifiez le format des dates (DD/MM/YYYY HH:mm)',
          errors: validationErrors
        });
        return;
      }

      // Process import
      onImport();
      setStatus({
        type: 'success',
        message: `${jsonData.length} tickets importés avec succès`
      });

    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Erreur lors de la lecture du fichier Excel. Vérifiez le format des dates (DD/MM/YYYY HH:mm)',
        errors: [{
          row: 0,
          field: 'file',
          message: error instanceof Error ? error.message : 'Erreur inconnue'
        }]
      });
    } finally {
      setLoading(false);
      e.target.value = '';
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
              <h3 className="text-lg font-medium text-blue-900 mb-4">Format des Dates Important</h3>
              <div className="flex items-start space-x-4">
                <div className="flex-grow">
                  <p className="text-blue-800 mb-4">
                    Les dates doivent être au format <strong>DD/MM/YYYY HH:mm</strong>
                    <br />
                    Exemple: <code className="bg-blue-100 px-2 py-1 rounded">04/12/2024 10:49</code>
                  </p>
                  <button
                    onClick={generateExcelTemplate}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Télécharger le modèle
                  </button>
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
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm ${
                      status.type === 'success' ? 'text-green-700' :
                      status.type === 'warning' ? 'text-yellow-700' :
                      'text-red-700'
                    }`}>
                      {status.message}
                    </p>
                    
                    {status.errors && status.errors.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Détails des erreurs :</h4>
                        <div className="max-h-60 overflow-y-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr>
                                <th className="text-left">Ligne</th>
                                <th className="text-left">ND/Login</th>
                                <th className="text-left">Message</th>
                              </tr>
                            </thead>
                            <tbody>
                              {status.errors.map((error, index) => (
                                <tr key={index} className="border-t border-gray-200">
                                  <td className="py-2">{error.row}</td>
                                  <td className="py-2">{error.ndLogin || '-'}</td>
                                  <td className="py-2">{error.message}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}