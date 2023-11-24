import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/* eslint-disable indent*/

@Entity('user')
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    token: string;

    @Column({ type: 'bigint', array: true, default: '{}' })
    projects_id: number[];

    @Column({ type: 'boolean', nullable: false })
    role: boolean;
}