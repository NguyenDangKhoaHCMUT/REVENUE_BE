import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  Matches,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

/** Full replacement of the four metric cells for one date; null clears a cell. */
export class BatchDailyMetricDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsDateString({ strict: true })
  date: string;

  @ValidateIf((_, value: unknown) => value !== null)
  @IsNumber()
  @Min(0)
  posRevenue: number | null;

  @ValidateIf((_, value: unknown) => value !== null)
  @IsNumber()
  @Min(0)
  eatclubRevenue: number | null;

  @ValidateIf((_, value: unknown) => value !== null)
  @IsNumber()
  @Min(0)
  labourCost: number | null;

  @ValidateIf((_, value: unknown) => value !== null)
  @IsInt()
  @Min(0)
  covers: number | null;
}

export class BatchUpsertMetricsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ArrayUnique((metric: BatchDailyMetricDto | null) => metric?.date)
  @ValidateNested({ each: true })
  @Type(() => BatchDailyMetricDto)
  metrics: BatchDailyMetricDto[];
}
