import { IsNotEmpty } from 'class-validator';

export class UpdateProjectDto {
    @IsNotEmpty()
    title: string;

    description: string;
}
