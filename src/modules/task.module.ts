import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from 'src/controllers/task.controller';
import { TaskEntity } from 'src/db/entities/task.entity';
import { TaskRepository } from 'src/db/repositories/task.repository';
import { TaskService } from 'src/services/task.service';

@Module({
    imports: [TypeOrmModule.forFeature([TaskEntity])],
    controllers: [TaskController],
    providers: [TaskRepository, TaskService],
    exports: [TaskService],
})
export class TaskModule {}
