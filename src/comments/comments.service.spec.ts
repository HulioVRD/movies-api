import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { CommentRepository } from './comment.repository';
import { MoviesService } from '../movies/movies.service';
import { NotFoundException } from '@nestjs/common';

const commentMock = {
  uuid: "127acb6f-8ada-435c-91c3-50a77f2bd111",
  movieUuid: "127acb6f-8ada-435c-91c3-50a77f2bd342",
  text: 'Guardians of the Galaxy Vol. 2',
}

const mockMovieRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  createMovie: jest.fn(),
});

const mockCommentRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  createComment: jest.fn(),
});

const mockMoviesService = () => ({
  getMovieByUuid: jest.fn(),
});

describe('CommentsService', () => {
  let commentsService;
  let commentRepository;
  let moviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: MoviesService, useFactory: mockMoviesService },
        { provide: CommentRepository, useFactory: mockCommentRepository }
      ],
    })
    .compile();

    commentsService = module.get<CommentsService>(CommentsService);
    commentRepository = module.get<CommentRepository>(CommentRepository);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(commentsService).toBeDefined();
  });

  describe('getComments', () => {
    it('should get all comments from the repository', async () => {
      let mockedArray = [commentMock];

      commentRepository.find.mockResolvedValue(mockedArray);

      const result = await commentsService.getComments();

      expect(result).toEqual(mockedArray);
    });                  
  })

  describe('getCommentByUuid', () => {
    it('should throw an error for non existing comment', async () => {
      commentRepository.findOne.mockResolvedValue(null);

      expect(commentsService.getCommentByUuid("test")).rejects.toThrow(NotFoundException);
    });  
    
    it('should return existing comment', async () => {
      commentRepository.findOne.mockResolvedValue(commentMock);

      const result = await commentsService.getCommentByUuid(commentMock.uuid);
      
      expect(result).toEqual(commentMock);
    });
  })

  describe('createComment', () => {
    it('should throw an error for non existing movie', async () => {
      commentRepository.createComment.mockResolvedValue(null);
      moviesService.getMovieByUuid.mockImplementation(() => {
        throw new NotFoundException();
      });

      expect(commentsService.createComment(commentMock)).rejects.toThrow(NotFoundException);
    });  

    it('should create and return comment for existing movie', async () => {
      commentRepository.createComment.mockResolvedValue(commentMock);
      moviesService.getMovieByUuid.mockResolvedValue({});

      const result = await commentRepository.createComment(commentMock);

      expect(result).toEqual(commentMock);
    }); 
  })
});
