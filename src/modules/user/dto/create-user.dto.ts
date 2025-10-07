import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsEmail, IsPhoneNumber, MinLength, IsIn, IsInt } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @ApiPropertyOptional({ example: 'mahan_dev' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: '+989123456789' })
  @IsOptional()
  @IsPhoneNumber('IR') 
  phone?: string;

  @ApiPropertyOptional({ example: 'mahanrame@gmail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ enum: Role, example: Role.USER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}