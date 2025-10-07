import { BadRequestException, ConflictException, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user/entities/user.entity';
import { TokenService } from './token.service';
import { AuthRegisterDto } from './dto/auth.dto';
import { AuthLoginDto } from './dto/auth.dto';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { PublicMessage, BadRequestMessage } from 'src/common/enums/message.enum';
import { Role } from 'src/common/enums/role.enum';
import { plainToInstance } from 'class-transformer';


@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @Inject(REQUEST) private request: Request,
    private tokenService: TokenService,
  ) {}

  async register(dto: AuthRegisterDto, res: Response) {
    const username = this.normalizeUsername(dto.username);
    const email = dto.email?.trim().toLowerCase() ?? null;
    const phone = dto.phone?.trim() ?? null;

    if (!username || !dto.password) {
      throw new BadRequestException(BadRequestMessage.InValidRegisterData);
    }

    await this.ensureUniqueFields(username, email, phone);

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const userCount = await this.userRepository.count();
    const role = userCount === 0 ? Role.ADMIN : Role.USER;

    let user = this.userRepository.create(
      plainToInstance(UserEntity, {
        username,
        email,
        phone,
        password: passwordHash,
        role,
      })
    );

    user = await this.userRepository.save(user);

    const accessToken = this.tokenService.createAccessToken({ userId: user.id });

    res.cookie(CookieKeys.ACCESS, accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    return {
      message: PublicMessage.LoggedIn,
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async login(dto: AuthLoginDto, res: Response) {
    const username = this.normalizeUsername(dto.username);
    const password = dto.password;
    if (!username || !password) throw new BadRequestException(BadRequestMessage.InValidLoginData);

    const user = await this.userRepository.findOneBy({ username });
    if (!user || !user.password) throw new UnauthorizedException(BadRequestMessage.InValidLoginData);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException(BadRequestMessage.InValidLoginData);

    const accessToken = this.tokenService.createAccessToken({ userId: user.id });

    res.cookie(CookieKeys.ACCESS, accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    return {
      message: PublicMessage.LoggedIn,
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    };
  }

  async accessTokenValidator(token: string) {
    const { userId } = this.tokenService.verifyAccessToken(token);
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException(BadRequestMessage.InValidLoginData);
    return user;
  }

  async ensureUniqueFields(username: string, email: string | null, phone: string | null) {
    const byUsername = await this.userRepository.findOneBy({ username });
    if (byUsername) throw new ConflictException('username already exists');

    if (email) {
      const byEmail = await this.userRepository.findOneBy({ email });
      if (byEmail) throw new ConflictException('email already exists');
    }

    if (phone) {
      const byPhone = await this.userRepository.findOneBy({ phone });
      if (byPhone) throw new ConflictException('phone already exists');
    }

    return true;
  }

  normalizeUsername(username: string) {
    return username?.trim().toLowerCase();
  }
}