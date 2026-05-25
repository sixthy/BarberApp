import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(createServiceDto: CreateServiceDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/service.schema").BarberService, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/service.schema").BarberService & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/service.schema").BarberService, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/service.schema").BarberService & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/service.schema").BarberService, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/service.schema").BarberService & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/service.schema").BarberService, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/service.schema").BarberService & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findActive(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/service.schema").BarberService, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/service.schema").BarberService & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/service.schema").BarberService, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/service.schema").BarberService & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/service.schema").BarberService, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/service.schema").BarberService & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/service.schema").BarberService, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/service.schema").BarberService & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, updateServiceDto: UpdateServiceDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/service.schema").BarberService, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/service.schema").BarberService & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/service.schema").BarberService, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/service.schema").BarberService & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string): Promise<{
        message: string;
        service: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/service.schema").BarberService, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/service.schema").BarberService & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/service.schema").BarberService, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/service.schema").BarberService & {
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
