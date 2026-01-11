import { Controller, Get, Request } from '@nestjs/common';
import { Permissions } from '@task-management/auth';
import { Permission } from '@task-management/data';
import { AuditLogService } from './audit-log.service';

@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @Permissions(Permission.VIEW_AUDIT_LOG)
  findAll(@Request() req) {
    return this.auditLogService.findAll(
      req.user.organizationId,
      req.user.role
    );
  }
}
