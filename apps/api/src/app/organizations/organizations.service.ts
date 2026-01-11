import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { CreateOrganizationDto, Role } from '@task-management/data';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto, userId: number): Promise<Organization> {
    const organization = this.organizationRepository.create(createOrganizationDto);
    const savedOrg = await this.organizationRepository.save(organization);

    await this.logAction(
      userId,
      'CREATE',
      'Organization',
      savedOrg.id,
      `Created organization: ${savedOrg.name}`
    );

    return savedOrg;
  }

  async findAccessibleOrganizations(userOrgId: number, userRole: Role): Promise<Organization[]> {
    // OWNER can access all organizations
    if (userRole === Role.OWNER) {
      return this.organizationRepository.find({
        relations: ['parentOrganization', 'childOrganizations'],
      });
    }

    // ADMIN and VIEWER can only access their own organization
    return this.organizationRepository.find({
      where: { id: userOrgId },
      relations: ['parentOrganization', 'childOrganizations'],
    });
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationRepository.find({
      relations: ['parentOrganization', 'childOrganizations'],
    });
  }

  async findOne(id: number): Promise<Organization> {
    return this.organizationRepository.findOne({
      where: { id },
      relations: ['parentOrganization', 'childOrganizations', 'users'],
    });
  }

  async findOneWithAccessCheck(
    id: number,
    userOrgId: number,
    userRole: Role
  ): Promise<Organization> {
    const organization = await this.findOne(id);

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const canAccess = await this.canAccessOrganization(userOrgId, id, userRole);
    if (!canAccess) {
      throw new ForbiddenException('Access denied to this organization');
    }

    return organization;
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
