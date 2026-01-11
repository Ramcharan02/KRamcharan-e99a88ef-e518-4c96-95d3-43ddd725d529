import { Role, Permission } from '@task-management/data';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.OWNER]: [
    Permission.CREATE_TASK,
    Permission.READ_TASK,
    Permission.UPDATE_TASK,
    Permission.DELETE_TASK,
    Permission.VIEW_AUDIT_LOG,
    Permission.MANAGE_USERS,
    Permission.MANAGE_ORGANIZATION,
  ],
  [Role.ADMIN]: [
    Permission.CREATE_TASK,
    Permission.READ_TASK,
    Permission.UPDATE_TASK,
    Permission.DELETE_TASK,
    Permission.VIEW_AUDIT_LOG,
    Permission.MANAGE_USERS,
  ],
  [Role.VIEWER]: [Permission.READ_TASK],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function canAccessOrganization(
  userOrgId: number,
  targetOrgId: number,
  userRole: Role,
  organizationHierarchy: Map<number, number[]>
): boolean {
  // OWNER can access all organizations
  if (userRole === Role.OWNER) {
    return true;
  }

  // ADMIN and VIEWER can only access their own organization
  return userOrgId === targetOrgId;
}
