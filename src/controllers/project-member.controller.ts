import {
    Controller,
    Get,
    Post,
    Patch,
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
    ApiParam,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/JWT/guards/jwt.guard';
import { ProjectRoles } from 'src/decorators/project-roles.decorator';
import { ProjectRole } from 'src/db/entities/project-member.entity';
import { AddMemberDto } from 'src/dto/add-member.dto';
import { UpdateMemberRoleDto } from 'src/dto/update-member-role.dto';
import { ProjectMemberService } from 'src/services/project-member.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('project-members')
@Controller('projects/:projectId/members')
export class ProjectMemberController {
    constructor(private readonly projectMemberService: ProjectMemberService) {}

    @Post()
    @ProjectRoles(ProjectRole.LEAD, ProjectRole.MANAGER)
    @ApiOperation({ summary: 'Add member to project' })
    @ApiResponse({ status: 201, description: 'Member added successfully' })
    @ApiResponse({ status: 403, description: 'Access denied' })
    @ApiResponse({ status: 404, description: 'Project or user not found' })
    @ApiResponse({ status: 409, description: 'User already in project' })
    async addMember(
        @Param('projectId') projectId: string,
        @Body() addMemberDto: AddMemberDto,
        @Req() req,
    ) {
        return this.projectMemberService.addMember(
            projectId,
            addMemberDto,
            req.user.id,
        );
    }

    @Get()
    @ProjectRoles(
        ProjectRole.VIEWER,
        ProjectRole.DEVELOPER,
        ProjectRole.LEAD,
        ProjectRole.MANAGER,
    )
    @ApiOperation({ summary: 'Get all project members' })
    @ApiResponse({ status: 200, description: 'Returns project members' })
    async getMembers(@Param('projectId') projectId: string, @Req() req) {
        return this.projectMemberService.getProjectMembers(
            projectId,
            req.user.id,
        );
    }

    @Patch(':userId/role')
    @ProjectRoles(ProjectRole.MANAGER)
    @ApiOperation({ summary: 'Update member role' })
    @ApiParam({ name: 'userId', description: 'UUID of the member to update' })
    async updateMemberRole(
        @Param('projectId') projectId: string,
        @Param('userId') userId: string,
        @Body() updateDto: UpdateMemberRoleDto,
        @Req() req,
    ) {
        return this.projectMemberService.updateMemberRole(
            projectId,
            userId,
            updateDto,
            req.user.id,
        );
    }

    @Delete(':userId')
    @ProjectRoles(ProjectRole.LEAD, ProjectRole.MANAGER)
    @ApiOperation({ summary: 'Remove member from project' })
    @ApiParam({ name: 'userId', description: 'UUID of the member to remove' })
    async removeMember(
        @Param('projectId') projectId: string,
        @Param('userId') userId: string,
        @Req() req,
    ) {
        return this.projectMemberService.removeMemberFromProject(
            projectId,
            userId,
            req.user.id,
        );
    }
}
