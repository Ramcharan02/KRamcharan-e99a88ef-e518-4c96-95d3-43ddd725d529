import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Organization, (org) => org.childOrganizations, { nullable: true })
  parentOrganization: Organization | null;

  @OneToMany(() => Organization, (org) => org.parentOrganization)
  childOrganizations: Organization[];

  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  @OneToMany(() => Task, (task) => task.organization)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
