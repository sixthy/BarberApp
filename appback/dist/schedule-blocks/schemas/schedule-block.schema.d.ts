import { HydratedDocument } from 'mongoose';
export type ScheduleBlockDocument = HydratedDocument<ScheduleBlock>;
export declare class ScheduleBlock {
    date: string;
    type: string;
    startTime?: string;
    endTime?: string;
    reason: string;
    isActive: boolean;
}
export declare const ScheduleBlockSchema: import("mongoose").Schema<ScheduleBlock, import("mongoose").Model<ScheduleBlock, any, any, any, any, any, ScheduleBlock>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ScheduleBlock, import("mongoose").Document<unknown, {}, ScheduleBlock, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ScheduleBlock & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    date?: import("mongoose").SchemaDefinitionProperty<string, ScheduleBlock, import("mongoose").Document<unknown, {}, ScheduleBlock, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, ScheduleBlock, import("mongoose").Document<unknown, {}, ScheduleBlock, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    startTime?: import("mongoose").SchemaDefinitionProperty<string | undefined, ScheduleBlock, import("mongoose").Document<unknown, {}, ScheduleBlock, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    endTime?: import("mongoose").SchemaDefinitionProperty<string | undefined, ScheduleBlock, import("mongoose").Document<unknown, {}, ScheduleBlock, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<string, ScheduleBlock, import("mongoose").Document<unknown, {}, ScheduleBlock, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, ScheduleBlock, import("mongoose").Document<unknown, {}, ScheduleBlock, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ScheduleBlock & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ScheduleBlock>;
