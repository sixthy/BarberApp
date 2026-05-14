import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Booking,
  BookingDocument,
  BookingStatus,
} from '../bookings/schemas/booking.schema';
import {
  BarberService,
  BarberServiceDocument,
} from '../services/schemas/service.schema';
import { ScheduleBlocksService } from '../schedule-blocks/schedule-blocks.service';

type BusinessHours = {
  start: string;
  end: string;
} | null;

const BUSINESS_HOURS: Record<number, BusinessHours> = {
  0: { start: '09:00', end: '17:00' }, // Domingo
  1: null, // Segunda fechado
  2: { start: '09:00', end: '19:00' }, // Terça
  3: { start: '09:00', end: '19:00' }, // Quarta
  4: { start: '09:00', end: '19:00' }, // Quinta
  5: { start: '09:00', end: '19:00' }, // Sexta
  6: { start: '09:00', end: '17:00' }, // Sábado
};

const SLOT_STEP_IN_MINUTES = 30;

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,

    @InjectModel(BarberService.name)
    private readonly serviceModel: Model<BarberServiceDocument>,

    private readonly scheduleBlocksService: ScheduleBlocksService,
  ) { }

  async findAvailableTimes(date: string, serviceIdsParam: string) {
    this.validateDate(date);

    const serviceIds = this.parseServiceIds(serviceIdsParam);

    const services = await this.serviceModel
      .find({
        _id: {
          $in: serviceIds,
        },
        isActive: true,
      })
      .exec();

    if (services.length !== serviceIds.length) {
      throw new NotFoundException(
        'Um ou mais serviços não foram encontrados.',
      );
    }

    const totalDurationInMinutes = services.reduce(
      (total, service) => total + service.durationInMinutes,
      0,
    );

    const dayOfWeek = this.getDayOfWeek(date);
    const businessHours = BUSINESS_HOURS[dayOfWeek];

    if (!businessHours) {
      return {
        date,
        isClosed: true,
        message: 'A barbearia está fechada neste dia.',
        availableTimes: [],
      };
    }

    const blocks = await this.scheduleBlocksService.findActiveByDate(date);

    const hasClosedDay = blocks.some((block) => block.type === 'day');

    if (hasClosedDay) {
      return {
        date,
        isClosed: true,
        message: 'A barbearia está fechada nesta data por bloqueio do admin.',
        availableTimes: [],
      };
    }

    const bookings = await this.bookingModel
      .find({
        date,
        status: BookingStatus.CONFIRMED,
      })
      .exec();

    const openingMinutes = this.timeToMinutes(businessHours.start);
    const closingMinutes = this.timeToMinutes(businessHours.end);

    const availableTimes: Array<{
      startTime: string;
      endTime: string;
    }> = [];

    for (
      let currentStart = openingMinutes;
      currentStart + totalDurationInMinutes <= closingMinutes;
      currentStart += SLOT_STEP_IN_MINUTES
    ) {
      const currentEnd = currentStart + totalDurationInMinutes;

      const hasConflict = bookings.some((booking) => {
        const existingStart = this.timeToMinutes(booking.startTime);
        const existingEnd = this.timeToMinutes(booking.endTime);

        return currentStart < existingEnd && currentEnd > existingStart;
      });

      const hasBlockedTime = blocks.some((block) => {
        if (block.type !== 'time' || !block.startTime || !block.endTime) {
          return false;
        }

        const blockStart = this.timeToMinutes(block.startTime);
        const blockEnd = this.timeToMinutes(block.endTime);

        return currentStart < blockEnd && currentEnd > blockStart;
      });

      if (!hasConflict && !hasBlockedTime) {
        availableTimes.push({
          startTime: this.minutesToTime(currentStart),
          endTime: this.minutesToTime(currentEnd),
        });
      }
    }

    return {
      date,
      isClosed: false,
      openingTime: businessHours.start,
      closingTime: businessHours.end,
      totalDurationInMinutes,
      services: services.map((service) => ({
        id: service._id,
        name: service.name,
        durationInMinutes: service.durationInMinutes,
        price: service.price,
      })),
      availableTimes,
    };
  }

  private validateDate(date: string) {
        const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);

        if (!isValidDate) {
            throw new BadRequestException(
                'Data inválida. Use o formato YYYY-MM-DD.',
            );
        }
        const parsedDate = new Date(`${date}T00:00:00`);

        if (Number.isNaN(parsedDate.getTime())) {
            throw new BadRequestException('Data inválida.');
        }

        const [year, month, day] = date.split('-').map(Number);

        if (
            parsedDate.getFullYear() !== year ||
            parsedDate.getMonth() + 1 !== month ||
            parsedDate.getDate() !== day
        ) {
            throw new BadRequestException('Data inválida.');
        }
    }

  private parseServiceIds(serviceIdsParam: string) {
    if (!serviceIdsParam) {
      throw new BadRequestException(
        'Informe pelo menos um serviço em serviceIds.',
      );
    }

    const serviceIds = serviceIdsParam
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    if (serviceIds.length === 0) {
      throw new BadRequestException(
        'Informe pelo menos um serviço em serviceIds.',
      );
    }

    const hasInvalidId = serviceIds.some(
      (id) => !Types.ObjectId.isValid(id),
    );

    if (hasInvalidId) {
      throw new BadRequestException(
        'Um ou mais IDs de serviço são inválidos.',
      );
    }

    return serviceIds;
  }

  private getDayOfWeek(date: string) {
    return new Date(`${date}T00:00:00`).getDay();
  }

  private timeToMinutes(time: string) {
    const [hours, minutes] = time.split(':').map(Number);

    return hours * 60 + minutes;
  }

  private minutesToTime(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}`;
  }
}