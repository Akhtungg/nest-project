import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from 'src/controllers/project.controller';
import { ProjectEntity } from 'src/db/entities/project.entity';
import { ProjectRepository } from 'src/db/repositories/project.repository';
import { ProjectService } from 'src/services/project.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectEntity])],
    controllers: [ProjectController],
    providers: [ProjectRepository, ProjectService],
    exports: [ProjectService],
})
export class ProjectModule {}
