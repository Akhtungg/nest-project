import { Injectable } from '@nestjs/common';
import { TaskEntity } from 'src/db/entities/task.entity';
import { TaskRepository } from 'src/db/repositories/task.repository';
import { TaskDto } from 'src/dto/task.dto';

@Injectable()
export class TaskService {
    constructor(private readonly taskRepository: TaskRepository) {}

    async create(data: TaskDto): Promise<TaskEntity> {
        return this.taskRepository.create({
            title: data.title,
            description: data.description,
            status: data.status,
            asigneeId: data.asigneeId,
        });
    }

    async findAll(): Promise<TaskEntity[]> {
        return this.taskRepository.findAll();
    }

    async findById(id: string): Promise<TaskEntity> {
        return this.taskRepository.findById(id);
    }

    async delete(id: string): Promise<void> {
        return this.taskRepository.delete(id);
    }

    async getAll(): Promise<TaskEntity[]> {
        return this.taskRepository.findAll();
    }
}
