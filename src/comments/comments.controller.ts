import { Controller, Get, Post, Body, ParseUUIDPipe, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) { };

  @Get()
  async getComments(): Promise<Comment[]> {
    return this.commentsService.getComments();
  } 

  @Get('/:uuid')
  async getCommentByUuid(
    @Param('uuid', ParseUUIDPipe) uuid: string
  ): Promise<Comment> {
      return this.commentsService.getCommentByUuid(uuid);
  } 

  @Post()
  async createComment(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentsService.createComment(createCommentDto);
  }
}
