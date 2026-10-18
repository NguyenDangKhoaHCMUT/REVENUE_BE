import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { DailyMetric } from '../../metrics/daily-metric.entity.js';
import { GetMetricsFilterDto } from '../dto/get-metrics-filter.dto.js';
import { UpsertDailyMetricDto } from '../dto/upsert-daily-metric.dto.js';

@Injectable()
export class AdminMetricsService {
  constructor(
    @InjectRepository(DailyMetric)
    private readonly metrics: Repository<DailyMetric>,
  ) {}

  async findAll(filter: GetMetricsFilterDto): Promise<DailyMetric[]> {
    let where = {};
    if (filter.from && filter.to) {
      where = { date: Between(filter.from, filter.to) };
    } else if (filter.from) {
      where = { date: MoreThanOrEqual(filter.from) };
    } else if (filter.to) {
      where = { date: LessThanOrEqual(filter.to) };
    }

    return this.metrics.find({
      select: {
        date: true,
        posRevenue: true,
        eatclubRevenue: true,
        labourCost: true,
        covers: true,
      },
      where,
      order: { date: 'ASC' },
    });
  }

  async upsert(date: string, dto: UpsertDailyMetricDto): Promise<DailyMetric> {
    let metric = await this.metrics.findOne({ where: { date } });

    if (metric) {
      metric.posRevenue = dto.posRevenue ?? metric.posRevenue;
      metric.eatclubRevenue = dto.eatclubRevenue ?? metric.eatclubRevenue;
      metric.labourCost = dto.labourCost ?? metric.labourCost;
      metric.covers = dto.covers ?? metric.covers;
    } else {
      metric = this.metrics.create({
        date,
        posRevenue: dto.posRevenue,
        eatclubRevenue: dto.eatclubRevenue,
        labourCost: dto.labourCost,
        covers: dto.covers,
      });
    }

    return this.metrics.save(metric);
  }
}
