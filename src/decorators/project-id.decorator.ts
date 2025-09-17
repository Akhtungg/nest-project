import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ProjectId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        // ProjectRolesGuard уже положил projectId в request
        if (request.projectId) {
            return request.projectId;
        }

        // Если Guard не использовался, ищем вручную
        const projectId =
            request.params.projectId ||
            request.body.projectId ||
            request.query.projectId;

        return projectId ? parseInt(projectId, 10) : null;
    },
);
