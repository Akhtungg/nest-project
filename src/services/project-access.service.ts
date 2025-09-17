import { Injectable, ForbiddenException } from '@nestjs/common';
import { ProjectAccessRepository } from 'src/db/repositories/project-access.repository';
import { ProjectRole } from 'src/db/entities/project-member.entity';

@Injectable()
export class ProjectAccessService {
    constructor(
        private readonly projectAccessRepository: ProjectAccessRepository,
    ) {}

    async checkUserProjectAccess(
        userId: string,
        projectId: string,
        requiredRole: ProjectRole,
    ): Promise<boolean> {
        const userRole =
            await this.projectAccessRepository.getUserRoleInProject(
                userId,
                projectId,
            );

        if (!userRole) {
            return false;
        }

        const roleHierarchy = this.getRoleHierarchy();
        console.log(`requiredRole in ensureProjectAccess: ${userRole}`);
        return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
    }

    async getUserProjectRole(
        userId: string,
        projectId: string,
    ): Promise<ProjectRole> {
        const role = await this.projectAccessRepository.getUserRoleInProject(
            userId,
            projectId,
        );

        if (!role) {
            throw new ForbiddenException(
                'User is not a member of this project',
            );
        }
        return role;
    }

    async ensureProjectAccess(
        userId: string,
        projectId: string,
        requiredRole: ProjectRole,
    ): Promise<void> {
        const hasAccess = await this.checkUserProjectAccess(
            userId,
            projectId,
            requiredRole,
        );

        if (!hasAccess) {
            const userRole =
                await this.projectAccessRepository.getUserRoleInProject(
                    userId,
                    projectId,
                );
            throw new ForbiddenException(
                `Required role: ${requiredRole}. Your role: ${userRole || 'not a member'}`,
            );
        }
    }

    async isUserInProject(userId: string, projectId: string): Promise<boolean> {
        return this.projectAccessRepository.userExistsInProject(
            userId,
            projectId,
        );
    }

    private getRoleHierarchy(): Record<ProjectRole, number> {
        return {
            [ProjectRole.VIEWER]: 1,
            [ProjectRole.DEVELOPER]: 2,
            [ProjectRole.LEAD]: 3,
            [ProjectRole.MANAGER]: 4,
        };
    }
}
