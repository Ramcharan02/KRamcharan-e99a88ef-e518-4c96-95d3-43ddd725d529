export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
}

export enum Permission {
  CREATE_TASK = 'CREATE_TASK',
  READ_TASK = 'READ_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
  VIEW_AUDIT_LOG = 'VIEW_AUDIT_LOG',
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_ORGANIZATION = 'MANAGE_ORGANIZATION',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskCategory {
  WORK = 'WORK',
  PERSONAL = 'PERSONAL',
  URGENT = 'URGENT',
  OTHER = 'OTHER',
}
