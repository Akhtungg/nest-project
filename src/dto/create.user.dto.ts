import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { GlobalRole } from 'src/db/entities/user.entity';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    password: string;

    @IsNotEmpty()
    fullname: string;

    @IsNotEmpty()
    role: GlobalRole;
}
