import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from 'src/db/repositories/project.repository';
import { ProjectAccessService } from './project-access.service';
import { CreateProjectDto } from 'src/dto/create-project.dto';
import { UpdateProjectDto } from 'src/dto/update-project.dto';
import { ProjectRole } from 'src/db/entities/project-member.entity';
import { ProjectMemberService } from './project-member.service';
import { ProjectEntity } from 'src/db/entities/project.entity';

@Injectable()
export class ProjectService {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly projectAccessService: ProjectAccessService,
        private readonly projectMemberService: ProjectMemberService,
    ) {}

    async createProject(
        createProjectDto: CreateProjectDto,
        userId: string,
    ): Promise<ProjectEntity> {
        const project = await this.projectRepository.create(createProjectDto);
        //добавляем создателя как менеджера
        await this.projectMemberService.addOwnerMember(userId, project.id);
        return project;
    }

    async findById(projectId: string) {
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    async updateProject(projectId: string, updateProjectDto: UpdateProjectDto) {
        return this.projectRepository.update(projectId, updateProjectDto);
    }

    async deleteProject(projectId: string) {
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new NotFoundException('Project not found');
        }

        await this.projectRepository.delete(projectId);
        return { message: 'Project deleted successfully' };
    }
}
