import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/jwt-auth.guard.js';
import { validateDateFormat } from '../../common/date.util.js';
import { AdminMetricsService } from '../services/admin-metrics.service.js';
import { GetMetricsFilterDto } from '../dto/get-metrics-filter.dto.js';
import { UpsertDailyMetricDto } from '../dto/upsert-daily-metric.dto.js';

@Controller('admin/metrics')
@UseGuards(JwtAuthGuard)
export class AdminMetricsController {
  constructor(private readonly metricsService: AdminMetricsService) {}

  @Get()
  findAll(@Query() filter: GetMetricsFilterDto) {
    return this.metricsService.findAll(filter);
  }

  @Put(':date')
  upsert(@Param('date') date: string, @Body() dto: UpsertDailyMetricDto) {
    validateDateFormat(date);
    return this.metricsService.upsert(date, dto);
  }
}
