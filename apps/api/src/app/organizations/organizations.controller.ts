import { Controller, Get, Post, Body, Param, ParseIntPipe, Request } from '@nestjs/common';
import { Permissions } from '@task-management/auth';
import { CreateOrganizationDto, Permission } from '@task-management/data';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @Permissions(Permission.MANAGE_ORGANIZATION)
  create(@Body() createOrganizationDto: CreateOrganizationDto, @Request() req) {
    return this.organizationsService.create(createOrganizationDto, req.user.userId);
  }

  @Get()
  @Permissions(Permission.MANAGE_USERS)
  findAll(@Request() req) {
    return this.organizationsService.findAccessibleOrganizations(
      req.user.organizationId,
      req.user.role
    );
  }

  @Get(':id')
  @Permissions(Permission.MANAGE_USERS)
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.organizationsService.findOneWithAccessCheck(
      id,
      req.user.organizationId,
      req.user.role
    );
  }
}
