import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { ProfileDto } from './dto/profile.dto';
import { Gender } from './enum/gender.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationSolver, paginationGenerator } from 'src/common/utils/pagination.util';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';


@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @Inject(REQUEST) private request: Request,
  ) {}

 async createProfile(dto: ProfileDto, file?: Express.Multer.File) {
    const userId = (this.request as any).user?.id;
    if (!userId) throw new NotFoundException('User not authenticated');

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
    if (!user) throw new NotFoundException('User not found');


    if (file && !file.mimetype?.startsWith('image/')) {
      throw new BadRequestException('Uploaded file must be an image');
    }

    const imageBuffer = file ? file.buffer : user.profile?.image_profile ?? null;
    const imageMime = file ? file.mimetype : user.profile?.image_profile_mime ?? null;
    const imageName = file ? file.originalname : user.profile?.image_profile_name ?? null;

    let profile = user.profile;
    if (!profile) {
      profile = this.profileRepository.create({
        name: dto.name,
        bio: dto.bio,
        gender: dto.gender as Gender,
        birthday: dto.birthday,
        image_profile: imageBuffer,
        image_profile_mime: imageMime,
        image_profile_name: imageName,
        user,
      });
    }

    profile = await this.profileRepository.save(profile);
    user.profile = profile;
    await this.userRepository.save(user);

    
    return {
      id: profile.id,
      name: profile.name,
      bio: profile.bio,
      gender: profile.gender,
      birthday: profile.birthday,
      image_profile: {
        id: profile.id,
        mime: profile.image_profile_mime,
        name: profile.image_profile_name,
      },
    };
  }

  async downloadProfileImage(userId: number, res: Response) {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile || !profile.image_profile) {
      throw new NotFoundException('Image not found');
    }

    const buffer: Buffer = profile.image_profile as Buffer;
    const mime = profile.image_profile_mime ?? 'application/octet-stream';
    const originalName = profile.image_profile_name ?? `profile-${profile.id}`;

    res.setHeader('Content-Type', mime);
    res.setHeader('Content-Length', buffer.length.toString());
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(originalName)}"`
    );
    res.setHeader('Cache-Control', 'private, max-age=3600');

    return res.send(buffer);
  }

  async updateProfile(dto: ProfileDto, file?: Express.Multer.File) {
    const userId = (this.request as any).user?.id;
    if (!userId) throw new NotFoundException('User not authenticated');

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
    if (!user) throw new NotFoundException('User not found');

    if (file && !file.mimetype?.startsWith('image/')) {
      throw new BadRequestException('Uploaded file must be an image');
    }

    const imageBuffer = file ? file.buffer : user.profile?.image_profile ?? null;
    const imageMime = file ? file.mimetype : user.profile?.image_profile_mime ?? null;
    const imageName = file ? file.originalname : user.profile?.image_profile_name ?? null;

    let profile = user.profile;
    if (!profile) {
      profile = this.profileRepository.create({
        name: user.username,
        bio: dto.bio ?? null,
        gender: dto.gender as Gender ?? null,
        birthday: dto.birthday ?? null,
        image_profile: imageBuffer,
        image_profile_mime: imageMime,
        image_profile_name: imageName,
        user,
      });
    } else {
      profile.bio = dto.bio ?? profile.bio;
      profile.gender = dto.gender ? (dto.gender as Gender) : profile.gender;
      profile.birthday = dto.birthday ?? profile.birthday;
      if (file) {
        profile.image_profile = imageBuffer;
        profile.image_profile_mime = imageMime;
        profile.image_profile_name = imageName;
      }
    }

    profile = await this.profileRepository.save(profile);
    user.profile = profile;
    await this.userRepository.save(user);

    return {
      id: profile.id,
      name: profile.name,
      bio: profile.bio,
      gender: profile.gender,
      birthday: profile.birthday,
      image_profile: {
        id: profile.id,
        mime: profile.image_profile_mime,
        name: profile.image_profile_name,
      },
    };
  }
  
  async findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
  
async getUsers(params: PaginationDto & { search?: string; role?: string }) {
  const { page, limit, skip } = paginationSolver({
    page: params.page,
    limit: params.limit,
  });

  const query = this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.profile', 'profile');

  if (params.search) {
    const term = `%${params.search.trim()}%`;
    query.andWhere(
      '(user.username LIKE :term OR user.email LIKE :term OR user.phone LIKE :term OR profile.name LIKE :term)',
      { term }
    );
  }

  if (params.role) {
    query.andWhere('user.role = :role', { role: params.role });
  }

  query.orderBy('user.id', 'DESC')
    .skip(skip)
    .take(limit || 10);

  const [users, total] = await query.getManyAndCount();

  const result = users.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.role,
    created_at: (user as any).created_at ?? null,
    updated_at: (user as any).updated_at ?? null,
    profile: user.profile ? {
      id: user.profile.id,
      name: user.profile.name,
      bio: user.profile.bio,
      gender: user.profile.gender,
      birthday: user.profile.birthday,
      image: user.profile.image_profile_name ? {
        id: user.profile.id,
        name: user.profile.image_profile_name,
        mime: user.profile.image_profile_mime,
      } : null,
    } : null,
  }));

  return {
    meta: paginationGenerator(total, page, limit || 10),
    data: result,
  };
}


  async findUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      created_at: (user as any).created_at ?? null,
      updated_at: (user as any).updated_at ?? null,
      profile: user.profile ? {
        id: user.profile.id,
        name: user.profile.name,
        bio: user.profile.bio,
        gender: user.profile.gender,
        birthday: user.profile.birthday,
        image: user.profile.image_profile_name ? {
          id: user.profile.id,
          name: user.profile.image_profile_name,
          mime: user.profile.image_profile_mime,
        } : null,
      } : null,
    };
  }

  async UpdateUser(userId: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['profile'] });
    if (!user) throw new NotFoundException('User not found');

    if (dto.email && dto.email !== user.email) {
      const exists = await this.userRepository.findOne({ where: { email: dto.email } });
      if (exists) throw new BadRequestException('Email already in use');
      user.email = dto.email;
    }

    if (dto.username && dto.username !== user.username) {
      const exists = await this.userRepository.findOne({ where: { username: dto.username } });
      if (exists) throw new BadRequestException('Username already in use');
      user.username = dto.username;
      if (user.profile) user.profile.name = dto.username;
    }

    if (dto.phone && dto.phone !== user.phone) {
      const exists = await this.userRepository.findOne({ where: { phone: dto.phone } });
      if (exists) throw new BadRequestException('Phone already in use');
      user.phone = dto.phone;
    }


    await this.userRepository.save(user);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profile: user.profile ? {
        id: user.profile.id,
        name: user.profile.name,
        bio: user.profile.bio,
      } : null,
    };
  }

  async changeUserRole(id: number, newRole: Role, performedById?: number) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException('User not found');

    if (performedById && performedById === id) {
      throw new ForbiddenException('Admin cannot change their own role');
    }

    if (user.role === newRole) {
      throw new BadRequestException('User already has the specified role');
    }

    user.role = newRole;
    await this.userRepository.save(user);

    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }

  async removeUser(id: number, performedById?: number) {
    if (performedById && performedById === id) {
      throw new ForbiddenException('Admin cannot remove their own account');
    }

    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.delete(id);

    return { id: id, removed: true };
  }
}


