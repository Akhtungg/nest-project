import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { GlobalRole, UserEntity } from 'src/db/entities/user.entity';
import { JwtAuthGuard } from 'src/JWT/guards/jwt.guard';
import { RolesGuard } from 'src/JWT/guards/global-roles.guard';
import { UserService } from 'src/services/user.service';
import { Roles } from 'src/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(GlobalRole.MANAGER)
@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Roles(GlobalRole.MANAGER, GlobalRole.LEAD)
    @Get('getAll')
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Return all users.' })
    @ApiResponse({ status: 404, description: 'Users not found.' })
    async findAllUsers() {
        return await this.userService.findAll();
    }

    @Roles(GlobalRole.MANAGER, GlobalRole.LEAD)
    @Get(':id')
    findOne(@Param('id') id: string): Promise<UserEntity> {
        return this.userService.findById(id);
    }
}
