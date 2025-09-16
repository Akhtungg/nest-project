import { Injectable } from '@nestjs/common';
import { ProjectEntity } from 'src/db/entities/project.entity';
import { ProjectRepository } from 'src/db/repositories/project.repository';
import { ProjectDto } from 'src/dto/project.dto';

@Injectable()
export class ProjectService {
    constructor(private readonly projectRepository: ProjectRepository) {}

    async create(data: ProjectDto): Promise<ProjectEntity> {
        return this.projectRepository.create({
            name: data.name,
            description: data.description,
        });
    }

    async findAll(): Promise<ProjectEntity[]> {
        return this.projectRepository.findAll();
    }

    async findById(id: string): Promise<ProjectEntity> {
        return this.projectRepository.findById(id);
    }

    async delete(id: string): Promise<void> {
        return this.projectRepository.delete(id);
    }

    async getAll(): Promise<ProjectEntity[]> {
        return this.projectRepository.findAll();
    }
}
