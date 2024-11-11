export type ServiceType = 'FIBRE' | 'ADSL' | 'DEGROUPAGE';
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