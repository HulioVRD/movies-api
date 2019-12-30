import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './movie.entity';

@Controller('movies')
export class MoviesController {
    constructor(private moviesService: MoviesService) { };

    @Get()
    async getMovies(): Promise<Movie[]> {
        return this.moviesService.getMovies();
    } 

    @Get('/:uuid')
    async getMovieByUuid(
      @Param('uuid', ParseUUIDPipe) uuid: string
    ): Promise<Movie> {
        return this.moviesService.getMovieByUuid(uuid);
    } 

    @Post()
    async createMovie(
      @Body() createMovieDto: CreateMovieDto
    ): Promise<Movie> {
        return this.moviesService.createMovie(createMovieDto);
    }
}
