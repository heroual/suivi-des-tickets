import * as XLSX from 'xlsx';

export function generateExcelTemplate() {
  const template = [
    {
      ndLogin: 'ND123456',
      serviceType: 'FIBRE',
      dateCreation: '24/11/2024 20:45',
      dateCloture: '24/11/2024 21:30',
      description: 'Problème de connexion',
      cause: 'Coupure fibre',
      causeType: 'Technique',
      technician: 'BRAHIM',
      delaiRespect: true,
      motifCloture: 'Réparation effectuée'
    },
    {
      ndLogin: 'ND789012',
      serviceType: 'FIXE',
      dateCreation: '24/11/2024 20:45',
      dateCloture: '24/11/2024 21:30',
      description: 'Pas de tonalité',
      cause: 'Problème ligne',
      causeType: 'Technique',
      technician: 'ABDERAHMAN',
      delaiRespect: false,
      motifCloture: 'Remplacement équipement'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(template);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');

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
    { wch: 20 }, // dateCreation
    { wch: 20 }, // dateCloture
    { wch: 40 }, // description
    { wch: 30 }, // cause
    { wch: 12 }, // causeType
    { wch: 15 }, // technician
    { wch: 12 }, // delaiRespect
    { wch: 40 }  // motifCloture
  ];

  XLSX.writeFile(wb, 'template_tickets.xlsx');
}