import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/JWT/guards/jwt.guard';
import { DashboardService } from 'src/services/dashboard.service';
import { DashboardResponseDto } from 'src/dto/dashboard.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('dashboard')
@ApiTags('Dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get()
    @ApiOperation({
        summary: 'Get personal dashboard',
        description:
            'Returns comprehensive dashboard data for the authenticated user',
    })
    @ApiResponse({
        status: 200,
        description: 'Dashboard data retrieved successfully',
        type: DashboardResponseDto,
    })
    async getDashboard(@Req() req): Promise<DashboardResponseDto> {
        if (req.user.role === 'manager') {
            return this.dashboardService.getManagerDashboard(
                req.user.id,
                req.user.role,
            );
        }

        return this.dashboardService.getDashboard(req.user.id);
    }
}
