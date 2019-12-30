import { Movie } from "./movie.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { InternalServerErrorException, Logger } from "@nestjs/common";

@EntityRepository(Movie)
export class MovieRepository extends Repository<Movie> {
  private logger = new Logger('MovieRepository');

  async createMovie(createMovieDto: CreateMovieDto, metadata: string): Promise<Movie> {
    const { title, year } = createMovieDto;

    const movie = new Movie();

    movie.title = title;
    movie.year = year;
    movie.metadata = metadata;

    try {
      await movie.save();
    } catch (error) {
      this.logger.error(`Failed to create a movie "${movie.title}". Data: ${createMovieDto}`, error.stack);
      throw new InternalServerErrorException();
    }

    return movie;
  }
}