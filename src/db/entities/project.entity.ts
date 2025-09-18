import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectMemberEntity } from './project-member.entity';
import { TaskEntity } from './task.entity';

@Entity({ name: 'projects' })
export class ProjectEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    title: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(
        () => ProjectMemberEntity,
        (projectMember) => projectMember.project,
    )
    projectMember: ProjectMemberEntity[];

    @OneToMany(() => TaskEntity, (task) => task.project)
    task: TaskEntity[];

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
