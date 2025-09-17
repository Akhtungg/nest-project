import { Module } from '@nestjs/common';
import { TypeOrmComponent } from '../db/connect';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { ProjectModule } from './project.module';
import { TaskModule } from './task.module';
import { ProjectAccessModule } from './project-access.module';
import { ProjectMemberModule } from './project-member.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env'],
        }),
        TypeOrmComponent,
        UserModule,
        AuthModule,
        ProjectModule,
        TaskModule,
        ProjectAccessModule,
        ProjectMemberModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
