import 'reflect-metadata';
import { In, type EntityManager, type Repository } from 'typeorm';
import { DailyMetric } from '../../metrics/daily-metric.entity.js';
import { AdminMetricsService } from './admin-metrics.service.js';

describe('AdminMetricsService batch save', () => {
  const deleteMetrics = vi.fn().mockResolvedValue({ affected: 1 });
  const upsertMetrics = vi.fn().mockResolvedValue({});
  const getRepository = vi.fn(() => ({ delete: deleteMetrics, upsert: upsertMetrics }));
  const transaction = vi.fn(async (work: (manager: EntityManager) => Promise<void>) => {
    await work({ getRepository } as unknown as EntityManager);
  });
  const service = new AdminMetricsService({ manager: { transaction } } as unknown as Repository<DailyMetric>);

  beforeEach(() => {
    deleteMetrics.mockReset().mockResolvedValue({ affected: 1 });
    upsertMetrics.mockReset().mockResolvedValue({});
    getRepository.mockClear();
    transaction.mockClear();
  });

  it('batches non-empty days, preserving explicit null cells and zero', async () => {
    const result = await service.upsertBatch({ metrics: [
      { date: '2026-10-12', posRevenue: 55, eatclubRevenue: null, labourCost: null, covers: 0 },
      { date: '2026-10-13', posRevenue: 10, eatclubRevenue: 20, labourCost: 5, covers: 2 },
    ] });
    expect(result).toEqual({ success: true });
    expect(transaction).toHaveBeenCalledOnce();
    expect(getRepository).toHaveBeenCalledWith(DailyMetric);
    expect(deleteMetrics).not.toHaveBeenCalled();
    expect(upsertMetrics).toHaveBeenCalledExactlyOnceWith([
      { date: '2026-10-12', posRevenue: 55, eatclubRevenue: null, labourCost: null, covers: 0 },
      { date: '2026-10-13', posRevenue: 10, eatclubRevenue: 20, labourCost: 5, covers: 2 },
    ], ['date']);
  });

  it('clears empty dates and writes other dates in the same transaction', async () => {
    await service.upsertBatch({ metrics: [
      { date: '2026-10-12', posRevenue: null, eatclubRevenue: null, labourCost: null, covers: null },
      { date: '2026-10-13', posRevenue: 0, eatclubRevenue: null, labourCost: null, covers: null },
    ] });
    expect(transaction).toHaveBeenCalledOnce();
    expect(getRepository).toHaveBeenCalledOnce();
    expect(deleteMetrics).toHaveBeenCalledExactlyOnceWith({ date: In(['2026-10-12']) });
    expect(upsertMetrics).toHaveBeenCalledExactlyOnceWith([
      { date: '2026-10-13', posRevenue: 0, eatclubRevenue: null, labourCost: null, covers: null },
    ], ['date']);
  });

  it('propagates database failures instead of acknowledging the batch', async () => {
    upsertMetrics.mockRejectedValueOnce(new Error('database failure'));
    await expect(service.upsertBatch({ metrics: [
      { date: '2026-10-12', posRevenue: 1, eatclubRevenue: 0, labourCost: 0, covers: 0 },
    ] })).rejects.toThrow('database failure');
  });

  it('only deletes when all submitted days are empty', async () => {
    await service.upsertBatch({ metrics: [
      { date: '2026-10-12', posRevenue: null, eatclubRevenue: null, labourCost: null, covers: null },
    ] });
    expect(deleteMetrics).toHaveBeenCalledExactlyOnceWith({ date: In(['2026-10-12']) });
    expect(upsertMetrics).not.toHaveBeenCalled();
  });

  it('does not upsert when deletion fails inside the transaction', async () => {
    deleteMetrics.mockRejectedValueOnce(new Error('delete failure'));
    await expect(service.upsertBatch({ metrics: [
      { date: '2026-10-12', posRevenue: null, eatclubRevenue: null, labourCost: null, covers: null },
      { date: '2026-10-13', posRevenue: 1, eatclubRevenue: 0, labourCost: 0, covers: 0 },
    ] })).rejects.toThrow('delete failure');
    expect(upsertMetrics).not.toHaveBeenCalled();
  });
});
