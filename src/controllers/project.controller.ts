import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Req,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/JWT/guards/jwt.guard';
import { CreateProjectDto } from 'src/dto/create.project.dto';
import { UpdateProjectDto } from 'src/dto/update.project.dto';
import { ProjectService } from 'src/services/project.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('projects')
@Controller('projects')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Post()
    @ApiOperation({ summary: 'Create new project' })
    @ApiResponse({ status: 201, description: 'Project created successfully' })
    async createProject(
        @Body() createProjectDto: CreateProjectDto,
        @Req() req,
    ) {
        return this.projectService.createProject(createProjectDto, req.user.id);
    }

    @Get(':projectId')
    @ApiOperation({ summary: 'Get project by ID' })
    @ApiResponse({ status: 200, description: 'Returns project details' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async getProject(@Param('projectId') projectId: string, @Req() req) {
        return this.projectService.findOne(projectId, req.user.id);
    }

    @Put(':projectId')
    @ApiOperation({ summary: 'Update project' })
    async updateProject(
        @Param('projectId') projectId: string,
        @Body() updateProjectDto: UpdateProjectDto,
        @Req() req,
    ) {
        return this.projectService.updateProject(
            projectId,
            updateProjectDto,
            req.user.id,
        );
    }

    @Delete(':projectId')
    @ApiOperation({ summary: 'Delete project' })
    async deleteProject(@Param('projectId') projectId: string, @Req() req) {
        return this.projectService.deleteProject(projectId, req.user.id);
    }
}
