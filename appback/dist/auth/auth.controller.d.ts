import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    me(request: any): any;
}
