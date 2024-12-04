import React, { useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Ticket, ServiceType, Technician, CauseType } from '../types';
import { parse, format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';
import AccessDeniedMessage from './AccessDeniedMessage';
import React, { useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Ticket, ServiceType, Technician, CauseType } from '../types';
import { parse, format } from 'date-fns';
import { useAuth } from '../hooks/us;eAuth';
import AccessDeniedMessage from './AccessDeniedMessage';
import { addMultipleTickets } from '../services/firebase';

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
  const { isAdmin } = useAuth();
  const [status, setStatus] = useState<ImportStatus | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAdmin) {
    return <AccessDeniedMessage />;
  }

  if (!isOpen) return null;

  const parseDate = (dateStr: string) => {
    try {
      // First try parsing with time
      return parse(dateStr, 'dd/MM/yyyy HH:mm', new Date());
    } catch {
      try {
        // If that fails, try parsing just the date
        return parse(dateStr, 'dd/MM/yyyy', new Date());
      } catch (error) {
        throw new Error(`Format de date invalide: ${dateStr}. Utilisez le format JJ/MM/AAAA HH:mm ou JJ/MM/AAAA`);
      }
    }
  };

  const validateServiceType = (value: string): ServiceType => {
    const validTypes: ServiceType[] = ['FIBRE', 'ADSL', 'DEGROUPAGE', 'FIXE'];
    const normalized = value.toUpperCase();
    if (validTypes.includes(normalized as ServiceType)) {
      return normalized as ServiceType;
    }
    throw new Error(`Type de service invalide: ${value}. Valeurs acceptées: FIBRE, ADSL, DEGROUPAGE, FIXE`);
  };

  const validateTechnician = (value: string): Technician => {
    const validTechnicians: Technician[] = ['BRAHIM', 'ABDERAHMAN', 'AXE'];
    const normalized = value.toUpperCase();
    if (validTechnicians.includes(normalized as Technician)) {
      return normalized as Technician;
    }
    throw new Error(`Technicien invalide: ${value}. Valeurs acceptées: BRAHIM, ABDERAHMAN, AXE`);
  };

  const validateCauseType = (value: string): CauseType => {
    const validTypes: CauseType[] = ['Technique', 'Client', 'Casse'];
    if (validTypes.includes(value)) {
      return value as CauseType;
    }
    throw new Error(`Type de cause invalide: ${value}. Valeurs acceptées: Technique, Client, Casse`);
  };

  const validateBoolean = (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const normalized = value.toLowerCase();
      if (normalized === 'true' || normalized === 'oui' || normalized === '1') return true;
      if (normalized === 'false' || normalized === 'non' || normalized === '0') return false;
    }
    if (typeof value === 'number') return value === 1;
    throw new Error(`Valeur booléenne invalide: ${value}. Utilisez true/false, oui/non, ou 1/0`);
  };

  const validateTicket = (row: any, index: number): Omit<Ticket, 'id' | 'reopened' | 'reopenCount'> => {
    try {
      if (!row['ND/Login'] || !row['Service'] || !row['Description'] || !row['Cause'] || 
          !row['Type Cause'] || !row['Technicien'] || !row['Date Création']) {
        throw new Error('Champs obligatoires manquants');
      }

      const ticket: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'> = {
        ndLogin: String(row['ND/Login']),
        serviceType: validateServiceType(String(row['Service'])),
        description: String(row['Description']),
        cause: String(row['Cause']),
        causeType: validateCauseType(String(row['Type Cause'])),
        technician: validateTechnician(String(row['Technicien'])),
        dateCreation: parseDate(String(row['Date Création'])),
        dateCloture: row['Date Clôture'] ? parseDate(String(row['Date Clôture'])) : undefined,
        status: row['Status']?.toUpperCase() === 'CLOTURE' ? 'CLOTURE' : 'EN_COURS',
        delaiRespect: validateBoolean(row['Délai Respecté'] ?? true),
        motifCloture: row['Motif Clôture'] ? String(row['Motif Clôture']) : ''
      };

      return ticket;
    } catch (error) {
      throw new Error(`Ligne ${index + 2}: ${error instanceof Error ? error.message : 'Erreur de validation'}`);
    }
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
        try {
          const ticket = validateTicket(row, index);
          tickets.push(ticket);
        } catch (error) {
          errors.push(error instanceof Error ? error.message : `Ligne ${index + 2}: Erreur inconnue`);
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

      await onImport(tickets);
      setStatus({
        type: 'success',
        message: `${tickets.length} tickets importés avec succès`,
      });

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

  const downloadTemplate = () => {
    const now = new Date();
    const template = [
      {
        'ND/Login': 'ND123456',
        'Service': 'FIBRE',
        'Date Création': format(now, 'dd/MM/yyyy HH:mm'),
        'Date Clôture': format(now, 'dd/MM/yyyy HH:mm'),
        'Description': 'Problème de connexion',
        'Cause': 'Coupure fibre',
        'Type Cause': 'Technique',
        'Technicien': 'BRAHIM',
        'Délai Respecté': true,
        'Status': 'CLOTURE',
        'Motif Clôture': 'Réparation effectuée'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');

    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, // ND/Login
      { wch: 10 }, // Service
      { wch: 20 }, // Date Création
      { wch: 20 }, // Date Clôture
      { wch: 40 }, // Description
      { wch: 30 }, // Cause
      { wch: 15 }, // Type Cause
      { wch: 15 }, // Technicien
      { wch: 15 }, // Délai Respecté
      { wch: 10 }, // Status
      { wch: 30 }  // Motif Clôture
    ];

    XLSX.writeFile(wb, 'template_tickets.xlsx');
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
                    onClick={downloadTemplate}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Télécharger le modèle
                  </button>
                </div>
                <div className="flex-shrink-0 bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-2">Structure requise :</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• ND/Login (ex: ND123456)</li>
                    <li>• Service (FIBRE/ADSL/DEGROUPAGE/FIXE)</li>
                    <li>• Date Création (JJ/MM/AAAA HH:mm)</li>
                    <li>• Date Clôture (JJ/MM/AAAA HH:mm)</li>
                    <li>• Description (texte)</li>
                    <li>• Cause (texte)</li>
                    <li>• Type Cause (Technique/Client/Casse)</li>
                    <li>• Technicien (BRAHIM/ABDERAHMAN/AXE)</li>
                    <li>• Délai Respecté (true/false)</li>
                    <li>• Status (EN_COURS/CLOTURE)</li>
                    <li>• Motif Clôture (texte)</li>
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