import {
  IsIn,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateScheduleBlockDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;

  @IsString()
  @IsIn(['day', 'time'])
  type: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  endTime?: string;

  @IsString()
  reason: string;
}