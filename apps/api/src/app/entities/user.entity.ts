import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Role } from '@task-management/data';
import { Organization } from './organization.entity';
import { Task } from './task.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'text',
    enum: Role,
    default: Role.VIEWER,
  })
  role: Role;

  @Column()
  organizationId: number;

  @ManyToOne(() => Organization, (org) => org.users)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @OneToMany(() => Task, (task) => task.createdBy)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
