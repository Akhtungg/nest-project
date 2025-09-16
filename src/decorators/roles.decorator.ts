import { SetMetadata } from '@nestjs/common';
import { GlobalRole } from 'src/db/entities/user.entity';

export const Roles = (...roles: GlobalRole[]) => SetMetadata('roles', roles);
