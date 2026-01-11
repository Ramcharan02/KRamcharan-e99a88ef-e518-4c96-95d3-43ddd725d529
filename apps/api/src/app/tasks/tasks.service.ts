import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateTaskDto, UpdateTaskDto, TaskStatus, Role } from '@task-management/data';
import { Task } from '../entities/task.entity';
import { Organization } from '../entities/organization.entity';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    userId: number,
    userOrgId: number,
    userRole: Role
  ): Promise<Task> {
    const targetOrgId = createTaskDto.organizationId || userOrgId;

    // Check if user can create tasks in the target organization
    const canAccess = await this.canAccessOrganization(userOrgId, targetOrgId, userRole);
    if (!canAccess) {
      throw new ForbiddenException('Cannot create tasks in this organization');
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      createdById: userId,
      organizationId: targetOrgId,
      status: createTaskDto.status || TaskStatus.TODO,
      priority: createTaskDto.priority || 0,
    });

    const savedTask = await this.taskRepository.save(task);

    await this.logAction(userId, 'CREATE', 'Task', savedTask.id, `Created task: ${savedTask.title}`);

    return savedTask;
  }

  async findAll(userId: number, userOrgId: number, userRole: Role): Promise<Task[]> {
    const accessibleOrgIds = await this.getAccessibleOrganizationIds(userOrgId, userRole);

    const tasks = await this.taskRepository.find({
      where: { organizationId: In(accessibleOrgIds) },
      relations: ['createdBy', 'organization'],
      order: { createdAt: 'DESC' },
    });

    await this.logAction(userId, 'READ', 'Task', null, `Fetched ${tasks.length} tasks`);

    return tasks;
  }

  async findOne(id: number, userId: number, userOrgId: number, userRole: Role): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['createdBy', 'organization'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const canAccess = await this.canAccessOrganization(userOrgId, task.organizationId, userRole);
    if (!canAccess) {
      throw new ForbiddenException('Access denied');
    }

    await this.logAction(userId, 'READ', 'Task', id, `Viewed task: ${task.title}`);

    return task;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    userId: number,
    userOrgId: number,
    userRole: Role
  ): Promise<Task> {
    const task = await this.findOne(id, userId, userOrgId, userRole);

    Object.assign(task, updateTaskDto);
    const updatedTask = await this.taskRepository.save(task);

    await this.logAction(userId, 'UPDATE', 'Task', id, `Updated task: ${task.title}`);

    return updatedTask;
  }

  async remove(id: number, userId: number, userOrgId: number, userRole: Role): Promise<void> {
    const task = await this.findOne(id, userId, userOrgId, userRole);

    await this.taskRepository.remove(task);

    await this.logAction(userId, 'DELETE', 'Task', id, `Deleted task: ${task.title}`);
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
    const log = this.auditLogRepository.create({
      userId,
      action,
      resource,
      resourceId,
      details,
    });

    await this.auditLogRepository.save(log);
  }
}
