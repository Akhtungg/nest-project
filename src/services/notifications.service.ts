import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from 'src/notifications.gateway';
import { ProjectMemberService } from 'src/services/project-member.service';

export interface TaskStatusChangeNotification {
    taskId: string;
    taskTitle: string;
    projectId: string;
    projectName: string;
    oldStatus: string;
    newStatus: string;
    changedBy: {
        id: string;
        name: string;
    };
    changedAt: Date;
    assigneeId: string;
}

@Injectable()
export class NotificationsService {
    constructor(
        private notificationsGateway: NotificationsGateway,
        private projectMemberService: ProjectMemberService,
    ) {}

    // Отправка уведомления о изменении статуса задачи
    async notifyTaskStatusChange(notification: TaskStatusChangeNotification) {
        try {
            const managers = await this.projectMemberService.getProjectManagers(
                notification.projectId,
            );
            // собираем id в Set (чтобы не дублировать)
            const recipients = new Set<string>();
            for (const m of managers) {
                if (m.id !== notification.changedBy.id) recipients.add(m.id);
            }

            // отправляем менеджерам
            for (const managerId of recipients) {
                this.notificationsGateway.sendToUser(
                    managerId,
                    'task_status_changed',
                    {
                        ...notification,
                        isYourProject: true,
                    },
                );
            }

            // отправляем исполнителю, если это не тот, кто изменил статус
            if (
                notification.assigneeId &&
                notification.changedBy.id !== notification.assigneeId
            ) {
                this.notificationsGateway.sendToUser(
                    notification.assigneeId,
                    'task_status_changed',
                    {
                        ...notification,
                        isYourTask: true,
                    },
                );
            }
        } catch (error) {
            console.error('Failed to send notification:', error);
        }
    }

    // Уведомление о новой задаче
    async notifyNewTask(task: any, project: any, createdBy: any) {
        const assigneeId = task.assigneeId;

        if (assigneeId) {
            this.notificationsGateway.sendToUser(assigneeId, 'task_assigned', {
                taskId: task.id,
                taskTitle: task.title,
                projectId: project.id,
                projectName: project.title,
                assignedBy: {
                    id: createdBy.id,
                    name: createdBy.fullname,
                },
                assignedAt: new Date(),
            });
        }
    }

    // Уведомление о комментарии
    async notifyTaskComment(
        comment: any,
        task: any,
        project: any,
        author: any,
    ) {
        // Отправляем автору задачи и другим участникам
        const participants = await this.projectMemberService.getProjectMembers(
            project.id,
        );

        for (const participant of participants) {
            if (participant.id !== author.id) {
                this.notificationsGateway.sendToUser(
                    participant.id,
                    'task_comment',
                    {
                        taskId: task.id,
                        taskTitle: task.title,
                        projectId: project.id,
                        projectName: project.title,
                        comment: comment.text,
                        author: {
                            id: author.id,
                            name: author.fullname,
                        },
                        createdAt: new Date(),
                    },
                );
            }
        }
    }
}
