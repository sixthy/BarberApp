import { HydratedDocument } from 'mongoose';
export type BlacklistDocument = HydratedDocument<BlacklistEntry>;
export declare class BlacklistEntry {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    noShowCount: number;
    isBlocked: boolean;
    blockedUntil?: Date;
    lastNoShowAt?: Date;
    reason: string;
}
export declare const BlacklistSchema: import("mongoose").Schema<BlacklistEntry, import("mongoose").Model<BlacklistEntry, any, any, any, any, any, BlacklistEntry>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BlacklistEntry, import("mongoose").Document<unknown, {}, BlacklistEntry, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<BlacklistEntry & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    customerName?: import("mongoose").SchemaDefinitionProperty<string, BlacklistEntry, import("mongoose").Document<unknown, {}, BlacklistEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlacklistEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    customerEmail?: import("mongoose").SchemaDefinitionProperty<string, BlacklistEntry, import("mongoose").Document<unknown, {}, BlacklistEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlacklistEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    customerPhone?: import("mongoose").SchemaDefinitionProperty<string, BlacklistEntry, import("mongoose").Document<unknown, {}, BlacklistEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlacklistEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    noShowCount?: import("mongoose").SchemaDefinitionProperty<number, BlacklistEntry, import("mongoose").Document<unknown, {}, BlacklistEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlacklistEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isBlocked?: import("mongoose").SchemaDefinitionProperty<boolean, BlacklistEntry, import("mongoose").Document<unknown, {}, BlacklistEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlacklistEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    blockedUntil?: import("mongoose").SchemaDefinitionProperty<Date | undefined, BlacklistEntry, import("mongoose").Document<unknown, {}, BlacklistEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlacklistEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastNoShowAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, BlacklistEntry, import("mongoose").Document<unknown, {}, BlacklistEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlacklistEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<string, BlacklistEntry, import("mongoose").Document<unknown, {}, BlacklistEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BlacklistEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, BlacklistEntry>;
