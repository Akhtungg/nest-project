import {
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { GlobalRole } from 'src/db/entities/user.entity';
import { CreateUserDto } from 'src/dto/create.user.dto';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(
        email: string,
        password: string,
    ): Promise<{
        id?: string;
        email: string;
        name: string;
        role?: GlobalRole;
    }> {
        const user = await this.userService.findByEmail(email);

        const pass = bcrypt.compareSync(password, user.password);

        if (user && pass) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
    }

    async signUp(data: CreateUserDto): Promise<{ token: string; id: string }> {
        try {
            const candidate = await this.userService.findByEmail(data.email);
            if (candidate) {
                throw new ForbiddenException(
                    'Пользователь с таким email уже существует',
                );
            }

            const userData = await this.userService.create(data);
            return {
                token: this.jwtService.sign({
                    id: userData.id,
                    role: userData.role,
                }),
                id: userData.id,
            };
        } catch (err) {
            throw new ForbiddenException('Ошибка при регистрации');
        }
    }

    async signIn(user: { id: string; role: string }) {
        if (!user.role) user.role = GlobalRole.USER;
        return {
            token: this.jwtService.sign({ id: user.id, role: user.role }),
            id: user.id,
        };
    }
}
