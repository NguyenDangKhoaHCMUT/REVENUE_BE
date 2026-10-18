import { IsOptional, Matches } from 'class-validator';

export class GetEventsFilterDto {
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'from must be formatted as YYYY-MM-DD' })
  from?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'to must be formatted as YYYY-MM-DD' })
  to?: string;
}
