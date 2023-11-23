import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('inventory')
export class Inventory {
    @PrimaryGeneratedColumn({ type: 'bigint' })
        id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
        name: string;

    @Column({ type: 'varchar' })
        image: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
        category: string;

    @Column({ type: 'bigint', nullable: false })
        quantity: number;

    @Column({ type: 'boolean', nullable: false, default: true })
        available: boolean;

    @Column({ type: 'text', nullable: false })
        description: string;
}