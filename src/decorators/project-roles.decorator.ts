import { SetMetadata } from '@nestjs/common';
import { ProjectRole } from 'src/db/entities/project-member.entity';

export const PROJECT_ROLES_KEY = 'projectRoles';
export const ProjectRoles = (...roles: ProjectRole[]) =>
    SetMetadata(PROJECT_ROLES_KEY, roles);
