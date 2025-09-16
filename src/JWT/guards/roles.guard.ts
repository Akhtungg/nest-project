import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { GlobalRole } from 'src/db/user/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.get<GlobalRole[]>(
            'roles',
            context.getHandler(),
        );
        if (!requiredRoles) {
            return true; // Если роль не указана, доступ разрешен
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user; // Пользователь должен быть доступен в request.user после аутентификации через JwtStrategy

        if (!user) {
            throw new ForbiddenException('Вы не аутентифицированы');
        }

        const hasRole = requiredRoles.some((role) => user.role === role); // Проверяем, есть ли у пользователя необходимая роль

        if (!hasRole) {
            throw new ForbiddenException('У вас нет доступа');
        }

        return true;
    }
}
