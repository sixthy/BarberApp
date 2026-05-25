import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
export declare class UsersService {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: CreateUserDto): Promise<{
        name: string;
        email: string;
        phone: string;
        role: import("./schemas/user.schema").UserRole;
        _id: import("mongoose").Types.ObjectId;
        __v: number;
    }>;
    findAll(): Promise<{
        name: string;
        email: string;
        phone: string;
        role: import("./schemas/user.schema").UserRole;
        _id: import("mongoose").Types.ObjectId;
        __v: number;
    }[]>;
    findByEmail(email: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User, {}, import("mongoose").DefaultSchemaOptions> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, User, {}, import("mongoose").DefaultSchemaOptions> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    findById(id: string): Promise<{
        name: string;
        email: string;
        phone: string;
        role: import("./schemas/user.schema").UserRole;
        _id: import("mongoose").Types.ObjectId;
        __v: number;
    }>;
    removePassword(user: UserDocument): {
        name: string;
        email: string;
        phone: string;
        role: import("./schemas/user.schema").UserRole;
        _id: import("mongoose").Types.ObjectId;
        __v: number;
    };
}
