import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { AuditLog } from '../entities/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization, AuditLog])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
