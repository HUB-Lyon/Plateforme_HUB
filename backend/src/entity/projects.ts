import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/* eslint-disable indent*/

@Entity('project')
export class Project {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'varchar' })
    image: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'bigint', nullable: false, default: 0 })
    leaderId: number;

    @Column({ type: 'bigint', array: true, default: '{}' })
    membersId: number[];

    @Column({ type: 'varchar', length: 255, nullable: false })
    status: string;
}