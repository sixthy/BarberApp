import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(helmet());


  const frontendUrls =
    configService.get<string>('FRONTEND_URLS') ??
    configService.get<string>('FRONTEND_URL') ??
    'http://localhost:3000';

  app.enableCors({
    origin: frontendUrls
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean),
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get<number>('PORT') ?? 3333;

  await app.listen(port);
}

bootstrap();
