import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskEntity } from 'src/db/entities/task.entity';
import { TaskDto } from 'src/dto/task.dto';
import { TaskService } from 'src/services/task.service';

@Controller('task')
@ApiTags('Task')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Post('create')
    @ApiOperation({ summary: 'Create a new task' })
    @ApiBody({
        schema: {
            properties: {
                title: { type: 'string', default: 'test' },
                description: { type: 'string', default: 'test' },
                status: { type: 'string', default: 'TODO' },
                assigneeId: { type: 'string' },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'The task has been successfully created.',
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async createTask(@Body() data: TaskDto) {
        return await this.taskService.create(data);
    }

    @Get('getAll')
    @ApiOperation({ summary: 'Get all tasks' })
    @ApiResponse({ status: 200, description: 'Return all tasks.' })
    @ApiResponse({ status: 404, description: 'Tasks not found.' })
    async findAllTasks() {
        return await this.taskService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<TaskEntity> {
        return this.taskService.findById(id);
    }
}
