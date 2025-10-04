import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';
import { TokenService } from '../auth/token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProfileEntity]),
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, AuthGuard, TokenService, JwtService],
  exports: [UserService],
})
export class UserModule {}