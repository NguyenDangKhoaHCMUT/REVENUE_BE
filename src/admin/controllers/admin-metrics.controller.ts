import {
  Body,
  Controller,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/jwt-auth.guard.js';
import { AdminMetricsService } from '../services/admin-metrics.service.js';
import { BatchUpsertMetricsDto } from '../dto/batch-upsert-metrics.dto.js';

@Controller('admin/metrics')
@UseGuards(JwtAuthGuard)
export class AdminMetricsController {
  constructor(private readonly metricsService: AdminMetricsService) {}

  @Put()
  upsertBatch(@Body() dto: BatchUpsertMetricsDto) {
    return this.metricsService.upsertBatch(dto);
  }
}
