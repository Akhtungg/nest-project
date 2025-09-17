import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from 'src/db/repositories/project.repository';
import { ProjectAccessService } from './project-access.service';
import { CreateProjectDto } from 'src/dto/create.project.dto';
import { UpdateProjectDto } from 'src/dto/update.project.dto';
import { ProjectRole } from 'src/db/entities/project-member.entity';
import { ProjectMemberService } from './project-member.service';

@Injectable()
export class ProjectService {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly projectAccessService: ProjectAccessService,
        private readonly projectMemberService: ProjectMemberService,
    ) {}

    async createProject(createProjectDto: CreateProjectDto, userId: string) {
        const project = await this.projectRepository.create(createProjectDto);
        //добавляем создателя как лида
        await this.projectMemberService.addOwnerMember(userId, project.id);
        return project;
    }

    async findOne(projectId: string, userId: string) {
        // Проверяем доступ к проекту
        await this.projectAccessService.ensureProjectAccess(
            userId,
            projectId,
            ProjectRole.VIEWER,
        );

        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    async updateProject(
        projectId: string,
        updateProjectDto: UpdateProjectDto,
        userId: string,
    ) {
        // Проверяем, что пользователь имеет права на обновление (MANAGER)
        await this.projectAccessService.ensureProjectAccess(
            userId,
            projectId,
            ProjectRole.MANAGER,
        );

        return this.projectRepository.update(projectId, updateProjectDto);
    }

    async deleteProject(projectId: string, userId: string) {
        // Проверяем, что пользователь имеет права на удаление (MANAGER)
        await this.projectAccessService.ensureProjectAccess(
            userId,
            projectId,
            ProjectRole.MANAGER,
        );

        await this.projectRepository.delete(projectId);
        return { message: 'Project deleted successfully' };
    }

    async userCanAccessProject(
        userId: string,
        projectId: string,
        requiredRole: ProjectRole,
    ): Promise<boolean> {
        return this.projectAccessService.checkUserProjectAccess(
            userId,
            projectId,
            requiredRole,
        );
    }
}
