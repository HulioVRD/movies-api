import { IsString, IsNumber, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
    @IsUUID()
    movieUuid: string;

    @IsString()
    @IsNotEmpty()
    text: string;    
}