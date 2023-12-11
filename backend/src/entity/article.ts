import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/* eslint-disable indent*/

@Entity('article')
export class Article {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    content: string;
}