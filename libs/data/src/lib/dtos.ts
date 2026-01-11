import { IsEmail, IsString, IsEnum, IsOptional, IsNumber, IsDate, MinLength, MaxLength, IsInt, Min, Max } from 'class-validator';
import { Role, TaskStatus, TaskCategory } from './enums';

// Auth DTOs
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEnum(Role)
  role: Role;

  @IsNumber()
  organizationId: number;
}

export class AuthResponseDto {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: Role;
    organizationId: number;
  };
}

// Task DTOs
export class CreateTaskDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskCategory)
  category: TaskCategory;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  priority?: number;

  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @IsNumber()
  @IsOptional()
  organizationId?: number;
}

export class UpdateTaskDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskCategory)
  @IsOptional()
  category?: TaskCategory;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  priority?: number;

  @IsDate()
  @IsOptional()
  dueDate?: Date;
}

export class TaskResponseDto {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  priority: number;
  dueDate?: Date;
  createdById: number;
  organizationId: number;
  createdAt: Date;
  updatedAt: Date;
}

// Organization DTOs
export class CreateOrganizationDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;
}

export class OrganizationResponseDto {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// User DTOs
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEnum(Role)
  role: Role;

  @IsNumber()
  organizationId: number;
}

export class UserResponseDto {
  id: number;
  email: string;
  name: string;
  role: Role;
  organizationId: number;
  createdAt: Date;
  updatedAt: Date;
}

// Audit Log DTOs
export class AuditLogResponseDto {
  id: number;
  userId: number;
  action: string;
  resource: string;
  resourceId?: number;
  details?: string;
  timestamp: Date;
}
