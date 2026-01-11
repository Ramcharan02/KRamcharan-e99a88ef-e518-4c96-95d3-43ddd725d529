import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { JwtAuthGuard, PermissionsGuard, RolesGuard, JwtStrategy } from '@task-management/auth';

import { User } from './entities/user.entity';
import { Organization } from './entities/organization.entity';
import { Task } from './entities/task.entity';
import { AuditLog } from './entities/audit-log.entity';

import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';
import { AuditLogModule } from './audit-log/audit-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_DATABASE || './data/task-management.db',
      entities: [User, Organization, Task, AuditLog],
      synchronize: true, // Disable in production
      logging: false,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '1h' },
    }),
    AuthModule,
    TasksModule,
    OrganizationsModule,
    UsersModule,
    AuditLogModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
