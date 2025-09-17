import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GlobalRole } from 'src/db/entities/user.entity';
import { LocalAuthGuard } from 'src/JWT/guards/local.guard';
import { CreateUserDto } from 'src/dto/create.user.dto';
import { AuthService } from 'src/services/auth.service';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/JWT/guards/jwt.guard';
import { RolesGuard } from 'src/JWT/guards/roles.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiBearerAuth()
    @Roles(GlobalRole.MANAGER)
    @Post('sign-up')
    @ApiBody({
        schema: {
            properties: {
                email: { type: 'string', default: 'test@test.com' },
                password: { type: 'string', default: '12345678' },
                fullname: { type: 'string', default: 'John Doe' },
                role: { type: 'string', default: 'user' },
            },
        },
    })
    async signUp(@Body() data: CreateUserDto) {
        return this.authService.signUp(data);
    }

    @UseGuards(LocalAuthGuard)
    @Post('sign-in')
    @ApiBody({
        schema: {
            properties: {
                email: { type: 'string', default: 'test@test.com' },
                password: { type: 'string', default: '12345678' },
            },
        },
    })
    async login(@Req() req) {
        return this.authService.signIn(req.user);
    }
}
