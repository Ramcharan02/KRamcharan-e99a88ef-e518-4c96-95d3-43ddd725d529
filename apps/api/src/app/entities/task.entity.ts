import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TaskStatus, TaskCategory } from '@task-management/data';
import { User } from './user.entity';
import { Organization } from './organization.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({
    type: 'text',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({
    type: 'text',
    enum: TaskCategory,
  })
  category: TaskCategory;

  @Column({ default: 0 })
  priority: number;

  @Column({ nullable: true })
  dueDate: Date;

  @Column()
  createdById: number;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  organizationId: number;

  @ManyToOne(() => Organization, (org) => org.tasks)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
