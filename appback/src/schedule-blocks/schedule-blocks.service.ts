import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ScheduleBlock,
  ScheduleBlockDocument,
} from './schemas/schedule-block.schema';
import { CreateScheduleBlockDto } from './dto/create-schedule-block.dto';

@Injectable()
export class ScheduleBlocksService {
  constructor(
    @InjectModel(ScheduleBlock.name)
    private readonly scheduleBlockModel: Model<ScheduleBlockDocument>,
  ) { }

  async create(createScheduleBlockDto: CreateScheduleBlockDto) {
    if (createScheduleBlockDto.type === 'time') {
      if (
        !createScheduleBlockDto.startTime ||
        !createScheduleBlockDto.endTime
      ) {
        throw new BadRequestException(
          'Para bloquear horário, informe startTime e endTime.',
        );
      }

      if (createScheduleBlockDto.startTime >= createScheduleBlockDto.endTime) {
        throw new BadRequestException(
          'O horário inicial deve ser menor que o horário final.',
        );
      }
    }

    const block = await this.scheduleBlockModel.create(createScheduleBlockDto);

    return block;
  }

  async findAll() {
    return this.scheduleBlockModel
      .find()
      .sort({
        date: 1,
        startTime: 1,
      })
      .exec();
  }

  async findActiveByDate(date: string) {
    return this.scheduleBlockModel
      .find({
        date,
        isActive: true,
      })
      .exec();
  }

  async reopen(id: string) {
    const block = await this.scheduleBlockModel
      .findByIdAndUpdate(
        id,
        {
          isActive: false,
        },
        {
          new: true,
        },
      )
      .exec();

    if (!block) {
      throw new NotFoundException('Bloqueio não encontrado.');
    }

    return block;
  }
}