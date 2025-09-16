import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskEntity } from './task.entity';
import { ProjectUserEntity } from './projectUser.entity';

export enum GlobalRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    LEAD = 'lead',
    USER = 'user',
}

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Column('varchar')
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(256)
    password: string;

    @Column('varchar')
    @IsNotEmpty()
    name: string;

    @Column({ type: 'enum', enum: GlobalRole, default: GlobalRole.USER })
    @IsNotEmpty()
    role: GlobalRole;

    @OneToMany(() => ProjectUserEntity, (projectUser) => projectUser.user)
    projects: ProjectUserEntity[];
}
