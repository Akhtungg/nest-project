import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { DashboardService } from 'src/services/dashboard.service';
import { DashboardController } from 'src/controllers/dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardRepository } from 'src/db/repositories/dashboard.repository';

@Module({
    imports: [TypeOrmModule.forFeature([]), UserModule],
    providers: [DashboardService, DashboardRepository],
    controllers: [DashboardController],
    exports: [DashboardService],
})
export class DashboardModule {}
