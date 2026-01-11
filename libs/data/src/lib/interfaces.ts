import { Role, Permission, TaskStatus, TaskCategory } from './enums';

export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string;
  role: Role;
  organizationId: number;
  organization?: IOrganization;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrganization {
  id: number;
  name: string;
  users?: IUser[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITask {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  priority: number;
  dueDate?: Date;
  createdById: number;
  createdBy?: IUser;
  organizationId: number;
  organization?: IOrganization;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuditLog {
  id: number;
  userId: number;
  user?: IUser;
  action: string;
  resource: string;
  resourceId?: number;
  details?: string;
  ipAddress?: string;
  timestamp: Date;
}

export interface IRolePermissions {
  role: Role;
  permissions: Permission[];
}

export interface IAuthPayload {
  userId: number;
  email: string;
  role: Role;
  organizationId: number;
}
