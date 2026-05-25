import { SchedulesService } from './schedules.service';
export declare class SchedulesController {
    private readonly schedulesService;
    constructor(schedulesService: SchedulesService);
    findAvailableTimes(date: string, serviceIds: string): Promise<{
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
            id: import("mongoose").Types.ObjectId;
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
}
