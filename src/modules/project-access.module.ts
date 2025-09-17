import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMemberEntity } from 'src/db/entities/project-member.entity';
import { ProjectAccessRepository } from 'src/db/repositories/project-access.repository';
import { ProjectAccessService } from 'src/services/project-access.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectMemberEntity])],
    providers: [ProjectAccessRepository, ProjectAccessService],
    exports: [ProjectAccessService],
})
export class ProjectAccessModule {}
