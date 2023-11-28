import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/* eslint-disable indent*/

@Entity('user')
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    email: string;

    @Column({ type: 'varchar', nullable: false })
    token: string;

    @Column({ type: 'boolean', nullable: false })
    admin: boolean;
}