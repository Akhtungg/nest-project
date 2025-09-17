import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProjectAccessService } from '../../services/project-access.service';
import { ProjectRole } from 'src/db/entities/project-member.entity';
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

        // Правильно извлекаем projectId из параметров маршрута
        const projectId = request.params.projectId;

        if (!projectId) {
            throw new ForbiddenException('Project ID is required');
        }

        if (!user) {
            throw new ForbiddenException('User not authenticated');
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
