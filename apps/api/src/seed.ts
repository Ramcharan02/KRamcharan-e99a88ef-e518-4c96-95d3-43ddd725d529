import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './app/entities/user.entity';
import { Organization } from './app/entities/organization.entity';
import { Task } from './app/entities/task.entity';
import { Role, TaskStatus, TaskCategory } from '@task-management/data';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const organizationRepo: Repository<Organization> = dataSource.getRepository(Organization);
  const userRepo: Repository<User> = dataSource.getRepository(User);
  const taskRepo: Repository<Task> = dataSource.getRepository(Task);

  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await taskRepo.delete({});
  await userRepo.delete({});
  await organizationRepo.delete({});

  // Create Organizations
  console.log('Creating organizations...');
  const techCorp = organizationRepo.create({
    name: 'TechCorp',
  });
  await organizationRepo.save(techCorp);

  const engineering = organizationRepo.create({
    name: 'Engineering Inc',
  });
  await organizationRepo.save(engineering);

  const sales = organizationRepo.create({
    name: 'Sales Corp',
  });
  await organizationRepo.save(sales);

  console.log('✓ Organizations created');

  // Create Users
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const owner = userRepo.create({
    email: 'owner@example.com',
    password: hashedPassword,
    name: 'Owner User',
    role: Role.OWNER,
    organizationId: techCorp.id,
  });
  await userRepo.save(owner);

  const admin = userRepo.create({
    email: 'admin@example.com',
    password: hashedPassword,
    name: 'Admin User',
    role: Role.ADMIN,
    organizationId: engineering.id,
  });
  await userRepo.save(admin);

  const viewer = userRepo.create({
    email: 'viewer@example.com',
    password: hashedPassword,
    name: 'Viewer User',
    role: Role.VIEWER,
    organizationId: sales.id,
  });
  await userRepo.save(viewer);

  console.log('✓ Users created');

  // Create Sample Tasks
  console.log('Creating sample tasks...');
  const tasks = [
    {
      title: 'Complete project documentation',
      description: 'Write comprehensive README and API docs',
      status: TaskStatus.IN_PROGRESS,
      category: TaskCategory.WORK,
      priority: 8,
      createdById: admin.id,
      organizationId: engineering.id,
    },
    {
      title: 'Review pull requests',
      description: 'Review pending PRs from the team',
      status: TaskStatus.TODO,
      category: TaskCategory.WORK,
      priority: 7,
      createdById: admin.id,
      organizationId: engineering.id,
    },
    {
      title: 'Update dependencies',
      description: 'Update npm packages to latest versions',
      status: TaskStatus.TODO,
      category: TaskCategory.WORK,
      priority: 5,
      createdById: owner.id,
      organizationId: techCorp.id,
    },
    {
      title: 'Team meeting preparation',
      description: 'Prepare slides for quarterly review',
      status: TaskStatus.TODO,
      category: TaskCategory.WORK,
      priority: 6,
      createdById: owner.id,
      organizationId: techCorp.id,
    },
    {
      title: 'Fix critical bug',
      description: 'Address the authentication timeout issue',
      status: TaskStatus.IN_PROGRESS,
      category: TaskCategory.URGENT,
      priority: 10,
      createdById: admin.id,
      organizationId: engineering.id,
    },
    {
      title: 'Personal: Learn TypeScript',
      description: 'Complete advanced TypeScript course',
      status: TaskStatus.IN_PROGRESS,
      category: TaskCategory.PERSONAL,
      priority: 3,
      createdById: viewer.id,
      organizationId: sales.id,
    },
  ];

  for (const taskData of tasks) {
    const task = taskRepo.create(taskData);
    await taskRepo.save(task);
  }

  console.log('✓ Sample tasks created');

  console.log('\n✅ Database seeding completed successfully!\n');
  console.log('📋 Test Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Owner:');
  console.log('  Email: owner@example.com');
  console.log('  Password: password123');
  console.log('  Organization: TechCorp\n');
  console.log('Admin:');
  console.log('  Email: admin@example.com');
  console.log('  Password: password123');
  console.log('  Organization: Engineering Inc\n');
  console.log('Viewer:');
  console.log('  Email: viewer@example.com');
  console.log('  Password: password123');
  console.log('  Organization: Sales Corp\n');

  await app.close();
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
