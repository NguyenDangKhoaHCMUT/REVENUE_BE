import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { EventImpact } from '../../events/event.entity.js';

export class UpdateEventDto {
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be formatted as YYYY-MM-DD' })
  date?: string;

  @IsOptional()
  @IsEnum(EventImpact, { message: 'impact must be either "positive" or "negative"' })
  impact?: EventImpact;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
