import { parse } from 'date-fns';
import type { Ticket, ServiceType, CauseType, Technician } from '../types';

const VALID_SERVICE_TYPES: ServiceType[] = ['FIBRE', 'ADSL', 'DEGROUPAGE', 'FIXE'];
const VALID_CAUSE_TYPES: CauseType[] = ['Technique', 'Client', 'Casse'];
const VALID_TECHNICIANS: Technician[] = ['BRAHIM', 'ABDERAHMAN', 'AXE'];

export function validateTicketData(data: any): Omit<Ticket, 'id' | 'reopened' | 'reopenCount'> {
  // Parse dates
  let dateCreation: Date;
  let dateCloture: Date | undefined;

  try {
    if (data.dateCreation instanceof Date) {
      dateCreation = data.dateCreation;
    } else if (typeof data.dateCreation === 'string') {
      // Try to parse the date string in the expected format (dd/MM/yyyy HH:mm)
      dateCreation = parse(data.dateCreation, 'dd/MM/yyyy HH:mm', new Date());
      
      if (isNaN(dateCreation.getTime())) {
        throw new Error('Format attendu: JJ/MM/AAAA HH:mm (exemple: 25/03/2024 14:30)');
      }
    } else {
      throw new Error('Date de création manquante ou format invalide');
    }

    if (data.dateCloture) {
      if (data.dateCloture instanceof Date) {
        dateCloture = data.dateCloture;
      } else if (typeof data.dateCloture === 'string') {
        dateCloture = parse(data.dateCloture, 'dd/MM/yyyy HH:mm', new Date());
        
        if (isNaN(dateCloture.getTime())) {
          throw new Error('Format de date de clôture attendu: JJ/MM/AAAA HH:mm (exemple: 25/03/2024 14:30)');
        }
      }
    }
  } catch (error) {
    throw new Error(`Erreur de format de date: ${error.message}`);
  }

  // Validate service type
  if (!VALID_SERVICE_TYPES.includes(data.serviceType)) {
    throw new Error(`Type de service invalide: ${data.serviceType}. Valeurs acceptées: ${VALID_SERVICE_TYPES.join(', ')}`);
  }

  // Validate cause type
  if (!VALID_CAUSE_TYPES.includes(data.causeType)) {
    throw new Error(`Type de cause invalide: ${data.causeType}. Valeurs acceptées: ${VALID_CAUSE_TYPES.join(', ')}`);
  }

  // Validate technician
  if (!VALID_TECHNICIANS.includes(data.technician)) {
    throw new Error(`Technicien invalide: ${data.technician}. Valeurs acceptées: ${VALID_TECHNICIANS.join(', ')}`);
  }

  // Validate required fields
  if (!data.ndLogin) {
    throw new Error('ND/Login est obligatoire');
  }

  if (!data.description) {
    throw new Error('Description est obligatoire');
  }

  if (!data.cause) {
    throw new Error('Cause est obligatoire');
  }

  return {
    ndLogin: String(data.ndLogin).trim(),
    serviceType: data.serviceType,
    dateCreation,
    dateCloture,
    description: String(data.description).trim(),
    cause: String(data.cause).trim(),
    causeType: data.causeType,
    technician: data.technician,
    status: 'CLOTURE',
    delaiRespect: Boolean(data.delaiRespect),
    motifCloture: String(data.motifCloture || '').trim()
  };
}