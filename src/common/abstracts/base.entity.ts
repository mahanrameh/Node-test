import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export class BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}