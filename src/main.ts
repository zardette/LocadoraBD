import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const fs = require('fs');
  const httpsOptions = {
    key: fs.readFileSync('./secrets/create-cert-key.pem'),
    cert: fs.readFileSync('./secrets/create-cert.pem'),
  };


  //const app = await NestFactory.create(AppModule,{httpsOptions});

  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )

  const config = new DocumentBuilder()
    .setTitle('API Filmes e series - StreamingAPI')
    .setDescription(
      'A presente API tem como objetivo simular cadastros possiveis para uma API de Stream de filmes e series',
    )
    .setVersion('1.0')
    .addTag('usuario')
    .addTag('filme')
    .addTag('serie')
    .addTag('pessoa')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  useContainer(app.select(AppModule),{fallbackOnErrors:true})
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
