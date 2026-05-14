import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter, Model, Types } from 'mongoose';

import { CreateBookingDto } from './dto/create-booking.dto';
import {
    Booking,
    BookingDocument,
    BookingStatus,
} from './schemas/booking.schema';

import {
    BarberService,
    BarberServiceDocument,
} from '../services/schemas/service.schema';
import { BlacklistService } from '../blacklist/blacklist.service';
import { AuthUser } from '../auth/types/auth-user.type';
import { UpdateBookingDto } from './dto/update-booking.dto';

import { ScheduleBlocksService } from '../schedule-blocks/schedule-blocks.service';

type BusinessHours = {
    start: string;
    end: string;
} | null;

const BUSINESS_HOURS: Record<number, BusinessHours> = {
    0: { start: '09:00', end: '17:00' }, // Dom
    1: null, // Segunda fechado
    2: { start: '09:00', end: '19:00' }, // Ter
    3: { start: '09:00', end: '19:00' }, // Qua
    4: { start: '09:00', end: '19:00' }, // Qui
    5: { start: '09:00', end: '19:00' }, // Sex
    6: { start: '09:00', end: '17:00' }, // Sáb
};

@Injectable()
export class BookingsService {
    constructor(
        @InjectModel(Booking.name)
        private readonly bookingModel: Model<BookingDocument>,

        @InjectModel(BarberService.name)
        private readonly serviceModel: Model<BarberServiceDocument>,

        private readonly blacklistService: BlacklistService,

        private readonly scheduleBlocksService: ScheduleBlocksService,
    ) { }


    async create(createBookingDto: CreateBookingDto, user: AuthUser) {

        this.validateServiceIds(createBookingDto.serviceIds);

        await this.blacklistService.checkClientCanBook(
            user.email,
            createBookingDto.customerPhone,
        );

        const services = await this.serviceModel
            .find({
                _id: {
                    $in: createBookingDto.serviceIds,
                },
                isActive: true,
            })
            .exec();

        if (services.length !== createBookingDto.serviceIds.length) {
            throw new NotFoundException(
                'Um ou mais serviços não foram encontrados.',
            );
        }

        const totalPrice = services.reduce(
            (total, service) => total + service.price,
            0,
        );

        const totalDurationInMinutes = services.reduce(
            (total, service) => total + service.durationInMinutes,
            0,
        );

        const endTime = this.addMinutesToTime(
            createBookingDto.startTime,
            totalDurationInMinutes,
        );

        await this.validateBookingRules(
            createBookingDto.date,
            createBookingDto.startTime,
            endTime,
        );



        const booking = await this.bookingModel.create({
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: createBookingDto.customerPhone,
            serviceIds: createBookingDto.serviceIds.map(
                (id) => new Types.ObjectId(id),
            ),
            serviceNames: services.map((service) => service.name),
            totalPrice,
            totalDurationInMinutes,
            date: createBookingDto.date,
            startTime: createBookingDto.startTime,
            endTime,
            status: BookingStatus.CONFIRMED,
        });

        return booking;
    }

    async findAll() {
        const bookings = await this.bookingModel
            .find()
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        return bookings.map((booking) => ({
            ...booking,
            _id: booking._id.toString(),
            serviceIds: booking.serviceIds.map((serviceId) => serviceId.toString()),
        }));
    }

    async findByDate(date: string) {
        return this.bookingModel
            .find({
                date,
                status: BookingStatus.CONFIRMED,
            })
            .sort({ startTime: 1 })
            .exec();
    }

    async cancel(id: string) {

        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('ID de agendamento inválido.');
        }

        const booking = await this.bookingModel.findById(id).exec();

        if (!booking) {
            throw new NotFoundException('Agendamento não encontrado.');
        }

        if (booking.status === BookingStatus.CANCELLED) {
            throw new BadRequestException('Este agendamento já está cancelado');
        }

        if (booking.status === BookingStatus.NO_SHOW) {
            throw new BadRequestException('Agendamento com falta registrada não pode ser cancelado.')
        }

        booking.status = BookingStatus.CANCELLED;

        await booking.save();

        return booking;
    }


    async markNoShow(id: string) {

        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('ID de agendamento inválido.');
        }

        const booking = await this.bookingModel.findById(id).exec();

        if (!booking) {
            throw new NotFoundException('Agendamento não encontrado.');
        }

        if (booking.status === BookingStatus.NO_SHOW) {
            throw new BadRequestException('Este agendamento já foi marcado como falta.');
        }

        if (booking.status === BookingStatus.CANCELLED) {
            throw new BadRequestException('Agendamento cancelado não pode virar falta.');
        }

        this.validateNoShowCanBeMarked(booking);

        booking.status = BookingStatus.NO_SHOW;

        await booking.save();

        const blacklistEntry = await this.blacklistService.registerNoShow({
            customerName: booking.customerName,
            customerEmail: booking.customerEmail,
            customerPhone: booking.customerPhone,
        });

        return {
            message: 'Falta registrada com sucesso.',
            booking,
            blacklistEntry,
        };
    }



    private async validateBookingRules(
        date: string,
        startTime: string,
        endTime: string,
        ignoreBookingId?: string,
    ) {
        this.validateDate(date);
        this.validateTime(startTime);
        this.validateTime(endTime);


        const startMinutes = this.timeToMinutes(startTime);
        const endMinutes = this.timeToMinutes(endTime);

        if (startMinutes >= endMinutes) {
            throw new BadRequestException(
                'O horário inicial deve ser menor que o horário final.',
            );
        }

        const dayOfWeek = this.getDayOfWeek(date);
        const businessHours = BUSINESS_HOURS[dayOfWeek];

        if (!businessHours) {
            throw new BadRequestException(
                'A barbearia está fechada neste dia.',
            );
        }

        const openingMinutes = this.timeToMinutes(businessHours.start);
        const closingMinutes = this.timeToMinutes(businessHours.end);

        if (startMinutes < openingMinutes || endMinutes > closingMinutes) {
            throw new BadRequestException(
                `O horário precisa estar dentro do expediente: ${businessHours.start} - ${businessHours.end}.`,
            );
        }

        const blocks = await this.scheduleBlocksService.findActiveByDate(date);

        const hasClosedDay = blocks.some((block) => block.type === 'day');

        if (hasClosedDay) {
            throw new BadRequestException(
                'A barbearia está fechada nesta data por bloqueio do admin.',
            );
        }

        const hasBlockedTime = blocks.some((block) => {
            if (block.type !== 'time' || !block.startTime || !block.endTime) {
                return false;
            }

            const blockStart = this.timeToMinutes(block.startTime);
            const blockEnd = this.timeToMinutes(block.endTime);

            return startMinutes < blockEnd && endMinutes > blockStart;
        });

        if (hasBlockedTime) {
            throw new BadRequestException(
                'Este horário está bloqueado pelo admin.',
            );
        }

        const conflictFilter: QueryFilter<BookingDocument> = {
            date,
            status: BookingStatus.CONFIRMED,
            startTime: {
                $lt: endTime,
            },
            endTime: {
                $gt: startTime,
            },
        };

        if (ignoreBookingId) {
            if (!Types.ObjectId.isValid(ignoreBookingId)) {
                throw new BadRequestException('ID de agendamento inválido.');
            }
            conflictFilter._id = {
                $ne: new Types.ObjectId(ignoreBookingId),
            };
        }

        const conflict = await this.bookingModel
            .findOne(conflictFilter)
            .exec();

        if (conflict) {
            throw new BadRequestException(
                'Este horário já está ocupado para a duração selecionada.',
            );
        }
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
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    private addMinutesToTime(time: string, minutesToAdd: number) {
        const total = this.timeToMinutes(time) + minutesToAdd;
        return this.minutesToTime(total);
    }

    async update(id: string, updateBookingDto: UpdateBookingDto) {


        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('ID de agendamento inválido.');
        }

        const booking = await this.bookingModel.findById(id).exec();

        if (!booking) {
            throw new NotFoundException('Agendamento não encontrado.');
        }

        if (booking.status !== BookingStatus.CONFIRMED) {
            throw new BadRequestException(
                'Apenas agendamentos confirmados podem ser editados.',
            );
        }


        const nextServiceIds =
            updateBookingDto.serviceIds ?? booking.serviceIds.map(String);
        this.validateServiceIds(nextServiceIds);

        const services = await this.serviceModel
            .find({
                _id: {
                    $in: nextServiceIds,
                },
                isActive: true,
            })
            .exec();

        if (services.length !== nextServiceIds.length) {
            throw new NotFoundException('Um ou mais serviços não foram encontrados.');
        }

        const nextDate = updateBookingDto.date ?? booking.date;
        const nextStartTime = updateBookingDto.startTime ?? booking.startTime;

        const totalPrice = services.reduce(
            (total, service) => total + service.price,
            0,
        );

        const totalDurationInMinutes = services.reduce(
            (total, service) => total + service.durationInMinutes,
            0,
        );

        const nextEndTime = this.addMinutesToTime(
            nextStartTime,
            totalDurationInMinutes,
        );

        await this.validateBookingRules(
            nextDate,
            nextStartTime,
            nextEndTime,
            id,
        );

        booking.serviceIds = services.map((service) => service._id);
        booking.serviceNames = services.map((service) => service.name);
        booking.totalPrice = totalPrice;
        booking.totalDurationInMinutes = totalDurationInMinutes;
        booking.date = nextDate;
        booking.startTime = nextStartTime;
        booking.endTime = nextEndTime;

        if (updateBookingDto.customerPhone) {
            booking.customerPhone = updateBookingDto.customerPhone;
        }

        await booking.save();

        return booking;
    }

    private validateNoShowCanBeMarked(booking: BookingDocument) {
        const appointmentEnd = new Date(`${booking.date}T${booking.endTime}:00`);
        const now = new Date();

        if (Number.isNaN(appointmentEnd.getTime())) {
            throw new BadRequestException(
                'Data ou horário do agendamento inválido.',
            );
        }

        if (now < appointmentEnd) {
            throw new BadRequestException(
                'Só é possível marcar falta depois do horário do agendamento terminar.',
            );
        }
    }

    private validateServiceIds(serviceIds: string[]) {
        if (!serviceIds || serviceIds.length === 0) {
            throw new BadRequestException('Informe pelo menos um serviço.');
        }

        const hasInvalidId = serviceIds.some(
            (id) => !Types.ObjectId.isValid(id),
        );

        if (hasInvalidId) {
            throw new BadRequestException('Um ou mais IDs de serviço são inválidos.');
        }
    }

    private validateTime(time: string) {
        const isValidTime = /^([01]\d|2[0-3]):[0-5]\d$/.test(time);

        if (!isValidTime) {
            throw new BadRequestException(
                'Horário inválido. Use o formato HH:mm.',
            );
        }
    }



}
