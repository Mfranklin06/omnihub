import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.setGlobalPrefix('api');

  await app.listen(3001);
  console.log('🚀 Backend rodando em http://localhost:3001');
  console.log('📚 API: http://localhost:3001/api');
}
bootstrap();