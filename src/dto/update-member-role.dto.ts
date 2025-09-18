import { IsEnum } from 'class-validator';
import { ProjectRole } from 'src/db/entities/project-member.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemberRoleDto {
    @ApiProperty({
        description: 'Новая роль пользователя в проекте',
        enum: ProjectRole,
        example: ProjectRole.DEVELOPER,
    })
    @IsEnum(ProjectRole)
    role: ProjectRole;
}
