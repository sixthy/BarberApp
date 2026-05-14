import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ScheduleBlocksService } from './schedule-blocks.service';
import { CreateScheduleBlockDto } from './dto/create-schedule-block.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('schedule-blocks')
export class ScheduleBlocksController {
  constructor(private readonly scheduleBlocksService: ScheduleBlocksService) { }

  @Post()
  create(@Body() createScheduleBlockDto: CreateScheduleBlockDto) {
    return this.scheduleBlocksService.create(createScheduleBlockDto);
  }

  @Get()
  findAll() {
    return this.scheduleBlocksService.findAll();
  }

  @Patch(':id/reopen')
  reopen(@Param('id') id: string) {
    return this.scheduleBlocksService.reopen(id);
  }
}