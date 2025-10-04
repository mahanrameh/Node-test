import { BaseEntity } from "src/common/abstracts/base.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity('tasks')
export class TaskEntity extends BaseEntity {
    @Column()
    title: string;
    @Column({nullable: true})
    caption: string
    @Column({nullable: true})
    link: string
    @Column()
    userId: number;
    @ManyToOne(() => UserEntity, user => user.tasks, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    user: UserEntity
}
