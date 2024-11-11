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
}

export interface DailyStats {
  date: string;
  total: number;
  resolus: number;
  horsDelai: number;
}

export interface CauseStats {
  name: CauseType;
  value: number;
}