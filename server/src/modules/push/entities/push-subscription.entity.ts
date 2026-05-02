import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('push_subscriptions')
export class PushSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  endpoint: string;

  @Column({ type: 'text' })
  keys: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
