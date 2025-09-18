import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { TaskStatus } from 'src/db/entities/task.entity';

export class CreateTaskDto {
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @ApiProperty({
        description: 'Описание задачи',
        required: false,
        example: 'Нужно сделать REST API для задач',
    })
    description: string;

    @ApiProperty({
        description: 'Статус задачи',
        enum: TaskStatus,
        example: TaskStatus.TODO,
    })
    @IsOptional()
    @IsEnum(TaskStatus)
    status: TaskStatus;

    @ApiProperty({
        description: 'Дедлайн',
        required: false,
        example: '2025-10-25T12:34:56.789Z',
    })
    dueDate: Date;

    @IsUUID()
    @ApiProperty({
        description: 'ID исполнителя задачи',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    assigneeId: string;
}
