import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from 'src/controllers/task.controller';
import { TaskEntity } from 'src/db/entities/task.entity';
import { TaskRepository } from 'src/db/repositories/task.repository';
import { ProjectAccessService } from 'src/services/project-access.service';
import { TaskService } from 'src/services/task.service';
import { ProjectAccessModule } from './project-access.module';
import { NotificationsModule } from './notifications.module';
import { ProjectModule } from './project.module';
import { UserModule } from './user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([TaskEntity]),
        ProjectAccessModule,
        forwardRef(() => NotificationsModule),
        ProjectModule,
        UserModule,
    ],
    controllers: [TaskController],
    providers: [TaskRepository, TaskService],
    exports: [TaskService],
})
export class TaskModule {}
