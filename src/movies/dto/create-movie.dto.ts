import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateMovieDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    year: number;    
}