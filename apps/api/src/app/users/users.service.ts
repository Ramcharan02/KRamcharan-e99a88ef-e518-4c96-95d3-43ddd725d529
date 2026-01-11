import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { Role } from '@task-management/data';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['organization'],
      select: ['id', 'email', 'name', 'role', 'organizationId', 'createdAt', 'updatedAt'],
    });
  }

  async findAllInOrganization(userOrgId: number, userRole: Role): Promise<User[]> {
    const accessibleOrgIds = await this.getAccessibleOrganizationIds(userOrgId, userRole);

    return this.userRepository.find({
      where: { organizationId: In(accessibleOrgIds) },
      relations: ['organization'],
      select: ['id', 'email', 'name', 'role', 'organizationId', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['organization'],
      select: ['id', 'email', 'name', 'role', 'organizationId', 'createdAt', 'updatedAt'],
    });
  }

  async findOneWithAccessCheck(
    id: number,
    userOrgId: number,
    userRole: Role
  ): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const canAccess = await this.canAccessOrganization(userOrgId, user.organizationId, userRole);
    if (!canAccess) {
      throw new ForbiddenException('Access denied to this user');
    }

    return user;
  }

  async updateUser(
    id: number,
    updateData: { name?: string; email?: string },
    currentUserId: number,
    userOrgId: number,
    userRole: Role
  ): Promise<User> {
    const user = await this.findOneWithAccessCheck(id, userOrgId, userRole);

    if (updateData.name) user.name = updateData.name;
    if (updateData.email) user.email = updateData.email;

    const updatedUser = await this.userRepository.save(user);

    await this.logAction(
      currentUserId,
      'UPDATE',
      'User',
      id,
      `Updated user: ${user.email}`
    );

    return this.findOne(id);
  }

  async updateUserRole(
    id: number,
    newRole: Role,
    currentUserId: number,
    userOrgId: number,
    userRole: Role
  ): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check access based on role
    const canAccess = await this.canAccessOrganization(userOrgId, user.organizationId, userRole);
    if (!canAccess) {
      throw new ForbiddenException('Can only change roles for users in your organization');
    }

    const oldRole = user.role;
    user.role = newRole;

    await this.userRepository.save(user);

    await this.logAction(
      currentUserId,
      'UPDATE',
      'User',
      id,
      `Changed user role from ${oldRole} to ${newRole}: ${user.email}`
    );

    return this.findOne(id);
  }

  async deactivateUser(
    id: number,
    currentUserId: number,
    userOrgId: number,
    userRole: Role
  ): Promise<{ message: string }> {
    if (id === currentUserId) {
      throw new ForbiddenException('Cannot deactivate yourself');
    }

    const user = await this.findOneWithAccessCheck(id, userOrgId, userRole);

    // For now, we'll just log it. In production, add an 'active' field to User entity
    await this.logAction(
      currentUserId,
      'DELETE',
      'User',
      id,
      `Deactivated user: ${user.email}`
    );

    // TODO: In production, add user.active = false and save
    // await this.userRepository.save(user);

    return { message: `User ${user.email} has been deactivated` };
  }

  private async canAccessOrganization(
    userOrgId: number,
    targetOrgId: number,
    userRole: Role
  ): Promise<boolean> {
    // OWNER can access all organizations
    if (userRole === Role.OWNER) {
      return true;
    }

    // ADMIN and VIEWER can only access their own organization
    return userOrgId === targetOrgId;
  }

  private async getAccessibleOrganizationIds(orgId: number, role: Role): Promise<number[]> {
    // OWNER can access all organizations
    if (role === Role.OWNER) {
      const allOrgs = await this.organizationRepository.find();
      return allOrgs.map(org => org.id);
    }

    // ADMIN and VIEWER can only access their own organization
    return [orgId];
  }

  private async logAction(
    userId: number,
    action: string,
    resource: string,
    resourceId: number | null,
    details: string
  ): Promise<void> {
    const auditLog = this.auditLogRepository.create({
      userId,
      action,
      resource,
      resourceId,
      details,
      timestamp: new Date(),
    });

    await this.auditLogRepository.save(auditLog);
  }
}
