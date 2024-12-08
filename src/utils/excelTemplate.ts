import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export function generateExcelTemplate() {
  // Create sample data with proper date formatting
  const now = new Date();
  const laterTime = new Date(now.getTime() + 45 * 60000); // 45 minutes later

  const template = [
    {
      ndLogin: 'ND123456',
      serviceType: 'FIBRE',
      dateCreation: format(now, 'dd/MM/yyyy HH:mm'),
      dateCloture: format(laterTime, 'dd/MM/yyyy HH:mm'),
      description: 'Problème de connexion',
      cause: 'Coupure fibre',
      causeType: 'Technique',
      technician: 'BRAHIM',
      delaiRespect: true,
      motifCloture: 'Réparation effectuée'
    },
    {
      ndLogin: 'ND789012',
      serviceType: 'ADSL',
      dateCreation: format(now, 'dd/MM/yyyy HH:mm'),
      dateCloture: format(laterTime, 'dd/MM/yyyy HH:mm'),
      description: 'Pas de tonalité',
      cause: 'Problème ligne',
      causeType: 'Technique',
      technician: 'ABDERAHMAN',
      delaiRespect: false,
      motifCloture: 'Remplacement équipement'
    }
  ];

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(template);

  // Add header row with column descriptions
  const headers = [
    ['Modèle d\'importation des tickets - Instructions'],
    [''],
    ['Format des dates: JJ/MM/AAAA HH:mm (exemple: 25/03/2024 14:30)'],
    ['Types de service: FIBRE, ADSL, DEGROUPAGE, FIXE'],
    ['Types de cause: Technique, Client, Casse'],
    ['Techniciens: BRAHIM, ABDERAHMAN, AXE'],
    ['Respect des délais: true (dans les délais) ou false (hors délais)'],
    [''],
    ['Colonnes obligatoires:']
  ];

  // Insert headers at the beginning
  XLSX.utils.sheet_add_aoa(ws, headers, { origin: 'A1' });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');

  // Add data validations
  ws['!datavalidation'] = {
    B12: { // Adjusted for header rows
      type: 'list',
      operator: 'equal',
      formula1: '"FIBRE,ADSL,DEGROUPAGE,FIXE"',
      showErrorMessage: true,
      error: 'Valeur invalide. Utilisez: FIBRE, ADSL, DEGROUPAGE, ou FIXE',
      errorTitle: 'Type de service invalide'
    },
    G12: {
      type: 'list',
      operator: 'equal',
      formula1: '"Technique,Client,Casse"',
      showErrorMessage: true,
      error: 'Valeur invalide. Utilisez: Technique, Client, ou Casse',
      errorTitle: 'Type de cause invalide'
    },
    H12: {
      type: 'list',
      operator: 'equal',
      formula1: '"BRAHIM,ABDERAHMAN,AXE"',
      showErrorMessage: true,
      error: 'Valeur invalide. Utilisez: BRAHIM, ABDERAHMAN, ou AXE',
      errorTitle: 'Technicien invalide'
    },
    I12: {
      type: 'list',
      operator: 'equal',
      formula1: '"true,false"',
      showErrorMessage: true,
      error: 'Valeur invalide. Utilisez: true ou false',
      errorTitle: 'Valeur booléenne invalide'
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

  // Add cell styles for headers
  const headerStyle = {
    font: { bold: true },
    fill: { fgColor: { rgb: "EDF2F7" } }
  };

  // Apply styles to header cells
  for (let i = 0; i < headers.length; i++) {
    const row = headers[i];
    for (let j = 0; j < row.length; j++) {
      const cellRef = XLSX.utils.encode_cell({ r: i, c: j });
      if (!ws[cellRef]) ws[cellRef] = {};
      ws[cellRef].s = headerStyle;
    }
  }

  XLSX.writeFile(wb, `template_tickets_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
}