import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GlobalRole } from 'src/db/entities/user.entity';
import { UserService } from 'src/services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET_KEY,
        });
    }

    async validate(payload: { id: string; role: GlobalRole }) {
        const user = await this.userService.findById(payload.id);

        if (!user) {
            throw new UnauthorizedException('У вас нет доступа');
        }

        return {
            id: user.id,
            role: user.role,
        };
    }
}
