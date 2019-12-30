import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('Movies API')
    .setDescription('API used by Movies app')
    .setVersion('1.0')
    .addServer('http://localhost:5000', "Local development server")
    .addServer('https://vrd-movies-api.herokuapp.com/', "Production server")
    // .addTag('cats')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}
bootstrap();
