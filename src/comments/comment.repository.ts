import { EntityRepository, Repository } from "typeorm";
import { InternalServerErrorException, Logger } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Comment } from './comment.entity';
import { Movie } from "../movies/movie.entity";

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  private logger = new Logger('MovieRepository');

  async createComment(createCommentDto: CreateCommentDto, movie: Movie): Promise<Comment> {
    const { text } = createCommentDto;

    const comment = new Comment();

    comment.movie = movie;
    comment.text = text;

    try {
      await comment.save();
    } catch (error) {
      this.logger.error(`Failed to create a comment for movie "${movie.title}". Data: ${createCommentDto}`, error.stack);
      throw new InternalServerErrorException();
    }

    delete comment.movie;

    return comment;
  }
}