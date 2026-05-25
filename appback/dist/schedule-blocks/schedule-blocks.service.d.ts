import { Model } from 'mongoose';
import { ScheduleBlock, ScheduleBlockDocument } from './schemas/schedule-block.schema';
import { CreateScheduleBlockDto } from './dto/create-schedule-block.dto';
export declare class ScheduleBlocksService {
    private readonly scheduleBlockModel;
    constructor(scheduleBlockModel: Model<ScheduleBlockDocument>);
    create(createScheduleBlockDto: CreateScheduleBlockDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ScheduleBlock, {}, import("mongoose").DefaultSchemaOptions> & ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ScheduleBlock, {}, import("mongoose").DefaultSchemaOptions> & ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ScheduleBlock, {}, import("mongoose").DefaultSchemaOptions> & ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ScheduleBlock, {}, import("mongoose").DefaultSchemaOptions> & ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findActiveByDate(date: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ScheduleBlock, {}, import("mongoose").DefaultSchemaOptions> & ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ScheduleBlock, {}, import("mongoose").DefaultSchemaOptions> & ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    reopen(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, ScheduleBlock, {}, import("mongoose").DefaultSchemaOptions> & ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, ScheduleBlock, {}, import("mongoose").DefaultSchemaOptions> & ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
