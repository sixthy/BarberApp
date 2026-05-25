import { BlacklistService } from './blacklist.service';
export declare class BlacklistController {
    private readonly blacklistService;
    constructor(blacklistService: BlacklistService);
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/blacklist.schema").BlacklistEntry, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/blacklist.schema").BlacklistEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/blacklist.schema").BlacklistEntry, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/blacklist.schema").BlacklistEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findBlocked(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/blacklist.schema").BlacklistEntry, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/blacklist.schema").BlacklistEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/blacklist.schema").BlacklistEntry, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/blacklist.schema").BlacklistEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    unblock(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/blacklist.schema").BlacklistEntry, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/blacklist.schema").BlacklistEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/blacklist.schema").BlacklistEntry, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/blacklist.schema").BlacklistEntry & {
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
    }>;
}
