import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserEntity } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]) 
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, TokenService],
  exports: [AuthService, JwtService, TokenService]
})
export class AuthModule {}