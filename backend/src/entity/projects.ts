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
    created_at: Date;

    @Column({ type: 'bigint', nullable: false })
    leader_id: number;

    @Column({ type: 'bigint', array: true, default: '{}' })
    members_id: number[];

    @Column({ type: 'varchar', length: 255, nullable: false })
    status: string;
}