/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

const globalPrefix = 'api' as const;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix(globalPrefix);

  setupSwagger(app);

  app.useGlobalPipes(new ValidationPipe({ enableDebugMessages: true }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

async function setupSwagger(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle('Dinos API')
    .setDescription('The API for our fullstack dinos application.')
    .setVersion('1.0')
    .addTag('dinos')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);
}

bootstrap();
