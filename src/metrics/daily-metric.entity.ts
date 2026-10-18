import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { numericTransformer } from '../common/numeric.transformer.js';

@Entity('daily_metrics')
@Check('CHK_daily_metrics_non_negative', 'pos_revenue >= 0 AND eatclub_revenue >= 0 AND labour_cost >= 0 AND covers >= 0')
export class DailyMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Format YYYY-MM-DD, one row per day. */
  @Column({ type: 'date', unique: true })
  date: string;

  @Column({
    name: 'pos_revenue',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: numericTransformer,
  })
  posRevenue: number;

  @Column({
    name: 'eatclub_revenue',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: numericTransformer,
  })
  eatclubRevenue: number;

  @Column({
    name: 'labour_cost',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: numericTransformer,
  })
  labourCost: number;

  @Column({ type: 'int', default: 0 })
  covers: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
