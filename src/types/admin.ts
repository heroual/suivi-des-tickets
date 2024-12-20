export interface User {
    id: string;
    email: string;
    password?: string;
    role: 'admin' | 'viewer';
    permissions?: {
      dashboard?: boolean;
      users?: boolean;
      tickets?: boolean;
      devices?: boolean;
      reports?: boolean;
      settings?: boolean;
      analytics?: boolean;
      email?: boolean;
      actionPlans?: boolean;
      feedback?: boolean;
      export?: boolean;
      import?: boolean;
      delete?: boolean;
    };
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin?: Date | null;
    status?: 'active' | 'inactive' | 'suspended';
    settings?: {
      emailNotifications: boolean;
      theme: 'light' | 'dark';
      language: string;
    };
  }
  
  export interface AdminUser extends User {
    superAdmin: boolean;
    accessLevel: 'full' | 'restricted';
    permissions: NonNullable<User['permissions']>;
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
  export interface Technician {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'technician' | 'senior_technician' | 'supervisor';
    status: 'active' | 'inactive';
    assignedTickets?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface IncidentCause {
    id: string;
    name: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    solutions: string[];
    occurrences?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }