import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) { }

    async create(createUserDto: CreateUserDto) {
        const emailAlreadyExists = await this.userModel.findOne({
            email: createUserDto.email.toLowerCase(),
        });

        if (emailAlreadyExists) {
            throw new BadRequestException('Este email já está em uso.');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const user = await this.userModel.create({
            ...createUserDto,
            email: createUserDto.email.toLowerCase(),
            password: hashedPassword,
        });

        return this.removePassword(user);
    }

    async findAll() {
        const users = await this.userModel.find().sort({ createdAt: -1 }).exec();

        return users.map((user) => this.removePassword(user));
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({
            email: email.toLowerCase(),
        });
    }

    async findById(id: string) {
        const user = await this.userModel.findById(id).exec();

        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        return this.removePassword(user);
    }

    removePassword(user: UserDocument) {
        const userObject = user.toObject();

        const { password, ...userWithoutPassword } = userObject;

        return userWithoutPassword;
    }
}
