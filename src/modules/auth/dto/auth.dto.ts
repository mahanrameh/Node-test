import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, IsEmail, Matches } from 'class-validator';

export class AuthRegisterDto {
  @ApiProperty()
  @IsString()
  @Length(3, 50)
  username: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\+?98[0-9]{10}$/, { message: 'phone must be in +98XXXXXXXXXX format' })
  phone?: string;

  @ApiProperty()
  @IsString()
  @Length(8, 128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
    message: 'Password must be at least 8 characters and contain both uppercase and lowercase letters',
  })
  password: string;
}

export class AuthLoginDto {
  @ApiProperty()
  @IsString()
  @Length(3, 50)
  username: string;

  @ApiProperty()
  @IsString()
  @Length(8, 128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
    message: 'Password must be at least 8 characters and contain both uppercase and lowercase letters',
  })
  password: string;
}

export class CheckOtpDto {
    @ApiProperty()
    @IsString()
    @Length(5, 5)
    code: string;
}