import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ScheduleBlocksService } from './schedule-blocks.service';
import { ScheduleBlocksController } from './schedule-blocks.controller';
import {
  ScheduleBlock,
  ScheduleBlockSchema,
} from './schemas/schedule-block.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ScheduleBlock.name,
        schema: ScheduleBlockSchema,
      },
    ]),
  ],
  controllers: [ScheduleBlocksController],
  providers: [ScheduleBlocksService],
  exports: [ScheduleBlocksService],
})
export class ScheduleBlocksModule { }