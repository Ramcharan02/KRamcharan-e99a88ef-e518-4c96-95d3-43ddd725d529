import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  action: string;

  @Column()
  resource: string;

  @Column({ nullable: true })
  resourceId: number;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ nullable: true })
  ipAddress: string;

  @CreateDateColumn()
  timestamp: Date;
}
