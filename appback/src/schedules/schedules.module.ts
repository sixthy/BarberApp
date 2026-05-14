import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';

import {
  Booking,
  BookingSchema,
} from '../bookings/schemas/booking.schema';

import {
  BarberService,
  BarberServiceSchema,
} from '../services/schemas/service.schema';

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

    ScheduleBlocksModule,
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
})
export class SchedulesModule { }