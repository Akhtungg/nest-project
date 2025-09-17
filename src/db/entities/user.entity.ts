import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectMemberEntity } from './project-member.entity';
import { TaskEntity } from './task.entity';

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
    fullname: string;

    @Column({ type: 'enum', enum: GlobalRole, default: GlobalRole.USER })
    @IsNotEmpty()
    role: GlobalRole;

    @OneToMany(() => ProjectMemberEntity, (projectMember) => projectMember.user)
    projectMember: ProjectMemberEntity[];

    @OneToMany(() => TaskEntity, (task) => task.assignee)
    task: TaskEntity[];
}
