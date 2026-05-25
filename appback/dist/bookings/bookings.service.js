"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("./schemas/booking.schema");
const service_schema_1 = require("../services/schemas/service.schema");
const blacklist_service_1 = require("../blacklist/blacklist.service");
const schedule_blocks_service_1 = require("../schedule-blocks/schedule-blocks.service");
const BUSINESS_HOURS = {
    0: { start: '09:00', end: '17:00' },
    1: null,
    2: { start: '09:00', end: '19:00' },
    3: { start: '09:00', end: '19:00' },
    4: { start: '09:00', end: '19:00' },
    5: { start: '09:00', end: '19:00' },
    6: { start: '09:00', end: '17:00' },
};
let BookingsService = class BookingsService {
    bookingModel;
    serviceModel;
    blacklistService;
    scheduleBlocksService;
    constructor(bookingModel, serviceModel, blacklistService, scheduleBlocksService) {
        this.bookingModel = bookingModel;
        this.serviceModel = serviceModel;
        this.blacklistService = blacklistService;
        this.scheduleBlocksService = scheduleBlocksService;
    }
    async create(createBookingDto, user) {
        this.validateServiceIds(createBookingDto.serviceIds);
        await this.blacklistService.checkClientCanBook(user.email, createBookingDto.customerPhone);
        const services = await this.serviceModel
            .find({
            _id: {
                $in: createBookingDto.serviceIds,
            },
            isActive: true,
        })
            .exec();
        if (services.length !== createBookingDto.serviceIds.length) {
            throw new common_1.NotFoundException('Um ou mais serviços não foram encontrados.');
        }
        const totalPrice = services.reduce((total, service) => total + service.price, 0);
        const totalDurationInMinutes = services.reduce((total, service) => total + service.durationInMinutes, 0);
        const endTime = this.addMinutesToTime(createBookingDto.startTime, totalDurationInMinutes);
        await this.validateBookingRules(createBookingDto.date, createBookingDto.startTime, endTime);
        const booking = await this.bookingModel.create({
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: createBookingDto.customerPhone,
            serviceIds: createBookingDto.serviceIds.map((id) => new mongoose_2.Types.ObjectId(id)),
            serviceNames: services.map((service) => service.name),
            totalPrice,
            totalDurationInMinutes,
            date: createBookingDto.date,
            startTime: createBookingDto.startTime,
            endTime,
            status: booking_schema_1.BookingStatus.CONFIRMED,
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
    async findByDate(date) {
        return this.bookingModel
            .find({
            date,
            status: booking_schema_1.BookingStatus.CONFIRMED,
        })
            .sort({ startTime: 1 })
            .exec();
    }
    async cancel(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('ID de agendamento inválido.');
        }
        const booking = await this.bookingModel.findById(id).exec();
        if (!booking) {
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        }
        if (booking.status === booking_schema_1.BookingStatus.CANCELLED) {
            throw new common_1.BadRequestException('Este agendamento já está cancelado');
        }
        if (booking.status === booking_schema_1.BookingStatus.NO_SHOW) {
            throw new common_1.BadRequestException('Agendamento com falta registrada não pode ser cancelado.');
        }
        booking.status = booking_schema_1.BookingStatus.CANCELLED;
        await booking.save();
        return booking;
    }
    async markNoShow(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('ID de agendamento inválido.');
        }
        const booking = await this.bookingModel.findById(id).exec();
        if (!booking) {
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        }
        if (booking.status === booking_schema_1.BookingStatus.NO_SHOW) {
            throw new common_1.BadRequestException('Este agendamento já foi marcado como falta.');
        }
        if (booking.status === booking_schema_1.BookingStatus.CANCELLED) {
            throw new common_1.BadRequestException('Agendamento cancelado não pode virar falta.');
        }
        this.validateNoShowCanBeMarked(booking);
        booking.status = booking_schema_1.BookingStatus.NO_SHOW;
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
    async validateBookingRules(date, startTime, endTime, ignoreBookingId) {
        this.validateDate(date);
        this.validateTime(startTime);
        this.validateTime(endTime);
        const startMinutes = this.timeToMinutes(startTime);
        const endMinutes = this.timeToMinutes(endTime);
        if (startMinutes >= endMinutes) {
            throw new common_1.BadRequestException('O horário inicial deve ser menor que o horário final.');
        }
        const dayOfWeek = this.getDayOfWeek(date);
        const businessHours = BUSINESS_HOURS[dayOfWeek];
        if (!businessHours) {
            throw new common_1.BadRequestException('A barbearia está fechada neste dia.');
        }
        const openingMinutes = this.timeToMinutes(businessHours.start);
        const closingMinutes = this.timeToMinutes(businessHours.end);
        if (startMinutes < openingMinutes || endMinutes > closingMinutes) {
            throw new common_1.BadRequestException(`O horário precisa estar dentro do expediente: ${businessHours.start} - ${businessHours.end}.`);
        }
        const blocks = await this.scheduleBlocksService.findActiveByDate(date);
        const hasClosedDay = blocks.some((block) => block.type === 'day');
        if (hasClosedDay) {
            throw new common_1.BadRequestException('A barbearia está fechada nesta data por bloqueio do admin.');
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
            throw new common_1.BadRequestException('Este horário está bloqueado pelo admin.');
        }
        const conflictFilter = {
            date,
            status: booking_schema_1.BookingStatus.CONFIRMED,
            startTime: {
                $lt: endTime,
            },
            endTime: {
                $gt: startTime,
            },
        };
        if (ignoreBookingId) {
            if (!mongoose_2.Types.ObjectId.isValid(ignoreBookingId)) {
                throw new common_1.BadRequestException('ID de agendamento inválido.');
            }
            conflictFilter._id = {
                $ne: new mongoose_2.Types.ObjectId(ignoreBookingId),
            };
        }
        const conflict = await this.bookingModel
            .findOne(conflictFilter)
            .exec();
        if (conflict) {
            throw new common_1.BadRequestException('Este horário já está ocupado para a duração selecionada.');
        }
    }
    validateDate(date) {
        const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
        if (!isValidDate) {
            throw new common_1.BadRequestException('Data inválida. Use o formato YYYY-MM-DD.');
        }
        const parsedDate = new Date(`${date}T00:00:00`);
        if (Number.isNaN(parsedDate.getTime())) {
            throw new common_1.BadRequestException('Data inválida.');
        }
        const [year, month, day] = date.split('-').map(Number);
        if (parsedDate.getFullYear() !== year ||
            parsedDate.getMonth() + 1 !== month ||
            parsedDate.getDate() !== day) {
            throw new common_1.BadRequestException('Data inválida.');
        }
    }
    getDayOfWeek(date) {
        return new Date(`${date}T00:00:00`).getDay();
    }
    timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
    minutesToTime(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    addMinutesToTime(time, minutesToAdd) {
        const total = this.timeToMinutes(time) + minutesToAdd;
        return this.minutesToTime(total);
    }
    async update(id, updateBookingDto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('ID de agendamento inválido.');
        }
        const booking = await this.bookingModel.findById(id).exec();
        if (!booking) {
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        }
        if (booking.status !== booking_schema_1.BookingStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Apenas agendamentos confirmados podem ser editados.');
        }
        const nextServiceIds = updateBookingDto.serviceIds ?? booking.serviceIds.map(String);
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
            throw new common_1.NotFoundException('Um ou mais serviços não foram encontrados.');
        }
        const nextDate = updateBookingDto.date ?? booking.date;
        const nextStartTime = updateBookingDto.startTime ?? booking.startTime;
        const totalPrice = services.reduce((total, service) => total + service.price, 0);
        const totalDurationInMinutes = services.reduce((total, service) => total + service.durationInMinutes, 0);
        const nextEndTime = this.addMinutesToTime(nextStartTime, totalDurationInMinutes);
        await this.validateBookingRules(nextDate, nextStartTime, nextEndTime, id);
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
    validateNoShowCanBeMarked(booking) {
        const appointmentEnd = new Date(`${booking.date}T${booking.endTime}:00`);
        const now = new Date();
        if (Number.isNaN(appointmentEnd.getTime())) {
            throw new common_1.BadRequestException('Data ou horário do agendamento inválido.');
        }
        if (now < appointmentEnd) {
            throw new common_1.BadRequestException('Só é possível marcar falta depois do horário do agendamento terminar.');
        }
    }
    validateServiceIds(serviceIds) {
        if (!serviceIds || serviceIds.length === 0) {
            throw new common_1.BadRequestException('Informe pelo menos um serviço.');
        }
        const hasInvalidId = serviceIds.some((id) => !mongoose_2.Types.ObjectId.isValid(id));
        if (hasInvalidId) {
            throw new common_1.BadRequestException('Um ou mais IDs de serviço são inválidos.');
        }
    }
    validateTime(time) {
        const isValidTime = /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
        if (!isValidTime) {
            throw new common_1.BadRequestException('Horário inválido. Use o formato HH:mm.');
        }
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(1, (0, mongoose_1.InjectModel)(service_schema_1.BarberService.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        blacklist_service_1.BlacklistService,
        schedule_blocks_service_1.ScheduleBlocksService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map