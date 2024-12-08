import { parse } from 'date-fns';
import type { Ticket, ServiceType, CauseType, Technician } from '../types';

const VALID_SERVICE_TYPES: ServiceType[] = ['FIBRE', 'ADSL', 'DEGROUPAGE', 'FIXE'];
const VALID_CAUSE_TYPES: CauseType[] = ['Technique', 'Client', 'Casse'];
const VALID_TECHNICIANS: Technician[] = ['BRAHIM', 'ABDERAHMAN', 'AXE'];

export function validateTicketData(data: any): Omit<Ticket, 'id' | 'reopened' | 'reopenCount'> {
  // Parse dates
  const dateCreation = parseDate(data.dateCreation);
  const dateCloture = data.dateCloture ? parseDate(data.dateCloture) : undefined;

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

function parseDate(dateStr: string): Date {
  try {
    const date = parse(dateStr, 'dd/MM/yyyy HH:mm', new Date());
    if (isNaN(date.getTime())) {
      throw new Error('Date invalide');
    }
    return date;
  } catch (error) {
    throw new Error(`Format de date invalide: ${dateStr}. Utilisez le format JJ/MM/AAAA HH:mm`);
  }
}