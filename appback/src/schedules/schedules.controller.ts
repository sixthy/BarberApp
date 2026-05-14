import { Controller, Get, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) { }

  @Get('available')
  findAvailableTimes(
    @Query('date') date: string,
    @Query('serviceIds') serviceIds: string,
  ) {
    return this.schedulesService.findAvailableTimes(date, serviceIds);
  }
}