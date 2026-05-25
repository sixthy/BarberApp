import { Model, Types } from 'mongoose';
import { BlacklistDocument, BlacklistEntry } from './schemas/blacklist.schema';
type RegisterNoShowData = {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
};
export declare class BlacklistService {
    private readonly blacklistModel;
    private readonly maxNoShows;
    private readonly blockDays;
    constructor(blacklistModel: Model<BlacklistDocument>);
    checkClientCanBook(customerEmail: string, customerPhone: string): Promise<boolean>;
    registerNoShow(data: RegisterNoShowData): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, BlacklistEntry, {}, import("mongoose").DefaultSchemaOptions> & BlacklistEntry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, BlacklistEntry, {}, import("mongoose").DefaultSchemaOptions> & BlacklistEntry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, BlacklistEntry, {}, import("mongoose").DefaultSchemaOptions> & BlacklistEntry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, BlacklistEntry, {}, import("mongoose").DefaultSchemaOptions> & BlacklistEntry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    findBlocked(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, BlacklistEntry, {}, import("mongoose").DefaultSchemaOptions> & BlacklistEntry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, BlacklistEntry, {}, import("mongoose").DefaultSchemaOptions> & BlacklistEntry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    unblock(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, BlacklistEntry, {}, import("mongoose").DefaultSchemaOptions> & BlacklistEntry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, BlacklistEntry, {}, import("mongoose").DefaultSchemaOptions> & BlacklistEntry & {
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
    }>;
    private addDays;
}
export {};
