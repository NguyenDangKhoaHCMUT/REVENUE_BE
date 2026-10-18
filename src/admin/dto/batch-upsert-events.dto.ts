import { Type } from 'class-transformer';
import {
  ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsDateString,
  IsEnum, IsOptional, IsString, Matches, ValidateIf, ValidateNested,
} from 'class-validator';
import { EventImpact } from '../../events/event.entity.js';

export class BatchEventDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsDateString({ strict: true })
  date: string;

  /** null means remove the event for this date. */
  @ValidateIf((_, value: unknown) => value !== null)
  @IsEnum(EventImpact)
  impact: EventImpact | null;

  @IsOptional()
  @IsString()
  description?: string | null;
}

export class BatchUpsertEventsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ArrayUnique((event: BatchEventDto | null) => event?.date)
  @ValidateNested({ each: true })
  @Type(() => BatchEventDto)
  events: BatchEventDto[];
}
