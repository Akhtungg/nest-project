import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { ProjectEntity } from './project.entity';

export enum ProjectRole {
    MANAGER = 'manager', // Менеджер (может всё в проекте)
    LEAD = 'lead', // Тимлид (почти всё, кроме удаления проекта)
    DEVELOPER = 'developer', // Разработчик (может работать с задачами)
    VIEWER = 'viewer', // Наблюдатель (только чтение)
}

@Entity({ name: 'projects' })
export class ProjectUserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    @IsNotEmpty()
    name: string;

    @Column({
        type: 'enum',
        enum: ProjectRole,
        default: ProjectRole.DEVELOPER,
    })
    localRole: ProjectRole;

    @ManyToOne(() => UserEntity, (user) => user.projects, {
        onDelete: 'CASCADE',
    })
    user: UserEntity;

    @ManyToOne(() => ProjectEntity, (project) => project.users, {
        onDelete: 'CASCADE',
    })
    project: ProjectEntity;
}
