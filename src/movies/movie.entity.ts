import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Comment } from '../comments/comment.entity';
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Movie extends BaseEntity { 
  
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ApiProperty({ type: String })
  @Column()
  title: string;

  @ApiProperty({ type: Number })
  @Column()
  year: number;

  @ApiProperty({ type: String })
  @Column('json')
  metadata: string;

  @ApiProperty({ type: [Comment] })
  @OneToMany(type => Comment, comment => comment.movie, { eager: true })
  comments: Comment[];

  @ApiProperty({ type: String })
  @CreateDateColumn()
  createdAt: string;

  @ApiProperty({ type: String })
  @UpdateDateColumn()
  updatedAt: string;
}