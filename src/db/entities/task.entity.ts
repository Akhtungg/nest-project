import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.TODO,
    })
    status: TaskStatus;

    @ManyToOne(() => ProjectEntity, {
        onDelete: 'CASCADE',
    })
    project: ProjectEntity;

    @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: true })
    assignee: UserEntity;
}
