import { Entity, PrimaryGeneratedColumn, Column, Generated, BaseEntity } from "typeorm";

@Entity()
export class Movie extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    @Generated('uuid')
    uuid: string;

    @Column()
    title: string;

    @Column()
    year: number;

    @Column('json')
    metadata: string;
}