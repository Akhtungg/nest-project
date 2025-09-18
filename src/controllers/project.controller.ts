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
    ApiBody,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/JWT/guards/global-roles.guard';
import { JwtAuthGuard } from 'src/JWT/guards/jwt.guard';
import { ProjectRolesGuard } from 'src/JWT/guards/project-roles.guard';
import { ProjectRole } from 'src/db/entities/project-member.entity';
import { GlobalRole } from 'src/db/entities/user.entity';
import { ProjectId } from 'src/decorators/project-id.decorator';
import { ProjectRoles } from 'src/decorators/project-roles.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateProjectDto } from 'src/dto/create-project.dto';
import { UpdateProjectDto } from 'src/dto/update-project.dto';
import { ProjectService } from 'src/services/project.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('projects')
@Controller('projects')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @UseGuards(RolesGuard)
    @Roles(GlobalRole.MANAGER)
    @Post('create')
    @ApiOperation({ summary: 'Create new project' })
    @ApiBody({
        schema: {
            properties: {
                title: { type: 'string', default: 'test' },
                description: { type: 'string', default: 'test' },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Project created successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async createProject(
        @Body() createProjectDto: CreateProjectDto,
        @Req() req,
    ) {
        return this.projectService.createProject(createProjectDto, req.user.id);
    }

    @UseGuards(ProjectRolesGuard)
    @ProjectRoles(
        ProjectRole.MANAGER,
        ProjectRole.LEAD,
        ProjectRole.DEVELOPER,
        ProjectRole.VIEWER,
    )
    @Get(':projectId')
    @ApiOperation({ summary: 'Get project by ID' })
    @ApiResponse({ status: 200, description: 'Returns project details' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async getProject(@Param('projectId') projectId: string) {
        return this.projectService.findById(projectId);
    }

    @UseGuards(ProjectRolesGuard)
    @ProjectRoles(ProjectRole.MANAGER, ProjectRole.LEAD)
    @Put(':projectId')
    @ApiOperation({ summary: 'Update project' })
    async updateProject(
        @Param('projectId') projectId: string,
        @Body() updateProjectDto: UpdateProjectDto,
    ) {
        return this.projectService.updateProject(projectId, updateProjectDto);
    }

    @UseGuards(ProjectRolesGuard)
    @ProjectRoles(ProjectRole.MANAGER)
    @Delete(':projectId')
    @ApiOperation({ summary: 'Delete project' })
    async deleteProject(@Param('projectId') projectId: string) {
        return this.projectService.deleteProject(projectId);
    }
}
