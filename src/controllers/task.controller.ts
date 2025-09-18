import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ProjectRole } from 'src/db/entities/project-member.entity';
import { TaskEntity } from 'src/db/entities/task.entity';
import { ProjectRoles } from 'src/decorators/project-roles.decorator';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { JwtAuthGuard } from 'src/JWT/guards/jwt.guard';
import { ProjectRolesGuard } from 'src/JWT/guards/project-roles.guard';
import { TaskService } from 'src/services/task.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('projects/:projectId/tasks')
@ApiTags('Task')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @UseGuards(ProjectRolesGuard)
    @ProjectRoles(ProjectRole.MANAGER, ProjectRole.LEAD)
    @Post('create')
    @ApiOperation({ summary: 'Create a new task' })
    @ApiBody({
        schema: {
            properties: {
                title: { type: 'string', default: 'test' },
                description: { type: 'string', default: 'test' },
                status: { type: 'string', default: 'todo' },
                assigneeId: { type: 'string', default: 'user' },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'The task has been successfully created.',
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async createTask(
        @Param('projectId') projectId: string,
        @Body() createTaskDto: CreateTaskDto,
        @Req() req,
    ) {
        return await this.taskService.createTask(
            projectId,
            createTaskDto,
            req.userId,
        );
    }

    @UseGuards(ProjectRolesGuard)
    @ProjectRoles(
        ProjectRole.MANAGER,
        ProjectRole.LEAD,
        ProjectRole.DEVELOPER,
        ProjectRole.VIEWER,
    )
    @Get('getAll')
    @ApiOperation({ summary: 'Get all tasks' })
    @ApiResponse({ status: 200, description: 'Return all tasks.' })
    @ApiResponse({ status: 404, description: 'Tasks not found.' })
    async findAllTasks(@Param('projectId') projectId: string) {
        return await this.taskService.findAll(projectId);
    }

    @UseGuards(ProjectRolesGuard)
    @ProjectRoles(
        ProjectRole.MANAGER,
        ProjectRole.LEAD,
        ProjectRole.DEVELOPER,
        ProjectRole.VIEWER,
    )
    @Get(':id')
    findOne(
        @Param('id') id: string,
        @Query('projectId') projectId: string,
    ): Promise<TaskEntity> {
        return this.taskService.findById(id);
    }
}
