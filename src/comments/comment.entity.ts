import { Entity, PrimaryGeneratedColumn, Column, Generated, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Movie } from "src/movies/movie.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Comment extends BaseEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({ type: String })
  @Column('text')
  text: string;

  @ManyToOne(type => Movie, movie => movie.comments, { eager: false })
  movie: Movie;

  @ApiProperty({ type: String })
  @CreateDateColumn()
  createdAt: string;

  @ApiProperty({ type: String })
  @UpdateDateColumn()
  updatedAt: string;
}