import { ApiProperty } from '@nestjs/swagger';
import { GlobalRole } from 'src/db/entities/user.entity';
import { TaskStatus } from 'src/db/entities/task.entity';
import { ProjectRole } from 'src/db/entities/project-member.entity';

export class DashboardUserDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    id: string;

    @ApiProperty({ example: 'John Doe' })
    name: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    email: string;

    @ApiProperty({ enum: GlobalRole, example: GlobalRole.USER })
    globalRole: GlobalRole;

    @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
    lastLogin: Date;
}

export class DashboardStatsDto {
    @ApiProperty({ example: 25 })
    totalTasks: number;

    @ApiProperty({ example: 10 })
    completedTasks: number;

    @ApiProperty({ example: 8 })
    inProgressTasks: number;

    @ApiProperty({ example: 7 })
    todoTasks: number;

    @ApiProperty({ example: 2 })
    overdueTasks: number;

    @ApiProperty({ example: 3 })
    totalProjects: number;

    @ApiProperty({ example: 15 })
    tasksDueThisWeek: number;
}

export class DashboardProjectDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    id: string;

    @ApiProperty({ example: 'E-Commerce Platform' })
    name: string;

    @ApiProperty({ example: 'Development of online store' })
    description: string;

    @ApiProperty({ enum: ProjectRole, example: ProjectRole.DEVELOPER })
    userRole: ProjectRole;

    @ApiProperty({ example: 12 })
    totalTasks: number;

    @ApiProperty({ example: 5 })
    completedTasks: number;

    @ApiProperty({ example: 70 })
    completionPercentage: number;

    @ApiProperty({ example: '2024-02-01T00:00:00.000Z', nullable: true })
    deadline?: Date;
}

export class DashboardTaskDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    id: string;

    @ApiProperty({ example: 'Implement payment gateway' })
    title: string;

    @ApiProperty({ example: 'Integrate Stripe API for payments' })
    description: string;

    @ApiProperty({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS })
    status: TaskStatus;

    @ApiProperty({ example: 'high' })
    priority: string;

    @ApiProperty({ example: '2024-01-25T00:00:00.000Z', nullable: true })
    dueDate?: Date;

    @ApiProperty({ example: 'E-Commerce Platform' })
    projectName: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    projectId: string;

    @ApiProperty({ example: '2024-01-15T14:30:00.000Z' })
    createdAt: Date;
}

export class DashboardActivityDto {
    @ApiProperty({ example: 'task_created' })
    type: string;

    @ApiProperty({ example: 'New task "Implement payment gateway" created' })
    message: string;

    @ApiProperty({ example: '2024-01-15T14:30:00.000Z' })
    timestamp: Date;

    @ApiProperty({ example: 'E-Commerce Platform', nullable: true })
    projectName?: string;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        nullable: true,
    })
    projectId?: string;
}

export class DashboardResponseDto {
    @ApiProperty({ type: DashboardUserDto })
    user: DashboardUserDto;

    @ApiProperty({ type: DashboardStatsDto })
    stats: DashboardStatsDto;

    @ApiProperty({ type: [DashboardProjectDto] })
    projects: DashboardProjectDto[];

    @ApiProperty({ type: [DashboardTaskDto] })
    recentTasks: DashboardTaskDto[];

    @ApiProperty({ type: [DashboardTaskDto] })
    upcomingDeadlines: DashboardTaskDto[];

    @ApiProperty({ type: [DashboardTaskDto] }) // Добавлено новое поле
    overdueTasks: DashboardTaskDto[];

    @ApiProperty({ type: [DashboardActivityDto] })
    recentActivities: DashboardActivityDto[];

    @ApiProperty({ example: '2024-01-15T14:30:00.000Z' })
    lastUpdated: Date;
}
