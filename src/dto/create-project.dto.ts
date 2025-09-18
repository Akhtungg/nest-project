import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProjectDto {
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @ApiProperty({
        description: 'Описание задачи',
        required: false,
        example: 'Нужно сделать REST API для задач',
    })
    description: string;
}
