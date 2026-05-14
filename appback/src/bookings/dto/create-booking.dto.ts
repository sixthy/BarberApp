import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsString,
  Matches,
} from 'class-validator';

export class CreateBookingDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  serviceIds: string[];

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  startTime: string;

  @IsString()
  customerPhone: string;
}