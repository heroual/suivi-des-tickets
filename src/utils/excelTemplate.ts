import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export function generateExcelTemplate() {
  const now = new Date();
  const template = [
    {
      ndLogin: 'ND123456',
      serviceType: 'FIBRE',
      dateCreation: format(now, 'dd/MM/yyyy HH:mm'),
      dateCloture: format(now, 'dd/MM/yyyy HH:mm'),
      description: 'Problème de connexion',
      cause: 'Coupure fibre',
      causeType: 'Technique',
      technician: 'BRAHIM',
      delaiRespect: true,
      motifCloture: 'Réparation effectuée'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(template);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');

  // Add column headers with format instructions
  XLSX.utils.sheet_add_aoa(ws, [[
    'ND/Login',
    'Type de Service',
    'Date de Création (DD/MM/YYYY HH:mm)',
    'Date de Clôture (DD/MM/YYYY HH:mm)',
    'Description',
    'Cause',
    'Type de Cause',
    'Technicien',
    'Délai Respecté',
    'Motif de Clôture'
  ]], { origin: 'A1' });

  // Add data validations
  ws['!datavalidation'] = {
    B2: {
      type: 'list',
      operator: 'equal',
      formula1: '"FIBRE,ADSL,DEGROUPAGE,FIXE"',
      showErrorMessage: true,
      error: 'Valeur invalide',
      errorTitle: 'Erreur'
    },
    G2: {
      type: 'list',
      operator: 'equal',
      formula1: '"Technique,Client,Casse"',
      showErrorMessage: true,
      error: 'Valeur invalide',
      errorTitle: 'Erreur'
    },
    H2: {
      type: 'list',
      operator: 'equal',
      formula1: '"BRAHIM,ABDERAHMAN,AXE"',
      showErrorMessage: true,
      error: 'Valeur invalide',
      errorTitle: 'Erreur'
    },
    I2: {
      type: 'list',
      operator: 'equal',
      formula1: '"true,false"',
      showErrorMessage: true,
      error: 'Valeur invalide',
      errorTitle: 'Erreur'
    }
  };

  // Set column widths
  ws['!cols'] = [
    { wch: 15 }, // ndLogin
    { wch: 12 }, // serviceType
    { wch: 25 }, // dateCreation (wider for format)
    { wch: 25 }, // dateCloture (wider for format)
    { wch: 40 }, // description
    { wch: 30 }, // cause
    { wch: 12 }, // causeType
    { wch: 15 }, // technician
    { wch: 12 }, // delaiRespect
    { wch: 40 }  // motifCloture
  ];

  // Add comments to date columns
  ws['C1'].c = [{ a: 'Auteur', t: 'Format requis: DD/MM/YYYY HH:mm\nExemple: 04/12/2024 10:49' }];
  ws['D1'].c = [{ a: 'Auteur', t: 'Format requis: DD/MM/YYYY HH:mm\nExemple: 04/12/2024 10:49' }];

  XLSX.writeFile(wb, 'template_tickets.xlsx');
}