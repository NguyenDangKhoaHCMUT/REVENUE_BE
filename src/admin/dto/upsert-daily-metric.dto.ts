import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertDailyMetricDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  posRevenue?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  eatclubRevenue?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  labourCost?: number;

  @Type(() => Number)
  @IsInt({ message: 'covers must be an integer' })
  @IsOptional()
  covers?: number;
}
