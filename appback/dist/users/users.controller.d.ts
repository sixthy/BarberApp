import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        name: string;
        email: string;
        phone: string;
        role: import("./schemas/user.schema").UserRole;
        _id: import("mongoose").Types.ObjectId;
        __v: number;
    }[]>;
    findById(id: string): Promise<{
        name: string;
        email: string;
        phone: string;
        role: import("./schemas/user.schema").UserRole;
        _id: import("mongoose").Types.ObjectId;
        __v: number;
    }>;
}
