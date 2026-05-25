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
exports.SchedulesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("../bookings/schemas/booking.schema");
const service_schema_1 = require("../services/schemas/service.schema");
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
const SLOT_STEP_IN_MINUTES = 30;
let SchedulesService = class SchedulesService {
    bookingModel;
    serviceModel;
    scheduleBlocksService;
    constructor(bookingModel, serviceModel, scheduleBlocksService) {
        this.bookingModel = bookingModel;
        this.serviceModel = serviceModel;
        this.scheduleBlocksService = scheduleBlocksService;
    }
    async findAvailableTimes(date, serviceIdsParam) {
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
            throw new common_1.NotFoundException('Um ou mais serviços não foram encontrados.');
        }
        const totalDurationInMinutes = services.reduce((total, service) => total + service.durationInMinutes, 0);
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
            status: booking_schema_1.BookingStatus.CONFIRMED,
        })
            .exec();
        const openingMinutes = this.timeToMinutes(businessHours.start);
        const closingMinutes = this.timeToMinutes(businessHours.end);
        const availableTimes = [];
        for (let currentStart = openingMinutes; currentStart + totalDurationInMinutes <= closingMinutes; currentStart += SLOT_STEP_IN_MINUTES) {
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
    parseServiceIds(serviceIdsParam) {
        if (!serviceIdsParam) {
            throw new common_1.BadRequestException('Informe pelo menos um serviço em serviceIds.');
        }
        const serviceIds = serviceIdsParam
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean);
        if (serviceIds.length === 0) {
            throw new common_1.BadRequestException('Informe pelo menos um serviço em serviceIds.');
        }
        const hasInvalidId = serviceIds.some((id) => !mongoose_2.Types.ObjectId.isValid(id));
        if (hasInvalidId) {
            throw new common_1.BadRequestException('Um ou mais IDs de serviço são inválidos.');
        }
        return serviceIds;
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
};
exports.SchedulesService = SchedulesService;
exports.SchedulesService = SchedulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(1, (0, mongoose_1.InjectModel)(service_schema_1.BarberService.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        schedule_blocks_service_1.ScheduleBlocksService])
], SchedulesService);
//# sourceMappingURL=schedules.service.js.map