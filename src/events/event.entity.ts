import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum EventImpact {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Format YYYY-MM-DD, the day the impact icon is attached to. */
  @Index()
  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'enum', enum: EventImpact, enumName: 'event_impact_enum' })
  impact: EventImpact;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
