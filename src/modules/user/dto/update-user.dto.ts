import { IsOptional, IsEmail, IsString, IsEnum, Length } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  username?: string;

  @IsOptional()
  @IsString()
  @Length(7, 20)
  phone?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}