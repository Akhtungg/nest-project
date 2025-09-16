import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TaskEntity } from './task.entity';
import { ProjectUserEntity } from './projectUser.entity';

@Entity({ name: 'projects' })
export class ProjectEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    name: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => ProjectUserEntity, (projectUser) => projectUser.project)
    users: ProjectUserEntity[];
}
