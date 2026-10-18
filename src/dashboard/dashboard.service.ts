import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { DailyMetric } from '../metrics/daily-metric.entity.js';
import { Event } from '../events/event.entity.js';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(DailyMetric) private readonly metrics: Repository<DailyMetric>,
    @InjectRepository(Event) private readonly events: Repository<Event>,
  ) {}

  async getDashboard(weekStart: string) {
    // Dates in this API are calendar dates, independent of the server timezone.
    const monday = new Date(`${weekStart}T00:00:00.000Z`);
    if (monday.getUTCDay() !== 1) {
      throw new BadRequestException('weekStart must be a Monday');
    }
    const dateAt = (offset: number) => {
      const date = new Date(monday);
      date.setUTCDate(date.getUTCDate() + offset);
      return date.toISOString().slice(0, 10);
    };
    const [metrics, events] = await Promise.all([
      this.metrics.find({
        select: { date: true, posRevenue: true, eatclubRevenue: true, labourCost: true, covers: true },
        where: { date: Between(dateAt(-7), dateAt(6)) },
        order: { date: 'ASC' },
      }),
      this.events.find({
        select: { id: true, date: true, impact: true, description: true },
        where: { date: Between(weekStart, dateAt(6)) },
        order: { date: 'ASC' },
      }),
    ]);
    return { weekStart, metrics, events };
  }
}
