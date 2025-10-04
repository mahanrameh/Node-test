import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TypeOrmConfig } from 'src/configs/typeorm.config';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { TaskModule } from '../task/task.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env')
    }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    UserModule,
    AuthModule,
    TaskModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
