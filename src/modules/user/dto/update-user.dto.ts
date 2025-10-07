import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsString, IsEnum, Length } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'mahan_dev' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+989123456789' })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  username?: string;

  @ApiPropertyOptional({ example: 'mahanrame@gmail.com' })
  @IsOptional()
  @IsString()
  @Length(7, 20)
  phone?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}