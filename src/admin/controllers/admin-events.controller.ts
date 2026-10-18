import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/jwt-auth.guard.js';
import { AdminEventsService } from '../services/admin-events.service.js';
import { CreateEventDto } from '../dto/create-event.dto.js';
import { GetEventsFilterDto } from '../dto/get-events-filter.dto.js';
import { UpdateEventDto } from '../dto/update-event.dto.js';
import { BatchUpsertEventsDto } from '../dto/batch-upsert-events.dto.js';

@Controller('admin/events')
@UseGuards(JwtAuthGuard)
export class AdminEventsController {
  constructor(private readonly eventsService: AdminEventsService) {}

  @Get()
  findAll(@Query() filter: GetEventsFilterDto) {
    return this.eventsService.findAll(filter);
  }

  @Put()
  upsertBatch(@Body() dto: BatchUpsertEventsDto) {
    return this.eventsService.upsertBatch(dto);
  }

  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, dto);
  }
}
