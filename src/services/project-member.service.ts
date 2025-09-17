import {
    Injectable,
    ConflictException,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { ProjectMemberRepository } from 'src/db/repositories/project-member.repository';
import { ProjectAccessService } from './project-access.service';
import { ProjectRole } from 'src/db/entities/project-member.entity';
import { AddMemberDto } from 'src/dto/add-member.dto';
import { UpdateMemberRoleDto } from 'src/dto/update-member-role.dto';

@Injectable()
export class ProjectMemberService {
    constructor(
        private readonly projectMemberRepository: ProjectMemberRepository,
        private readonly projectAccessService: ProjectAccessService,
    ) {}

    async addMember(
        projectId: string,
        addMemberDto: AddMemberDto,
        requesterId: string,
    ) {
        await this.projectAccessService.ensureProjectAccess(
            requesterId,
            projectId,
            ProjectRole.LEAD,
        );

        const userExists = await this.projectAccessService.isUserInProject(
            addMemberDto.userId,
            projectId,
        );

        if (userExists) {
            throw new ConflictException(
                'User is already a member of this project',
            );
        }

        const role = addMemberDto.role || ProjectRole.DEVELOPER;

        return this.projectMemberRepository.addUserToProject(
            addMemberDto.userId,
            projectId,
            role,
        );
    }

    async addOwnerMember(userId: string, projectId: string) {
        // Только базовая проверка на существование в проекте
        const userExists = await this.projectAccessService.isUserInProject(
            userId,
            projectId,
        );

        if (userExists) {
            throw new ConflictException(
                'User is already a member of this project',
            );
        }

        return this.projectMemberRepository.addUserToProject(
            userId,
            projectId,
            ProjectRole.MANAGER,
        );
    }

    async getProjectMembers(projectId: string, userId: string) {
        await this.projectAccessService.ensureProjectAccess(
            userId,
            projectId,
            ProjectRole.VIEWER,
        );

        const members =
            await this.projectMemberRepository.getProjectMembersWithDetails(
                projectId,
            );

        return members.map((member) => ({
            id: member.user.id,
            email: member.user.email,
            fullName: member.user.fullname,
            role: member.role,
            joinedAt: member.joinedAt,
        }));
    }

    async updateMemberRole(
        projectId: string,
        targetUserId: string,
        updateDto: UpdateMemberRoleDto,
        requesterId: string,
    ) {
        await this.projectAccessService.ensureProjectAccess(
            requesterId,
            projectId,
            ProjectRole.MANAGER,
        );

        if (targetUserId === requesterId) {
            throw new ForbiddenException('Cannot change your own role');
        }

        const userInProject = await this.projectAccessService.isUserInProject(
            targetUserId,
            projectId,
        );
        if (!userInProject) {
            throw new NotFoundException('User is not a member of this project');
        }

        await this.projectMemberRepository.updateUserRole(
            targetUserId,
            projectId,
            updateDto.role,
        );

        return { message: 'Member role updated successfully' };
    }

    async removeMemberFromProject(
        projectId: string,
        targetUserId: string,
        requesterId: string,
    ) {
        await this.projectAccessService.ensureProjectAccess(
            requesterId,
            projectId,
            ProjectRole.LEAD,
        );

        if (targetUserId === requesterId) {
            throw new ForbiddenException('Cannot remove yourself from project');
        }

        const userInProject = await this.projectAccessService.isUserInProject(
            targetUserId,
            projectId,
        );
        if (!userInProject) {
            throw new NotFoundException('User is not a member of this project');
        }

        await this.projectMemberRepository.removeUserFromProject(
            targetUserId,
            projectId,
        );

        return { message: 'Member removed from project successfully' };
    }
}
