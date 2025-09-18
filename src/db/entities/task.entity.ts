import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ProjectEntity } from './project.entity';

export enum TaskStatus {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    DONE = 'done',
}

@Entity({ name: 'tasks' })
export class TaskEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column('uuid')
    projectId: string;

    @Column('uuid')
    assigneeId: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.TODO,
    })
    status: TaskStatus;

    @ManyToOne(() => UserEntity, (user) => user.task, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn({ name: 'assigneeId' })
    assignee: UserEntity;

    @ManyToOne(() => ProjectEntity, (project) => project.task, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'projectId' })
    project: ProjectEntity;

    @Column({ default: () => "NOW() + INTERVAL '7 days'" })
    dueDate: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
