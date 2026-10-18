import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BatchUpsertMetricsDto } from './batch-upsert-metrics.dto.js';

const row = { date: '2026-10-12', posRevenue: 0, eatclubRevenue: null, labourCost: 10.25, covers: 2 };
const check = (metrics: unknown[]) => validate(
  plainToInstance(BatchUpsertMetricsDto, { metrics }),
  { whitelist: true, forbidNonWhitelisted: true },
);

describe('Batch metric validation', () => {
  it('accepts zeros and explicit blank cells', async () => {
    expect(await check([row])).toHaveLength(0);
  });

  it.each([
    [],
    [row, row],
    [null],
    [{ ...row, date: '2026-02-30' }],
    [{ ...row, covers: 1.5 }],
    [{ ...row, posRevenue: -1 }],
    [{ ...row, covers: undefined }],
    [{ ...row, eventImpact: 'positive' }],
    Array.from({ length: 8 }, (_, i) => ({ ...row, date: `2026-10-${12 + i}` })),
  ])('rejects invalid batch %#', async (...metrics) => {
    expect((await check(metrics)).length).toBeGreaterThan(0);
  });
});
