import { Module } from '@nestjs/common';
import { TypeOrmComponent } from '../db/connect';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { ProjectModule } from './project.module';
import { TaskModule } from './task.module';

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
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
