import { IsNotEmpty, IsString } from 'class-validator';

export class ProjectDto {
    @IsNotEmpty()
    name: string;

    description: string;
}
