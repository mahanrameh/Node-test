import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe, Res, Put, UseGuards, Query, Req, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileDto } from './dto/profile.dto';
import { Response } from 'express';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('profile')
  @UseInterceptors(FileInterceptor('image_profile'))
  async createProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ProfileDto,
  ) {
    return this.userService.createProfile(dto, file);
  }

  @Get('profile/image/download/:userId')
  async downloadProfileImage(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    return this.userService.downloadProfileImage(userId, res);
  }

  @Put('profile/update')
  @Roles(Role.USER, Role.ADMIN)
  @UseInterceptors(FileInterceptor('image_profile'))
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ProfileDto,
  ) {
    return this.userService.updateProfile(dto, file);
  }


  @Get('allUsers')
  @Pagination()
  @Roles(Role.ADMIN)
  async listUsers(
    paginationDto: PaginationDto,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.userService.getUsers({ ...paginationDto, search, role });
  }

  @Get('users/:id')
  @Roles(Role.ADMIN)
  async findOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserById(id);
  }

  @Put('users/update/:id')
  @Roles(Role.ADMIN)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.UpdateUser(id, dto);
  }

@Put('users/:id/role')
@Roles(Role.ADMIN)
async changeUserRole(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: CreateUserDto,
  @Req() req: Request,
) {
  const role = dto.role;
  if (!role) throw new BadRequestException('role is required');
  const performedById = (req as any).user?.id;
  return this.userService.changeUserRole(id, role, performedById);
}

  @Delete('users/:id')
  @Roles(Role.ADMIN)
  async removeUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const performedById = (req as any).user?.id;
    return this.userService.removeUser(id, performedById);
  }
}
