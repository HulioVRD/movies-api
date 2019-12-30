import { Entity, PrimaryGeneratedColumn, Column, Generated, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Movie } from "src/movies/movie.entity";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column('text')
  text: string;

  @ManyToOne(type => Movie, movie => movie.comments, { eager: false })
  movie: Movie;
  
  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}