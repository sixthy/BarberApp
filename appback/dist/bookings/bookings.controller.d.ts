import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto, request: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/booking.schema").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/booking.schema").Booking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/booking.schema").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/booking.schema").Booking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
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
        status: import("./schemas/booking.schema").BookingStatus;
        __v: number;
        id: string;
    }[]>;
    findByDate(date: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/booking.schema").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/booking.schema").Booking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/booking.schema").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/booking.schema").Booking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/booking.schema").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/booking.schema").Booking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/booking.schema").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/booking.schema").Booking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    cancel(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/booking.schema").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/booking.schema").Booking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/booking.schema").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/booking.schema").Booking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    markNoShow(id: string): Promise<{
        message: string;
        booking: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/booking.schema").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/booking.schema").Booking & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/booking.schema").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/booking.schema").Booking & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
        blacklistEntry: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../blacklist/schemas/blacklist.schema").BlacklistEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../blacklist/schemas/blacklist.schema").BlacklistEntry & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../blacklist/schemas/blacklist.schema").BlacklistEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../blacklist/schemas/blacklist.schema").BlacklistEntry & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
}
