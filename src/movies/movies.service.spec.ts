import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { MovieRepository } from './movie.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import axios from 'axios';

const goodMovieMock1 = {
  uuid: "127acb6f-8ada-435c-91c3-50a77f2bd342",
  title: 'Guardians of the Galaxy Vol. 2',
  year: 2017
}

const goodMovieMock2 = {
  uuid: "127acb6f-8ada-435c-91c3-50a77f2bd383",
  title: 'No Country for Old Man',
  year: 2007
}

const badMovieMock = {
  uuid: "127acb6f-8ada-435c-91c3-50a77f2bd313",
  title: 'Guardians of the Good Attitude Vol. 2',
  year: 1017
}

const mockMovieRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  createMovie: jest.fn(),
});

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MoviesService', () => {
  let moviesService;
  let movieRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: MovieRepository, useFactory: mockMovieRepository }
      ],
    }).compile();

    moviesService = module.get<MoviesService>(MoviesService);
    movieRepository = module.get<MovieRepository>(MovieRepository);
  });

  it('should be defined', () => {
    expect(moviesService).toBeDefined();
  });

  describe('getMovies', () => {
    it('should get all movies from the repository', async () => {
      let mockedArray = [goodMovieMock1, goodMovieMock2];

      movieRepository.find.mockResolvedValue(mockedArray);

      const result = await moviesService.getMovies();

      expect(result).toEqual(mockedArray);
    });                  
  })

  describe('getMovieByUuid', () => {
    it('should throw an error for non existing movie', async () => {
      movieRepository.findOne.mockResolvedValue(null);

      expect(moviesService.getMovieByUuid("test")).rejects.toThrow(NotFoundException);
    });  
    
    it('should return existing movie', async () => {
      movieRepository.findOne.mockResolvedValue(goodMovieMock1);

      const result = await moviesService.getMovieByUuid(goodMovieMock1.uuid);
      
      expect(result).toEqual(goodMovieMock1);
    });
  })

  describe('createMovie', () => {
    it('should throw an error for non existing movie', async () => {
      movieRepository.createMovie.mockResolvedValue(null);
      mockedAxios.get.mockResolvedValue({
        data: {
          Error: "bad things"}
        });

      expect(moviesService.createMovie(badMovieMock)).rejects.toThrow(BadRequestException);
    });  

    it('should create and return existing movie', async () => {
      const mockedData = {
        ...goodMovieMock1,
        metadata: {
          dummy: "value"
        }
      };
      movieRepository.createMovie.mockResolvedValue(mockedData);

      mockedAxios.get.mockResolvedValue({
        data: {
          Title: "value",
          Year: "value",
          Response: "value",
          dummy: "value" 
        }
      });

      const result = await moviesService.createMovie(goodMovieMock1);

      expect(result).toEqual(mockedData);
    }); 
  })
});
