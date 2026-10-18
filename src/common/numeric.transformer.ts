import type { ValueTransformer } from 'typeorm';

/** Postgres `numeric` is returned as string by pg; convert it to number. */
export const numericTransformer: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | null) =>
    value === null || value === undefined ? value : parseFloat(value),
};
