import { IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from 'src/db/entities/task.entity';

export class TaskDto {
    @IsNotEmpty()
    title: string;

    @IsOptional()
    description: string;

    @IsOptional()
    status: TaskStatus;

    @IsOptional()
    asigneeId: string;
}
