import { Injectable } from '@nestjs/common';
import { TaskEntity, TaskStatus } from 'src/db/entities/task.entity';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TaskRepository {
    private readonly taskRepository: Repository<TaskEntity>;

    constructor(private dataSource: DataSource) {
        this.taskRepository = dataSource.getRepository(TaskEntity);
    }

    async create(createData: {
        title: string;
        description?: string;
        status: TaskStatus;
        projectId: string;
        assigneeId?: string;
    }): Promise<TaskEntity> {
        const task = this.taskRepository.create({
            title: createData.title,
            description: createData.description,
            status: createData.status,
            project: { id: createData.projectId },
            assignee: createData.assigneeId
                ? { id: createData.assigneeId }
                : null,
        });

        return await this.taskRepository.save(task);
    }

    async findAll(projectId): Promise<TaskEntity[]> {
        try {
            return this.taskRepository.find({ where: { projectId } });
        } catch (error) {
            throw new Error('Tasks not found');
        }
    }

    async update(id: string, task: Partial<TaskEntity>): Promise<TaskEntity> {
        try {
            await this.taskRepository.update(id, task);
            return this.taskRepository.findOne({ where: { id } });
        } catch {
            throw new Error('task not found');
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.taskRepository.delete(id);
        } catch (error) {
            throw new Error(error);
        }
    }

    async findById(taskId: string): Promise<TaskEntity> {
        return this.taskRepository.findOne({
            where: { id: taskId },
            relations: ['assignee', 'project'],
        });
    }
}
