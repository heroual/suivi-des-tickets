export interface User {
    id: string;
    email: string;
    password?: string;
    role: 'admin' | 'viewer';
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface AdminSettings {
    emailNotifications: boolean;
    slaBreach: boolean;
    ticketClosure: boolean;
    dailyReports: boolean;
    emailTemplate: string;
  }
  
  export interface Permission {
    id: string;
    name: string;
    description: string;
    roles: string[];
  }