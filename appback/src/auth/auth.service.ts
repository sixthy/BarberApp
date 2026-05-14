import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);

    const accessToken = await this.generateToken(user);

    return {
      user,
      accessToken,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new BadRequestException('Email ou senha inválidos.');
    }

    const passwordIsValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new BadRequestException('Email ou senha inválidos.');
    }

    const userWithoutPassword = this.usersService.removePassword(user);
    const accessToken = await this.generateToken(userWithoutPassword);

    return {
      user: userWithoutPassword,
      accessToken,
    };
  }

  private async generateToken(user: any) {
    return this.jwtService.signAsync({
      sub: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }
}