import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { TaskEntity, TaskStatus } from 'src/db/entities/task.entity';
import { TaskRepository } from 'src/db/repositories/task.repository';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { UpdateTaskDto } from 'src/dto/update-task.dto';
import { NotificationsService } from './notifications.service';
import { ProjectService } from './project.service';
import { UserService } from './user.service';

@Injectable()
export class TaskService {
    constructor(
        private taskRepository: TaskRepository,
        @Inject(forwardRef(() => NotificationsService))
        private notificationsService: NotificationsService,
        private projectService: ProjectService,
        private userService: UserService,
    ) {}

    async updateTaskStatus(
        taskId: string,
        newStatus: TaskStatus,
        userId: string,
    ): Promise<any> {
        // Получаем текущую задачу
        const task = await this.taskRepository.findById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }

        const oldStatus = task.status;

        // Обновляем статус
        const updatedTask = await this.taskRepository.update(taskId, {
            status: newStatus,
        });

        const project = await this.projectService.findById(task.projectId);
        const user = await this.userService.findById(userId);

        const assigneeId = task.assigneeId ?? task.assignee?.id;

        await this.notificationsService.notifyTaskStatusChange({
            taskId: task.id,
            taskTitle: task.title,
            projectId: task.projectId,
            projectName: project.title ?? project.title,
            oldStatus,
            newStatus,
            changedBy: { id: user.id, name: user.fullname },
            changedAt: new Date(),
            assigneeId,
        });

        return updatedTask;
    }

    async createTask(
        projectId: string,
        createTaskDto: CreateTaskDto,
        userId: string,
    ): Promise<any> {
        const task = await this.taskRepository.create({
            ...createTaskDto,
            projectId: projectId,
        });

        // Получаем информацию для уведомления
        const project = await this.projectService.findById(projectId);
        const user = await this.userService.findById(userId);

        // Отправляем уведомление о новой задаче
        if (createTaskDto.assigneeId) {
            await this.notificationsService.notifyNewTask(task, project, user);
        }

        return task;
    }

    async findAll(projectId: string): Promise<TaskEntity[]> {
        return this.taskRepository.findAll(projectId);
    }

    async findById(id: string): Promise<TaskEntity> {
        return this.taskRepository.findById(id);
    }

    async updateTask(taskId: string, updateProjectDto: UpdateTaskDto) {
        return this.taskRepository.update(taskId, updateProjectDto);
    }

    async delete(id: string): Promise<void> {
        return this.taskRepository.delete(id);
    }
}
