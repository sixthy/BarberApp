import { ScheduleBlocksService } from './schedule-blocks.service';
import { CreateScheduleBlockDto } from './dto/create-schedule-block.dto';
export declare class ScheduleBlocksController {
    private readonly scheduleBlocksService;
    constructor(scheduleBlocksService: ScheduleBlocksService);
    create(createScheduleBlockDto: CreateScheduleBlockDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/schedule-block.schema").ScheduleBlock, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/schedule-block.schema").ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/schedule-block.schema").ScheduleBlock, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/schedule-block.schema").ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/schedule-block.schema").ScheduleBlock, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/schedule-block.schema").ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/schedule-block.schema").ScheduleBlock, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/schedule-block.schema").ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    reopen(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/schedule-block.schema").ScheduleBlock, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/schedule-block.schema").ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/schedule-block.schema").ScheduleBlock, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/schedule-block.schema").ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
