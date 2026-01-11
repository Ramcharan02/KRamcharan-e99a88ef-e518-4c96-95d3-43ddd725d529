import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogController } from './audit-log.controller';
import { AuditLogService } from './audit-log.service';
import { AuditLog } from '../entities/audit-log.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog, User])],
  controllers: [AuditLogController],
  providers: [AuditLogService],
})
export class AuditLogModule {}
