import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/db/user/user.entity';
import { CreateUserDto } from 'src/dto/create.user.dto';
import { JwtAuthGuard } from 'src/JWT/guards/jwt.guard';
import { RolesGuard } from 'src/JWT/guards/roles.guard';
import { UserService } from 'src/services/user/user.service';

//@UseGuards(JwtAuthGuard, RolesGuard)
//@ApiBearerAuth()
@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('getAll')
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Return all users.' })
    @ApiResponse({ status: 404, description: 'Users not found.' })
    async findAllUsers() {
        return await this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<UserEntity> {
        return this.userService.findById(id);
    }
}