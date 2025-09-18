import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProjectAccessService } from '../../services/project-access.service';
import { ProjectRole } from 'src/db/entities/project-member.entity';
import { GlobalRole } from 'src/db/entities/user.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class ProjectRolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private projectAccessService: ProjectAccessService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.get<ProjectRole[]>(
            'projectRoles',
            context.getHandler(),
        );

        if (!requiredRoles?.length) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const projectId = request.params.projectId || request.query.projectId;

        if (!projectId) {
            throw new ForbiddenException('Project ID is required');
        }

        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }

        if (!isUUID(projectId)) {
            throw new BadRequestException('Invalid project ID format');
        }

        //Проверяем, является ли пользователь глобальным менеджером
        if (user.role === GlobalRole.MANAGER) {
            // Сохраняем информацию что доступ предоставлен по глобальной роли
            request.projectId = projectId;
            request.userProjectRole = ProjectRole.MANAGER;
            request.accessGrantedBy = 'global_role';
            return true;
        }

        // Проверяем доступ для каждой требуемой роли
        for (const requiredRole of requiredRoles) {
            const hasAccess =
                await this.projectAccessService.checkUserProjectAccess(
                    user.id,
                    projectId,
                    requiredRole,
                );

            if (hasAccess) {
                // Сохраняем информацию о проекте и роли
                request.projectId = projectId;
                request.userProjectRole =
                    await this.projectAccessService.getUserProjectRole(
                        user.id,
                        projectId,
                    );
                return true;
            }
        }

        throw new ForbiddenException(
            `Required roles: ${requiredRoles.join(', ')}. Access denied.`,
        );
    }
}
