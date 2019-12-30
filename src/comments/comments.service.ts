import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentRepository } from './comment.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
    private moviesService: MoviesService,
  ) {}


  async getComments(): Promise<Comment[]> {
    return await this.commentRepository.find({});
  }

  async getCommentByUuid(uuid: string): Promise<Comment> {
    const found = await this.commentRepository.findOne({ where: { uuid } });

    if (!found) {
      throw new NotFoundException(`Comment with uuid "${uuid}" not found`);
    }

    return found;
  }

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { movieUuid } = createCommentDto;

    const movie = await this.moviesService.getMovieByUuid(movieUuid);

    return this.commentRepository.createComment(createCommentDto, movie);
  }
}
