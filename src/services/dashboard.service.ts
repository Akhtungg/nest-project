import { Injectable, Logger } from '@nestjs/common';
import { DashboardRepository } from 'src/db/repositories/dashboard.repository';
import { DashboardResponseDto } from 'src/dto/dashboard.dto';
import { ProjectRole } from 'src/db/entities/project-member.entity';
import { TaskStatus } from 'src/db/entities/task.entity';
import { UserService } from './user.service';

@Injectable()
export class DashboardService {
    private readonly logger = new Logger(DashboardService.name);

    constructor(
        private readonly dashboardRepository: DashboardRepository,
        private readonly usersService: UserService,
    ) {}

    async getDashboard(userId: string): Promise<DashboardResponseDto> {
        try {
            this.logger.log(`Generating dashboard for user ${userId}`);

            const [
                user,
                userProjects,
                userTasks,
                tasksStats,
                projectsCount,
                tasksDueThisWeek,
                upcomingDeadlines,
                overdueTasks,
            ] = await Promise.all([
                this.usersService.findById(userId),
                this.dashboardRepository.findUserProjects(userId),
                this.dashboardRepository.findUserTasks(userId),
                this.dashboardRepository.getUserTasksStats(userId),
                this.dashboardRepository.countUserProjects(userId),
                this.dashboardRepository.getTasksDueThisWeek(userId),
                this.dashboardRepository.getUpcomingDeadlines(userId),
                this.dashboardRepository.getOverdueTasks(userId),
            ]);

            const recentActivities =
                await this.dashboardRepository.getRecentActivity(userId);

            const stats = this.calculateStats(
                tasksStats,
                projectsCount,
                tasksDueThisWeek,
                overdueTasks,
            );
            const projects = await this.getProjectsData(userProjects);
            const recentTasks = this.getRecentTasks(userTasks);

            return {
                user: this.mapUserToDto(user),
                stats,
                projects,
                recentTasks,
                upcomingDeadlines: this.mapTasksToDto(upcomingDeadlines),
                overdueTasks: this.mapTasksToDto(overdueTasks),
                recentActivities: this.mapActivitiesToDto(recentActivities),
                lastUpdated: new Date(),
            };
        } catch (error) {
            this.logger.error(
                `Failed to generate dashboard for user ${userId}:`,
                error.stack,
            );
            throw error;
        }
    }

    private mapUserToDto(user: any): DashboardResponseDto['user'] {
        return {
            id: user.id,
            name: user.fullname,
            email: user.email,
            globalRole: user.role,
            lastLogin: new Date(),
        };
    }

    private calculateStats(
        tasksStats: any,
        projectsCount: number,
        tasksDueThisWeek: any[],
        overdueTasks: any[],
    ): DashboardResponseDto['stats'] {
        return {
            totalTasks: parseInt(tasksStats.total) || 0,
            completedTasks: parseInt(tasksStats.completed) || 0,
            inProgressTasks: parseInt(tasksStats.inProgress) || 0,
            todoTasks: parseInt(tasksStats.todo) || 0,
            overdueTasks: overdueTasks.length,
            totalProjects: projectsCount,
            tasksDueThisWeek: tasksDueThisWeek.length,
        };
    }

    private async getProjectsData(
        projects: any[],
    ): Promise<DashboardResponseDto['projects']> {
        const projectsData = [];

        for (const project of projects) {
            const projectStats = await this.dashboardRepository.getProjectStats(
                project.id,
            );

            projectsData.push({
                id: project.id,
                title: project.title,
                description: project.description,
                userRole: project.userRole || ProjectRole.DEVELOPER,
                totalTasks: parseInt(projectStats.totalTasks) || 0,
                completedTasks: parseInt(projectStats.completedTasks) || 0,
                completionPercentage:
                    parseInt(projectStats.totalTasks) > 0
                        ? Math.round(
                              (parseInt(projectStats.completedTasks) /
                                  parseInt(projectStats.totalTasks)) *
                                  100,
                          )
                        : 0,
                deadline: null,
            });
        }

        return projectsData;
    }

    private getRecentTasks(tasks: any[]): DashboardResponseDto['recentTasks'] {
        return tasks.slice(0, 10).map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: this.getPriorityFromDueDate(task.dueDate),
            dueDate: task.dueDate,
            projectName: task.projectName || 'Unknown Project',
            projectId: task.projectId,
            createdAt: task.createdAt,
        }));
    }

    private mapTasksToDto(tasks: any[]): DashboardResponseDto['recentTasks'] {
        return tasks.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: this.getPriorityFromDueDate(task.dueDate),
            dueDate: task.dueDate,
            projectName: task.projectName || 'Unknown Project',
            projectId: task.projectId,
            createdAt: task.createdAt,
        }));
    }

    private getPriorityFromDueDate(dueDate: Date): string {
        if (!dueDate) return 'medium';

        const now = new Date();
        const timeDiff = dueDate.getTime() - now.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);

        if (daysDiff < 2) return 'high';
        if (daysDiff < 7) return 'medium';
        return 'low';
    }

    private mapActivitiesToDto(
        activities: any[],
    ): DashboardResponseDto['recentActivities'] {
        return activities.map((activity) => ({
            type: activity.type,
            message: activity.message,
            timestamp: activity.timestamp,
            projectName: activity.projectName,
            projectId: activity.projectId,
        }));
    }

    // Для менеджеров - расширенная статистика
    async getManagerDashboard(
        userId: string,
        userRole: string,
    ): Promise<DashboardResponseDto> {
        const basicDashboard = await this.getDashboard(userId);

        if (userRole === 'manager') {
            const allProjectTasks =
                await this.dashboardRepository.findAllUserProjectTasks(userId);
            const teamStats = this.calculateTeamStats(allProjectTasks);

            return {
                ...basicDashboard,
                stats: {
                    ...basicDashboard.stats,
                    ...teamStats,
                },
            };
        }

        return basicDashboard;
    }

    private calculateTeamStats(tasks: any[]): any {
        const now = new Date();
        const overdueTasks = tasks.filter(
            (task) =>
                task.dueDate &&
                new Date(task.dueDate) < now &&
                task.status !== TaskStatus.DONE,
        ).length;

        const tasksDueThisWeek = tasks.filter(
            (task) =>
                task.dueDate &&
                new Date(task.dueDate) <=
                    new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) &&
                new Date(task.dueDate) >= now &&
                task.status !== TaskStatus.DONE,
        ).length;

        return {
            teamTotalTasks: tasks.length,
            teamCompletedTasks: tasks.filter(
                (t) => t.status === TaskStatus.DONE,
            ).length,
            teamInProgressTasks: tasks.filter(
                (t) => t.status === TaskStatus.IN_PROGRESS,
            ).length,
            teamOverdueTasks: overdueTasks,
            teamTasksDueThisWeek: tasksDueThisWeek,
        };
    }
}
