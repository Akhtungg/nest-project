import { IsEnum, IsUUID, IsOptional, IsEmail } from 'class-validator';
import { ProjectRole } from 'src/db/entities/project-member.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AddMemberDto {
    @ApiProperty({
        description:
            'UUID пользователя для добавления (либо email, либо userId)',
        example: 'a601228e-c60b-4805-be1d-85eda62528de',
        required: false,
    })
    @IsUUID()
    @IsOptional()
    userId?: string;

    @ApiProperty({
        description:
            'Email пользователя для добавления (либо email, либо userId)',
        example: 'test@test.com',
        required: false,
    })
    @IsEmail()
    @IsOptional()
    userEmail?: string;

    @ApiProperty({
        description: 'Роль пользователя в проекте',
        enum: ProjectRole,
        example: ProjectRole.DEVELOPER,
        default: ProjectRole.DEVELOPER,
    })
    @IsEnum(ProjectRole)
    @IsOptional()
    role?: ProjectRole;
}
