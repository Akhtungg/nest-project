import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { TaskStatus } from 'src/db/entities/task.entity';

export class UpdateTaskDto {
    @IsNotEmpty()
    title: string;

    @IsOptional()
    description: string;

    @ApiProperty({
        description: 'Статус задачи',
        enum: TaskStatus,
        example: TaskStatus.TODO,
    })
    @IsOptional()
    @IsEnum(TaskStatus)
    status: TaskStatus;

    @IsOptional()
    @IsUUID()
    projectId: string;

    @IsOptional()
    @IsUUID()
    assigneeId: string;
}
