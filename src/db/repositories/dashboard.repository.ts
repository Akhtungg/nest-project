import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TaskStatus } from '../entities/task.entity';

@Injectable()
export class DashboardRepository {
    constructor(private dataSource: DataSource) {}

    // Получить проекты пользователя
    async findUserProjects(userId: string): Promise<any[]> {
        const query = `
      SELECT 
        p.id, p.title, p.description, p."createdAt",
        pm.role as "userRole"
      FROM projects p
      INNER JOIN project_member pm ON p.id = pm."projectId"
      WHERE pm."userId" = $1
      ORDER BY p."createdAt" DESC
    `;

        const result = await this.dataSource.query(query, [userId]);
        return result;
    }

    // Получить задачи пользователя (где пользователь исполнитель)
    async findUserTasks(userId: string): Promise<any[]> {
        const query = `
      SELECT 
        t.id, t.title, t.description, t.status, t."createdAt", t."dueDate",
        p.id as "projectId", p.title as "projectName"
      FROM tasks t
      LEFT JOIN projects p ON t."projectId" = p.id
      WHERE t."assigneeId" = $1
      ORDER BY t."createdAt" DESC
    `;

        const result = await this.dataSource.query(query, [userId]);
        return result;
    }

    // Получить все задачи в проектах пользователя
    async findAllUserProjectTasks(userId: string): Promise<any[]> {
        const query = `
      SELECT 
        t.id, t.title, t.description, t.status, t."dueDate",
        t."createdAt", t."assigneeId",
        p.id as "projectId", p.title as "projectName"
      FROM tasks t
      LEFT JOIN projects p ON t."projectId" = p.id
      WHERE p.id IN (
        SELECT "projectId" FROM project_member WHERE "userId" = $1
      )
      ORDER BY t."createdAt" DESC
    `;

        const result = await this.dataSource.query(query, [userId]);
        return result;
    }

    // Количество проектов пользователя
    async countUserProjects(userId: string): Promise<number> {
        const query = `
      SELECT COUNT(*) as count
      FROM project_member
      WHERE "userId" = $1
    `;

        const result = await this.dataSource.query(query, [userId]);
        return parseInt(result[0].count);
    }

    // Статистика задач пользователя (где пользователь исполнитель)
    async getUserTasksStats(userId: string): Promise<any> {
        const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = '${TaskStatus.DONE}' THEN 1 END) as completed,
        COUNT(CASE WHEN status = '${TaskStatus.IN_PROGRESS}' THEN 1 END) as "inProgress",
        COUNT(CASE WHEN status = '${TaskStatus.TODO}' THEN 1 END) as todo,
        COUNT(CASE WHEN "dueDate" < NOW() AND status != '${TaskStatus.DONE}' THEN 1 END) as overdue
      FROM tasks 
      WHERE "assigneeId" = $1
    `;

        const result = await this.dataSource.query(query, [userId]);
        return result[0];
    }

    // Статистика по проекту
    async getProjectStats(projectId: string): Promise<any> {
        const query = `
      SELECT 
        COUNT(*) as "totalTasks",
        COUNT(CASE WHEN status = '${TaskStatus.DONE}' THEN 1 END) as "completedTasks"
      FROM tasks 
      WHERE "projectId" = $1
    `;

        const result = await this.dataSource.query(query, [projectId]);
        return result[0];
    }

    // Задачи на этой неделе (где пользователь исполнитель)
    async getTasksDueThisWeek(userId: string): Promise<any[]> {
        const query = `
      SELECT 
        t.id, t.title, t.status, t."dueDate",
        p.title as "projectName", p.id as "projectId"
      FROM tasks t
      LEFT JOIN projects p ON t."projectId" = p.id
      WHERE t."assigneeId" = $1
        AND t."dueDate" BETWEEN NOW() AND NOW() + INTERVAL '7 days'
        AND t.status != '${TaskStatus.DONE}'
      ORDER BY t."dueDate" ASC
    `;

        const result = await this.dataSource.query(query, [userId]);
        return result;
    }

    // Предстоящие дедлайны (2 недели)
    async getUpcomingDeadlines(userId: string): Promise<any[]> {
        const query = `
      SELECT 
        t.id, t.title, t.status, t."dueDate",
        p.title as "projectName", p.id as "projectId"
      FROM tasks t
      LEFT JOIN projects p ON t."projectId" = p.id
      WHERE t."assigneeId" = $1
        AND t."dueDate" BETWEEN NOW() AND NOW() + INTERVAL '14 days'
        AND t.status != '${TaskStatus.DONE}'
      ORDER BY t."dueDate" ASC
      LIMIT 10
    `;

        const result = await this.dataSource.query(query, [userId]);
        return result;
    }

    // Просроченные задачи
    async getOverdueTasks(userId: string): Promise<any[]> {
        const query = `
      SELECT 
        t.id, t.title, t.status, t."dueDate",
        p.title as "projectName", p.id as "projectId"
      FROM tasks t
      LEFT JOIN projects p ON t."projectId" = p.id
      WHERE t."assigneeId" = $1
        AND t."dueDate" < NOW()
        AND t.status != '${TaskStatus.DONE}'
      ORDER BY t."dueDate" ASC
      LIMIT 10
    `;

        const result = await this.dataSource.query(query, [userId]);
        return result;
    }

    // Недавняя активность
    async getRecentActivity(userId: string): Promise<any[]> {
        const query = `
      SELECT 
        'task_assigned' as type,
        'You were assigned to task: ' || t.title as message,
        t."createdAt" as timestamp,
        p.title as "projectName",
        p.id as "projectId"
      FROM tasks t
      LEFT JOIN projects p ON t."projectId" = p.id
      WHERE t."assigneeId" = $1
        AND t."createdAt" > NOW() - INTERVAL '7 days'
      
      UNION ALL
      
      SELECT 
        'project_joined' as type,
        'You joined project: ' || p.title as message,
        pm."joinedAt" as timestamp,
        p.title as "projectName",
        p.id as "projectId"
      FROM project_member pm
      INNER JOIN projects p ON pm."projectId" = p.id
      WHERE pm."userId" = $1
        AND pm."joinedAt" > NOW() - INTERVAL '7 days'
      
      ORDER BY timestamp DESC
      LIMIT 10
    `;

        try {
            const result = await this.dataSource.query(query, [userId]);
            return result;
        } catch (error) {
            return this.getRecentActivityFallback(userId);
        }
    }

    // Fallback для активности
    private async getRecentActivityFallback(userId: string): Promise<any[]> {
        const query = `
      SELECT 
        'project_joined' as type,
        'You joined project: ' || p.title as message,
        pm."joinedAt" as timestamp,
        p.title as "projectName",
        p.id as "projectId"
      FROM project_member pm
      INNER JOIN projects p ON pm."projectId" = p.id
      WHERE pm."userId" = $1
      ORDER BY pm."joinedAt" DESC
      LIMIT 10
    `;

        const result = await this.dataSource.query(query, [userId]);
        return result;
    }

    // Получить задачи для проекта
    async getProjectTasks(projectId: string): Promise<any[]> {
        const query = `
      SELECT 
        t.id, t.title, t.description, t.status, t."dueDate", t."createdAt",
        u."fullname" as "assigneeName",
        u.id as "assigneeId"
      FROM tasks t
      LEFT JOIN users u ON t."assigneeId" = u.id
      WHERE t."projectId" = $1
      ORDER BY t."createdAt" DESC
    `;

        const result = await this.dataSource.query(query, [projectId]);
        return result;
    }

    // Получить участников проекта
    async getProjectMembers(projectId: string): Promise<any[]> {
        const query = `
      SELECT 
        u.id, u."fullname", u.email, u.role as "globalRole",
        pm.role as "projectRole", pm."joinedAt"
      FROM project_member pm
      INNER JOIN users u ON pm."userId" = u.id
      WHERE pm."projectId" = $1
      ORDER BY pm."joinedAt" DESC
    `;

        const result = await this.dataSource.query(query, [projectId]);
        return result;
    }
}
