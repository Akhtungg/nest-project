import { Injectable } from '@nestjs/common';
import { ProjectEntity } from 'src/db/entities/project.entity';
import { ProjectDto } from 'src/dto/project.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProjectRepository {
    private readonly projectRepository: Repository<ProjectEntity>;

    constructor(private dataSource: DataSource) {
        this.projectRepository = dataSource.getRepository(ProjectEntity);
    }

    async create(data: ProjectDto): Promise<ProjectEntity> {
        try {
            const project = this.projectRepository.create(data);
            return await this.projectRepository.save(project);
        } catch (error) {
            throw error;
        }
    }

    async findAll(): Promise<ProjectEntity[]> {
        try {
            return this.projectRepository.find({});
        } catch (error) {
            throw new Error('Projects not found');
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.projectRepository.delete(id);
        } catch (error) {
            throw new Error(error);
        }
    }

    async findById(projectId: string): Promise<ProjectEntity> {
        try {
            return this.projectRepository.findOne({ where: { id: projectId } });
        } catch (error) {
            throw new Error('Project not found');
        }
    }
}
