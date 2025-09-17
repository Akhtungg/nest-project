import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import {
    ProjectMemberEntity,
    ProjectRole,
} from '../entities/project-member.entity';

@Injectable()
export class ProjectMemberRepository {
    private readonly repository: Repository<ProjectMemberEntity>;

    constructor(private dataSource: DataSource) {
        this.repository = dataSource.getRepository(ProjectMemberEntity);
    }

    async addUserToProject(
        userId: string,
        projectId: string,
        role: ProjectRole,
    ): Promise<ProjectMemberEntity> {
        const projectUser = this.repository.create({
            userId: userId,
            projectId: projectId,
            role,
        });

        return this.repository.save(projectUser);
    }

    async updateUserRole(
        userId: string,
        projectId: string,
        newRole: ProjectRole,
    ): Promise<void> {
        await this.repository.update(
            { userId: userId, projectId: projectId },
            { role: newRole },
        );
    }

    async removeUserFromProject(
        userId: string,
        projectId: string,
    ): Promise<void> {
        await this.repository.delete({
            userId: userId,
            projectId: projectId,
        });
    }

    async getProjectMembersWithDetails(
        projectId: string,
    ): Promise<ProjectMemberEntity[]> {
        return this.repository.find({
            where: { projectId: projectId },
            relations: ['user'],
            order: { joinedAt: 'DESC' },
        });
    }

    async findProjectUser(
        userId: string,
        projectId: string,
    ): Promise<ProjectMemberEntity | null> {
        return this.repository.findOne({
            where: {
                userId: userId,
                projectId: projectId,
            },
            relations: ['user', 'project'],
        });
    }

    async countProjectMembers(projectId: string): Promise<number> {
        return this.repository.count({
            where: { projectId: projectId },
        });
    }
}
