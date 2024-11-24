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
export interface ActionPlan {
  id: string;
  Titre: string;
  description: string;
  Durée: 'short' | 'medium' | 'long';
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  assignedTo?: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActionCause {
  id: string;
  type: 'Technique' | 'Client' | 'Casse';
  description: string;
  frequency: number;
  impact: 'low' | 'medium' | 'high';
  solutions: string[];
  createdAt: Date;
  updatedAt: Date;
}
export type ServiceType = 'FIBRE' | 'ADSL' | 'DEGROUPAGE' | 'FIXE';
export type Technician = 'BRAHIM' | 'ABDERAHMAN' | 'AXE';
export type CauseType = 'Technique' | 'Client' | 'Casse';

export interface EmailConfig {
  enabled: boolean;
  recipients: string[];
  schedule: 'daily' | 'weekly' | 'monthly';
  sendTime: string; // HH:mm format
  includeMetrics: boolean;
  includeCriticalTickets: boolean;
  includeFullReport: boolean;
}

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
  imported?: boolean;
}

