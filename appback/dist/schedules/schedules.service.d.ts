import { Model, Types } from 'mongoose';
import { BookingDocument } from '../bookings/schemas/booking.schema';
import { BarberServiceDocument } from '../services/schemas/service.schema';
import { ScheduleBlocksService } from '../schedule-blocks/schedule-blocks.service';
export declare class SchedulesService {
    private readonly bookingModel;
    private readonly serviceModel;
    private readonly scheduleBlocksService;
    constructor(bookingModel: Model<BookingDocument>, serviceModel: Model<BarberServiceDocument>, scheduleBlocksService: ScheduleBlocksService);
    findAvailableTimes(date: string, serviceIdsParam: string): Promise<{
        date: string;
        isClosed: boolean;
        message: string;
        availableTimes: never[];
        openingTime?: undefined;
        closingTime?: undefined;
        totalDurationInMinutes?: undefined;
        services?: undefined;
    } | {
        date: string;
        isClosed: boolean;
        openingTime: string;
        closingTime: string;
        totalDurationInMinutes: number;
        services: {
            id: Types.ObjectId;
            name: string;
            durationInMinutes: number;
            price: number;
        }[];
        availableTimes: {
            startTime: string;
            endTime: string;
        }[];
        message?: undefined;
    }>;
    private validateDate;
    private parseServiceIds;
    private getDayOfWeek;
    private timeToMinutes;
    private minutesToTime;
}
