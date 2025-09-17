import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMemberEntity } from 'src/db/entities/project-member.entity';
import { ProjectMemberRepository } from 'src/db/repositories/project-member.repository';
import { ProjectMemberService } from 'src/services/project-member.service';
import { ProjectMemberController } from 'src/controllers/project-member.controller';
import { ProjectAccessService } from 'src/services/project-access.service';
import { ProjectAccessModule } from './project-access.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProjectMemberEntity]),
        ProjectAccessModule,
    ],
    controllers: [ProjectMemberController],
    providers: [ProjectMemberRepository, ProjectMemberService],
    exports: [ProjectMemberService],
})
export class ProjectMemberModule {}
