import { Controller, Get, Header, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { GetDashboardDto } from './dto/get-dashboard.dto.js';

/** Public read access only. All admin controllers keep JwtAuthGuard. */
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  getDashboard(@Query() query: GetDashboardDto) {
    return this.dashboard.getDashboard(query.weekStart);
  }
}
