import { Model, Types } from 'mongoose';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, BookingDocument, BookingStatus } from './schemas/booking.schema';
import { BarberServiceDocument } from '../services/schemas/service.schema';
import { BlacklistService } from '../blacklist/blacklist.service';
import { AuthUser } from '../auth/types/auth-user.type';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ScheduleBlocksService } from '../schedule-blocks/schedule-blocks.service';
export declare class BookingsService {
    private readonly bookingModel;
    private readonly serviceModel;
    private readonly blacklistService;
    private readonly scheduleBlocksService;
    constructor(bookingModel: Model<BookingDocument>, serviceModel: Model<BarberServiceDocument>, blacklistService: BlacklistService, scheduleBlocksService: ScheduleBlocksService);
    create(createBookingDto: CreateBookingDto, user: AuthUser): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Booking, {}, import("mongoose").DefaultSchemaOptions> & Booking & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Booking, {}, import("mongoose").DefaultSchemaOptions> & Booking & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    findAll(): Promise<{
        _id: string;
        serviceIds: string[];
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        serviceNames: string[];
        totalPrice: number;
        totalDurationInMinutes: number;
        date: string;
        startTime: string;
        endTime: string;
        status: BookingStatus;
        __v: number;
        id: string;
    }[]>;
    findByDate(date: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Booking, {}, import("mongoose").DefaultSchemaOptions> & Booking & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Booking, {}, import("mongoose").DefaultSchemaOptions> & Booking & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    cancel(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Booking, {}, import("mongoose").DefaultSchemaOptions> & Booking & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Booking, {}, import("mongoose").DefaultSchemaOptions> & Booking & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    markNoShow(id: string): Promise<{
        message: string;
        booking: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Booking, {}, import("mongoose").DefaultSchemaOptions> & Booking & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Booking, {}, import("mongoose").DefaultSchemaOptions> & Booking & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>;
        blacklistEntry: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../blacklist/schemas/blacklist.schema").BlacklistEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../blacklist/schemas/blacklist.schema").BlacklistEntry & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../blacklist/schemas/blacklist.schema").BlacklistEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../blacklist/schemas/blacklist.schema").BlacklistEntry & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>;
    }>;
    private validateBookingRules;
    private validateDate;
    private getDayOfWeek;
    private timeToMinutes;
    private minutesToTime;
    private addMinutesToTime;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Booking, {}, import("mongoose").DefaultSchemaOptions> & Booking & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Booking, {}, import("mongoose").DefaultSchemaOptions> & Booking & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    private validateNoShowCanBeMarked;
    private validateServiceIds;
    private validateTime;
}
