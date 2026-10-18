import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { Event } from '../events/event.entity.js';
import { DailyMetric } from '../metrics/daily-metric.entity.js';
import { AdminEventsController } from './controllers/admin-events.controller.js';
import { AdminEventsService } from './services/admin-events.service.js';
import { AdminMetricsController } from './controllers/admin-metrics.controller.js';
import { AdminMetricsService } from './services/admin-metrics.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([DailyMetric, Event]), AuthModule],
  controllers: [AdminMetricsController, AdminEventsController],
  providers: [AdminMetricsService, AdminEventsService],
  exports: [AdminMetricsService, AdminEventsService],
})
export class AdminModule {}
