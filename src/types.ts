export type ServiceType = 'FIBRE' | 'ADSL' | 'DEGROUPAGE' | 'FIXE';
export type Technician = 'BRAHIM' | 'ABDERAHMAN' | 'AXE';
export type CauseType = 'Technique' | 'Client' | 'Casse';

export interface Ticket {
  id: string;
  ndLogin: string;
  serviceType: ServiceType;
  dateCreation: Date;
  dateCloture?: Date;
  description: string;
  cause: string;
  causeType: CauseType;
  technician: Technician;
  status: 'EN_COURS' | 'CLOTURE';
  delaiRespect: boolean;
  reopened: boolean;
  reopenCount: number;
  motifCloture?: string;
  imported?: boolean; // Track if ticket was imported
}

export interface DailyStats {
  date: string;
  total: number;
  resolus: number;
  horsDelai: number;
  reouvertures: number;
}

export interface PKIStats {
  resolutionRate: number;
  delaiRespectRate: number;
  reopenRate: number;
  globalPKI: number;
}

export interface CauseStats {
  name: string;
  value: number;
}
// ... existing types remain the same ...

export type DeviceType = 'FIBRE' | 'ADSL';

export interface Device {
  id: string;
  ndLogin: string;
  reclamationNumber: string;
  type: DeviceType;
  serialNumber: string;
  address: string;
  technician: Technician;
  dateInstalled: Date;
}