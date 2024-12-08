import { parse } from 'date-fns';
import type { Ticket, ServiceType, CauseType, Technician } from '../types';

const VALID_SERVICE_TYPES: ServiceType[] = ['FIBRE', 'ADSL', 'DEGROUPAGE', 'FIXE'];
const VALID_CAUSE_TYPES: CauseType[] = ['Technique', 'Client', 'Casse'];
const VALID_TECHNICIANS: Technician[] = ['BRAHIM', 'ABDERAHMAN', 'AXE'];

export function validateTicketData(data: any): Omit<Ticket, 'id' | 'reopened' | 'reopenCount'> {
  // Parse dates with specific format DD/MM/YYYY HH:mm
  let dateCreation: Date;
  let dateCloture: Date | undefined;

  try {
    dateCreation = parse(data.dateCreation, 'dd/MM/yyyy HH:mm', new Date());
    if (isNaN(dateCreation.getTime())) {
      throw new Error('Date de création invalide');
    }
  } catch (error) {
    throw new Error('Format de date de création invalide. Utilisez le format: DD/MM/YYYY HH:mm (exemple: 04/12/2024 10:49)');
  }

  if (data.dateCloture) {
    try {
      dateCloture = parse(data.dateCloture, 'dd/MM/yyyy HH:mm', new Date());
      if (isNaN(dateCloture.getTime())) {
        throw new Error('Date de clôture invalide');
      }
    } catch (error) {
      throw new Error('Format de date de clôture invalide. Utilisez le format: DD/MM/YYYY HH:mm (exemple: 04/12/2024 10:49)');
    }
  }

  // Validate service type
  if (!VALID_SERVICE_TYPES.includes(data.serviceType)) {
    throw new Error(`Type de service invalide: ${data.serviceType}`);
  }

  // Validate cause type
  if (!VALID_CAUSE_TYPES.includes(data.causeType)) {
    throw new Error(`Type de cause invalide: ${data.causeType}`);
  }

  // Validate technician
  if (!VALID_TECHNICIANS.includes(data.technician)) {
    throw new Error(`Technicien invalide: ${data.technician}`);
  }

  return {
    ndLogin: String(data.ndLogin || ''),
    serviceType: data.serviceType,
    dateCreation,
    dateCloture,
    description: String(data.description || ''),
    cause: String(data.cause || ''),
    causeType: data.causeType,
    technician: data.technician,
    status: 'CLOTURE',
    delaiRespect: Boolean(data.delaiRespect),
    motifCloture: String(data.motifCloture || '')
  };
}