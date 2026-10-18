import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateEventDto } from './create-event.dto.js';
import { UpdateEventDto } from './update-event.dto.js';

const options = { whitelist: true, forbidNonWhitelisted: true };
const base = { date: '2026-10-18', impact: 'positive' };

describe('Description-only event DTOs', () => {
  it('creates an event with a multiline description longer than a legacy title', async () => {
    const dto = plainToInstance(CreateEventDto, { ...base, description: `${'x'.repeat(300)}\nSecond line` });
    expect(await validate(dto, options)).toHaveLength(0);
  });

  it('keeps description optional', async () => {
    expect(await validate(plainToInstance(CreateEventDto, base), options)).toHaveLength(0);
  });

  it('allows clearing description on update', async () => {
    expect(await validate(plainToInstance(UpdateEventDto, { description: '' }), options)).toHaveLength(0);
  });

  it('rejects title in create and update requests', async () => {
    for (const dto of [
      plainToInstance(CreateEventDto, { ...base, title: 'Legacy title' }),
      plainToInstance(UpdateEventDto, { title: 'Legacy title' }),
    ]) {
      const errors = await validate(dto, options);
      expect(errors.some((error) => error.property === 'title' && error.constraints?.whitelistValidation)).toBe(true);
    }
  });

  it('rejects non-string descriptions', async () => {
    for (const dto of [
      plainToInstance(CreateEventDto, { ...base, description: 123 }),
      plainToInstance(UpdateEventDto, { description: 123 }),
    ]) {
      const errors = await validate(dto, options);
      expect(errors.some((error) => error.property === 'description')).toBe(true);
    }
  });
});
