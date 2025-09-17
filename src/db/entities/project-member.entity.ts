import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    Unique,
    JoinColumn,
    PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ProjectEntity } from './project.entity';

export enum ProjectRole {
    MANAGER = 'manager',
    LEAD = 'lead',
    DEVELOPER = 'developer',
    VIEWER = 'viewer',
}

@Entity('project_member')
@Unique(['user', 'project']) // Пользователь не может быть два раза в одном проекте
export class ProjectMemberEntity {
    @PrimaryColumn('uuid')
    userId: string;

    @PrimaryColumn('uuid')
    projectId: string;

    @ManyToOne(() => UserEntity, (user) => user.projectMember, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @ManyToOne(() => ProjectEntity, (project) => project.projectMember, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'projectId' })
    project: ProjectEntity;

    @Column({
        type: 'enum',
        enum: ProjectRole,
        default: ProjectRole.DEVELOPER,
    })
    role: ProjectRole;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    joinedAt: Date;
}
