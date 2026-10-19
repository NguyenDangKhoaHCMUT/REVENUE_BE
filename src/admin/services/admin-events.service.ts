import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Event } from '../../events/event.entity.js';
import { BatchUpsertEventsDto } from '../dto/batch-upsert-events.dto.js';

@Injectable()
export class AdminEventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepo: Repository<Event>,
  ) {}

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
}
