import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking, BookingSchema } from './schemas/booking.schema';
import {
  BarberService,
  BarberServiceSchema,
} from '../services/schemas/service.schema';

import { BlacklistModule } from '../blacklist/blacklist.module';
import { ScheduleBlocksModule } from '../schedule-blocks/schedule-blocks.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Booking.name,
        schema: BookingSchema,
      },
      {
        name: BarberService.name,
        schema: BarberServiceSchema,
      },
    ]),
    BlacklistModule,
    ScheduleBlocksModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule { }