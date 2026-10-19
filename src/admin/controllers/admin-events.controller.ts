import {
  Body,
  Controller,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/jwt-auth.guard.js';
import { AdminEventsService } from '../services/admin-events.service.js';
import { BatchUpsertEventsDto } from '../dto/batch-upsert-events.dto.js';

@Controller('admin/events')
@UseGuards(JwtAuthGuard)
export class AdminEventsController {
  constructor(private readonly eventsService: AdminEventsService) {}

  @Put()
  upsertBatch(@Body() dto: BatchUpsertEventsDto) {
    return this.eventsService.upsertBatch(dto);
  }
}
