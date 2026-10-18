import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Event } from '../../events/event.entity.js';
import { CreateEventDto } from '../dto/create-event.dto.js';
import { GetEventsFilterDto } from '../dto/get-events-filter.dto.js';
import { UpdateEventDto } from '../dto/update-event.dto.js';
import { BatchUpsertEventsDto } from '../dto/batch-upsert-events.dto.js';

@Injectable()
export class AdminEventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepo: Repository<Event>,
  ) {}

  async findAll(filter: GetEventsFilterDto): Promise<Event[]> {
    let where = {};
    if (filter.from && filter.to) {
      where = { date: Between(filter.from, filter.to) };
    } else if (filter.from) {
      where = { date: MoreThanOrEqual(filter.from) };
    } else if (filter.to) {
      where = { date: LessThanOrEqual(filter.to) };
    }

    return this.eventsRepo.find({
      select: {
        id: true,
        date: true,
        impact: true,
        description: true,
      },
      where,
      order: { date: 'ASC', createdAt: 'ASC' },
    });
  }

  async upsertBatch(dto: BatchUpsertEventsDto): Promise<Event[]> {
    return this.eventsRepo.manager.transaction(async (manager) => {
      const repository = manager.getRepository(Event);
      const removedDates = dto.events.filter((row) => row.impact === null).map((row) => row.date);
      if (removedDates.length) {
        await repository.delete({ date: In(removedDates) });
      }
      const rows = dto.events.flatMap((row) => row.impact === null ? [] : [{
        date: row.date,
        impact: row.impact,
        description: row.description?.trim() || null,
      }]);
      if (rows.length) {
        await repository.upsert(rows, ['date']);
      }
      // Return the authoritative events in this request, including IDs. The
      // client can update its cache without another GET or touching metrics.
      return repository.find({
        select: { id: true, date: true, impact: true, description: true },
        where: { date: In(dto.events.map((row) => row.date)) },
        order: { date: 'ASC' },
      });
    });
  }

  async create(dto: CreateEventDto): Promise<Event> {
    const event = this.eventsRepo.create(dto);
    return this.eventsRepo.save(event);
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    const event = await this.eventsRepo.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    Object.assign(event, dto);
    return this.eventsRepo.save(event);
  }
}
