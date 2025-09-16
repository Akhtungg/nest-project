import { Injectable } from '@nestjs/common';
import { TaskEntity } from 'src/db/entities/task.entity';
import { TaskDto } from 'src/dto/task.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TaskRepository {
    private readonly taskRepository: Repository<TaskEntity>;

    constructor(private dataSource: DataSource) {
        this.taskRepository = dataSource.getRepository(TaskEntity);
    }

    async create(data: TaskDto): Promise<TaskEntity> {
        try {
            const task = this.taskRepository.create(data);
            return await this.taskRepository.save(task);
        } catch (error) {
            throw error;
        }
    }

    async findAll(): Promise<TaskEntity[]> {
        try {
            return this.taskRepository.find({});
        } catch (error) {
            throw new Error('Tasks not found');
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
        try {
            return this.taskRepository.findOne({ where: { id: taskId } });
        } catch (error) {
            throw new Error('Task not found');
        }
    }
}
