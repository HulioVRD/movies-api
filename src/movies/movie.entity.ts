import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Comment } from '../comments/comment.entity';

@Entity()
export class Movie extends BaseEntity{ 
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  title: string;

  @Column()
  year: number;

  @Column('json')
  metadata: string;

  @OneToMany(type => Comment, comment => comment.movie, { eager: true })
  comments: Comment[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}