import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DailyMetric } from '../../metrics/daily-metric.entity.js';
import { BatchUpsertMetricsDto } from '../dto/batch-upsert-metrics.dto.js';

@Injectable()
export class AdminMetricsService {
  constructor(
    @InjectRepository(DailyMetric)
    private readonly metrics: Repository<DailyMetric>,
  ) {}

  async upsertBatch(dto: BatchUpsertMetricsDto): Promise<{ success: true }> {
    await this.metrics.manager.transaction(async (manager) => {
      const repository = manager.getRepository(DailyMetric);
      const emptyDates = dto.metrics
        .filter((row) => row.posRevenue === null && row.eatclubRevenue === null
          && row.labourCost === null && row.covers === null)
        .map((row) => row.date);
      if (emptyDates.length) {
        await repository.delete({ date: In(emptyDates) });
      }

      const rows = dto.metrics.filter((row) => !emptyDates.includes(row.date));
      if (rows.length) {
        await repository.upsert(rows, ['date']);
      }
    });
    return { success: true };
  }
}
