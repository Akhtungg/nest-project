import { Global } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { GlobalRole } from 'src/db/entities/user.entity';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    password: string;

    @IsNotEmpty()
    fullname: string;

    @ApiProperty({
        description: 'Глабальная роль юзера',
        enum: GlobalRole,
        example: GlobalRole.USER,
    })
    @IsEnum(GlobalRole)
    @IsNotEmpty()
    role: GlobalRole;
}
