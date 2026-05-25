import { HydratedDocument } from 'mongoose';
export type BarberServiceDocument = HydratedDocument<BarberService>;
export declare class BarberService {
    name: string;
    price: number;
    durationInMinutes: number;
    isActive: boolean;
    imageUrl: string;
}
export declare const BarberServiceSchema: import("mongoose").Schema<BarberService, import("mongoose").Model<BarberService, any, any, any, any, any, BarberService>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BarberService, import("mongoose").Document<unknown, {}, BarberService, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<BarberService & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, BarberService, import("mongoose").Document<unknown, {}, BarberService, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BarberService & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<number, BarberService, import("mongoose").Document<unknown, {}, BarberService, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BarberService & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    durationInMinutes?: import("mongoose").SchemaDefinitionProperty<number, BarberService, import("mongoose").Document<unknown, {}, BarberService, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BarberService & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, BarberService, import("mongoose").Document<unknown, {}, BarberService, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BarberService & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    imageUrl?: import("mongoose").SchemaDefinitionProperty<string, BarberService, import("mongoose").Document<unknown, {}, BarberService, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BarberService & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, BarberService>;
