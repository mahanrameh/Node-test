import { BaseEntity } from "src/common/abstracts/base.entity";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { Role } from "./../../../common/enums/role.enum";
import { TaskEntity } from "src/modules/task/entities/task.entity";
import { ProfileEntity } from "./profile.entity";

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => TaskEntity, task => task.user, { cascade: ['remove'] })
  tasks: TaskEntity[];

  @OneToOne(() => ProfileEntity, profile => profile.user, { cascade: true, eager: true })
  profile: ProfileEntity;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;
}
