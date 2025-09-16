import {
    Body,
    Controller,
    Inject,
    Post,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserEntity } from 'src/db/entities/user.entity';
import { User } from 'src/decorators/user.decorator';
import { LocalAuthGuard } from 'src/JWT/guards/local.guard';
import { CreateUserDto } from 'src/dto/create.user.dto';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    //@UseGuards(JwtAuthGuard, RolesGuard)
    //@ApiBearerAuth()
    //@Roles(GlobalRole.ADMIN)
    @Post('sign-up')
    @ApiBody({
        schema: {
            properties: {
                email: { type: 'string', default: 'test@test.com' },
                password: { type: 'string', default: '12345678' },
                name: { type: 'string', default: 'John Doe' },
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
    async login(@User() user: UserEntity) {
        return this.authService.signIn(user);
    }
}
