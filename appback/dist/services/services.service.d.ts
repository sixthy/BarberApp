import { Model, Types } from 'mongoose';
import { BarberService, BarberServiceDocument } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesService {
    private readonly serviceModel;
    constructor(serviceModel: Model<BarberServiceDocument>);
    create(createServiceDto: CreateServiceDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, BarberService, {}, import("mongoose").DefaultSchemaOptions> & BarberService & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, BarberService, {}, import("mongoose").DefaultSchemaOptions> & BarberService & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, BarberService, {}, import("mongoose").DefaultSchemaOptions> & BarberService & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, BarberService, {}, import("mongoose").DefaultSchemaOptions> & BarberService & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    findActive(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, BarberService, {}, import("mongoose").DefaultSchemaOptions> & BarberService & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, BarberService, {}, import("mongoose").DefaultSchemaOptions> & BarberService & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, BarberService, {}, import("mongoose").DefaultSchemaOptions> & BarberService & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, BarberService, {}, import("mongoose").DefaultSchemaOptions> & BarberService & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    update(id: string, updateServiceDto: UpdateServiceDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, BarberService, {}, import("mongoose").DefaultSchemaOptions> & BarberService & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, BarberService, {}, import("mongoose").DefaultSchemaOptions> & BarberService & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    remove(id: string): Promise<{
        message: string;
        service: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, BarberService, {}, import("mongoose").DefaultSchemaOptions> & BarberService & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, BarberService, {}, import("mongoose").DefaultSchemaOptions> & BarberService & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>;
    }>;
}
