import { hasPermission, getRolePermissions, ROLE_PERMISSIONS } from './rbac.config';
import { Role, Permission } from '@task-management/data';

describe('RBAC Configuration', () => {
  describe('hasPermission', () => {
    it('should return true when Owner has CREATE_TASK permission', () => {
      expect(hasPermission(Role.OWNER, Permission.CREATE_TASK)).toBe(true);
    });

    it('should return true when Admin has CREATE_TASK permission', () => {
      expect(hasPermission(Role.ADMIN, Permission.CREATE_TASK)).toBe(true);
    });

    it('should return false when Viewer has CREATE_TASK permission', () => {
      expect(hasPermission(Role.VIEWER, Permission.CREATE_TASK)).toBe(false);
    });

    it('should return true when Viewer has READ_TASK permission', () => {
      expect(hasPermission(Role.VIEWER, Permission.READ_TASK)).toBe(true);
    });

    it('should return true when Owner has VIEW_AUDIT_LOG permission', () => {
      expect(hasPermission(Role.OWNER, Permission.VIEW_AUDIT_LOG)).toBe(true);
    });

    it('should return false when Viewer has VIEW_AUDIT_LOG permission', () => {
      expect(hasPermission(Role.VIEWER, Permission.VIEW_AUDIT_LOG)).toBe(false);
    });
  });

  describe('getRolePermissions', () => {
    it('should return all permissions for Owner role', () => {
      const permissions = getRolePermissions(Role.OWNER);
      expect(permissions).toHaveLength(7);
      expect(permissions).toContain(Permission.MANAGE_ORGANIZATION);
    });

    it('should return correct permissions for Admin role', () => {
      const permissions = getRolePermissions(Role.ADMIN);
      expect(permissions).toHaveLength(6);
      expect(permissions).not.toContain(Permission.MANAGE_ORGANIZATION);
    });

    it('should return only READ_TASK permission for Viewer role', () => {
      const permissions = getRolePermissions(Role.VIEWER);
      expect(permissions).toHaveLength(1);
      expect(permissions).toContain(Permission.READ_TASK);
    });
  });

  describe('ROLE_PERMISSIONS mapping', () => {
    it('should have permissions defined for all roles', () => {
      expect(ROLE_PERMISSIONS[Role.OWNER]).toBeDefined();
      expect(ROLE_PERMISSIONS[Role.ADMIN]).toBeDefined();
      expect(ROLE_PERMISSIONS[Role.VIEWER]).toBeDefined();
    });
  });
});
