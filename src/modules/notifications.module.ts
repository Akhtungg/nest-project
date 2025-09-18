import { Module, forwardRef } from '@nestjs/common';
import { NotificationsGateway } from 'src/notifications.gateway';
import { NotificationsService } from 'src/services/notifications.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user.module';
import { ProjectModule } from './project.module';
import { ProjectMemberModule } from './project-member.module';

@Module({
    imports: [
        JwtModule,
        forwardRef(() => UserModule),
        forwardRef(() => ProjectModule),
        ProjectMemberModule,
    ],
    providers: [NotificationsGateway, NotificationsService],
    exports: [NotificationsGateway, NotificationsService],
})
export class NotificationsModule {}
