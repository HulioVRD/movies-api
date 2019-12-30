import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module';
import { CommentsModule } from './comments/comments.module';

import * as morgan from 'morgan';

@Module({
  imports: [TypeOrmModule.forRoot(), MoviesModule, CommentsModule],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(morgan('dev'))
      .forRoutes('/')
  }
}
