import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:8080',
  });

  // Validateur
  app.useGlobalPipes(
    new ValidationPipe({
      //toutes les donnée en plus des attributs prédéfinis dans le DTO ne sont pas pris en compte
      whitelist: true,
    }),
  );

  await app.listen(3001);
}
bootstrap();
