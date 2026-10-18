import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { EventImpact } from '../../events/event.entity.js';

export class CreateEventDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be formatted as YYYY-MM-DD' })
  date: string;

  @IsEnum(EventImpact, { message: 'impact must be either "positive" or "negative"' })
  impact: EventImpact;

  @IsOptional()
  @IsString()
  description?: string;
}
