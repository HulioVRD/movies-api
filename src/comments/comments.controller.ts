import { Controller, Get, Post, Body, ParseUUIDPipe, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';
import { ApiTags, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { ErrorResponse } from '../errors/error-response.class';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) { };

  @Get()
  async getComments(): Promise<Comment[]> {
    return this.commentsService.getComments();
  } 

  @Get('/:uuid')
  @ApiNotFoundResponse({ description: "Comment not found.", type: ErrorResponse})
  async getCommentByUuid(
    @Param('uuid', ParseUUIDPipe) uuid: string
  ): Promise<Comment> {
      return this.commentsService.getCommentByUuid(uuid);
  } 

  @Post()
  @ApiNotFoundResponse({ description: "Movie identified by uuid not found.", type: ErrorResponse})
  @ApiBadRequestResponse({ description: "Bad request.", type: ErrorResponse})
  async createComment(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentsService.createComment(createCommentDto);
  }
}
