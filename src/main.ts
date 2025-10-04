import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerConfigInit } from './configs/swagger.config';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app);
  app.use(cookieParser(process.env.COOKIE_SECRET));
  const PORT = process.env.PORT;
  await app.listen(PORT ?? 3000, () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`swagger: http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
