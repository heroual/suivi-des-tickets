import type { Ticket, ServiceType, CauseType, Technician } from '../types';

const VALID_SERVICE_TYPES: ServiceType[] = ['FIBRE', 'ADSL', 'DEGROUPAGE', 'FIXE'];
const VALID_CAUSE_TYPES: CauseType[] = ['Technique', 'Client', 'Casse'];
const VALID_TECHNICIANS: Technician[] = ['BRAHIM', 'ABDERAHMAN', 'AXE'];

export function validateTicketData(data: any): Omit<Ticket, 'id' | 'reopened' | 'reopenCount'> {
  // Parse dates
  let dateCreation: Date;
  let dateCloture: Date | undefined;

  try {
    // Try to parse the date string or use the provided Date object
    dateCreation = data.dateCreation instanceof Date ? 
      data.dateCreation : 
      new Date(data.dateCreation);

    if (data.dateCloture) {
      dateCloture = data.dateCloture instanceof Date ?
        data.dateCloture :
        new Date(data.dateCloture);
    }

    // Validate dates are valid
    if (isNaN(dateCreation.getTime())) {
      throw new Error('Date de création invalide');
    }
    if (dateCloture && isNaN(dateCloture.getTime())) {
      throw new Error('Date de clôture invalide');
    }
  } catch (error) {
    throw new Error(`Erreur de format de date: ${error.message}`);
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