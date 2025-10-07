import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../modules/user/entities/user.entity';
import { TaskEntity } from 'src/modules/task/entities/task.entity';
import { ProfileEntity } from 'src/modules/user/entities/profile.entity';

export function TypeOrmConfig(): TypeOrmModuleOptions {
  const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env;
  return {
    type: 'mysql',
    host: DB_HOST,
    port: parseInt(DB_PORT || '3306', 10),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: false, //! Only in development env
    autoLoadEntities: false,
    entities: [UserEntity, TaskEntity, ProfileEntity], 
  };
}