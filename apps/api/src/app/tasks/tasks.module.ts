import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from '../entities/task.entity';
import { Organization } from '../entities/organization.entity';
import { AuditLog } from '../entities/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Organization, AuditLog])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
