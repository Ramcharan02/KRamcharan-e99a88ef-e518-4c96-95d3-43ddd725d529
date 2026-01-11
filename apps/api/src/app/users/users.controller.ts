import { 
  Controller, 
  Get, 
  Put, 
  Delete, 
  Body, 
  Param, 
  ParseIntPipe, 
  Request 
} from '@nestjs/common';
import { Permissions, Roles } from '@task-management/auth';
import { Permission, Role } from '@task-management/data';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions(Permission.MANAGE_USERS)
  findAll(@Request() req) {
    return this.usersService.findAllInOrganization(
      req.user.organizationId,
      req.user.role
    );
  }

  @Get('me')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @Get(':id')
  @Permissions(Permission.MANAGE_USERS)
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.usersService.findOneWithAccessCheck(
      id,
      req.user.organizationId,
      req.user.role
    );
  }

  @Put(':id')
  @Permissions(Permission.MANAGE_USERS)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: { name?: string; email?: string },
    @Request() req
  ) {
    return this.usersService.updateUser(
      id,
      updateData,
      req.user.userId,
      req.user.organizationId,
      req.user.role
    );
  }

  @Put(':id/role')
  @Roles(Role.OWNER)
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() roleData: { role: Role },
    @Request() req
  ) {
    return this.usersService.updateUserRole(
      id,
      roleData.role,
      req.user.userId,
      req.user.organizationId,
      req.user.role
    );
  }

  @Delete(':id')
  @Permissions(Permission.MANAGE_USERS)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.usersService.deactivateUser(
      id,
      req.user.userId,
      req.user.organizationId,
      req.user.role
    );
  }
}
