import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { User } from '../entities/user.entity';
import { Role } from '@task-management/data';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findAll(userOrgId: number, userRole: Role): Promise<AuditLog[]> {
    // OWNER can see all audit logs
    if (userRole === Role.OWNER) {
      return this.auditLogRepository.find({
        relations: ['user', 'user.organization'],
        order: { timestamp: 'DESC' },
        take: 100,
      });
    }

    // ADMIN can only see logs from their organization
    // Get all users in the organization
    const orgUsers = await this.userRepository.find({
      where: { organizationId: userOrgId },
      select: ['id'],
    });

    const userIds = orgUsers.map(u => u.id);

    return this.auditLogRepository.find({
      where: { userId: In(userIds) },
      relations: ['user', 'user.organization'],
      order: { timestamp: 'DESC' },
      take: 100,
    });
  }
}
