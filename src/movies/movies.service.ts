import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieRepository } from './movie.repository';
import { Movie } from './movie.entity';
import axios from 'axios';

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(MovieRepository)
        private movieRepository: MovieRepository,
    ) {}


    async getMovies(): Promise<Movie[]> {
      return this.movieRepository.find();
    }

    async getMovieByUuid(uuid: string): Promise<Movie> {
      const found = await this.movieRepository.findOne({ where: { uuid } });

      if (!found) {
        throw new NotFoundException(`Movie with uuid "${uuid}" not found`);
      }
  
      return found;
    }

    async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
        let { title, year } = createMovieDto;
        title = encodeURIComponent(title);
        
        const getMoviesDetailsResult = await axios.get(`http://www.omdbapi.com/?t=${title}&y=${year}&apikey=${process.env.OMDBAPI_KEY}`);

        const metadata = getMoviesDetailsResult.data;

        if (metadata.Error) {
          throw new BadRequestException(metadata.Error);
        }

        delete metadata.Title;
        delete metadata.Year;
        delete metadata.Response;

        return this.movieRepository.createMovie(createMovieDto, JSON.stringify(metadata));
    }
}
