import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectEntity } from 'src/db/entities/project.entity';
import { ProjectDto } from 'src/dto/project.dto';
import { ProjectService } from 'src/services/project.service';

@Controller('project')
@ApiTags('Project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Post('create')
    @ApiOperation({ summary: 'Create a new project' })
    @ApiBody({
        schema: {
            properties: {
                name: { type: 'string', default: 'test' },
                description: { type: 'string', default: 'test' },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'The project has been successfully created.',
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async createProject(@Body() data: ProjectDto) {
        return await this.projectService.create(data);
    }

    @Get('getAll')
    @ApiOperation({ summary: 'Get all projects' })
    @ApiResponse({ status: 200, description: 'Return all projects.' })
    @ApiResponse({ status: 404, description: 'Projects not found.' })
    async findAllProjects() {
        return await this.projectService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<ProjectEntity> {
        return this.projectService.findById(id);
    }
}
