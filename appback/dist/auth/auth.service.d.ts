import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            name: string;
            email: string;
            phone: string;
            role: import("../users/schemas/user.schema").UserRole;
            _id: import("mongoose").Types.ObjectId;
            __v: number;
        };
        accessToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            name: string;
            email: string;
            phone: string;
            role: import("../users/schemas/user.schema").UserRole;
            _id: import("mongoose").Types.ObjectId;
            __v: number;
        };
        accessToken: string;
    }>;
    private generateToken;
}
