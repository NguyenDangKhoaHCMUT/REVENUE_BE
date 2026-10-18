import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyMetric } from '../metrics/daily-metric.entity.js';
import { Event } from '../events/event.entity.js';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([DailyMetric, Event])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
