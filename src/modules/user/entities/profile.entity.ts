import { BaseEntity } from "src/common/abstracts/base.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";


@Entity('profiles')
export class ProfileEntity extends BaseEntity {
    @Column()
    name: string;
    @Column({nullable: true})
    bio: string;
    @Column({ type: 'longblob', nullable: true })
    image_profile: Buffer;
    @Column({ nullable: true })
    image_profile_mime: string;
    @Column({ nullable: true })
    image_profile_name: string;
    @Column({nullable: true})
    gender: string;
    @Column({nullable: true})
    birthday: Date;
    @OneToOne(() => UserEntity, user => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: UserEntity;
}
