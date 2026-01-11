import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { Permissions } from '@task-management/auth';
import { Permission, CreateTaskDto, UpdateTaskDto } from '@task-management/data';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Permissions(Permission.CREATE_TASK)
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(
      createTaskDto,
      req.user.userId,
      req.user.organizationId,
      req.user.role
    );
  }

  @Get()
  @Permissions(Permission.READ_TASK)
  findAll(@Request() req) {
    return this.tasksService.findAll(
      req.user.userId,
      req.user.organizationId,
      req.user.role
    );
  }

  @Get(':id')
  @Permissions(Permission.READ_TASK)
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tasksService.findOne(
      id,
      req.user.userId,
      req.user.organizationId,
      req.user.role
    );
  }

  @Put(':id')
  @Permissions(Permission.UPDATE_TASK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req
  ) {
    return this.tasksService.update(
      id,
      updateTaskDto,
      req.user.userId,
      req.user.organizationId,
      req.user.role
    );
  }

  @Delete(':id')
  @Permissions(Permission.DELETE_TASK)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tasksService.remove(
      id,
      req.user.userId,
      req.user.organizationId,
      req.user.role
    );
  }
}
