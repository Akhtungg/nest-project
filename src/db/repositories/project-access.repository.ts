import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import {
    ProjectMemberEntity,
    ProjectRole,
} from '../entities/project-member.entity';

@Injectable()
export class ProjectAccessRepository {
    private readonly repository: Repository<ProjectMemberEntity>;

    constructor(private dataSource: DataSource) {
        this.repository = dataSource.getRepository(ProjectMemberEntity);
    }

    // Только методы для чтения и проверки доступа
    async getUserRoleInProject(
        userId: string,
        projectId: string,
    ): Promise<ProjectRole | null> {
        const projectUser = await this.repository.findOne({
            where: {
                userId: userId,
                projectId: projectId,
            },
            select: ['role'],
        });
        return projectUser?.role || null;
    }

    async userExistsInProject(
        userId: string,
        projectId: string,
    ): Promise<boolean> {
        const count = await this.repository.count({
            where: {
                userId: userId,
                projectId: projectId,
            },
        });
        return count > 0;
    }

    async getProjectMembers(
        projectId: string,
    ): Promise<{ userId: string; role: ProjectRole }[]> {
        const members = await this.repository.find({
            where: { projectId: projectId },
            relations: ['user'],
            select: ['role', 'user'],
        });

        return members.map((member) => ({
            userId: member.user.id,
            role: member.role,
        }));
    }

    async getUserProjects(
        userId: string,
    ): Promise<{ projectId: string; role: ProjectRole }[]> {
        const projectUsers = await this.repository.find({
            where: { userId },
            relations: ['project'],
            select: ['role', 'project'],
        });

        return projectUsers.map((pu) => ({
            projectId: pu.project.id,
            role: pu.role,
        }));
    }
}
