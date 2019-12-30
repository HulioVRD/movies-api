import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module';
import { CommentsModule } from './comments/comments.module';

import * as morgan from 'morgan';

@Module({
  imports: [TypeOrmModule.forRoot(), MoviesModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(morgan('dev'))
      .forRoutes('/')
  }
}
