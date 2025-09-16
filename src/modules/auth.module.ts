import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { UserModule } from './user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/controllers/auth.controller';
import { AuthService } from 'src/services/auth.service';
import { LocalStrategy } from 'src/JWT/strategies/local.strategy';
import { JwtStrategy } from 'src/JWT/strategies/jwt.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    secret: configService.getOrThrow('JWT_SECRET_KEY'),
                    signOptions: {
                        expiresIn: configService.getOrThrow('EXPIRES_IN'),
                    },
                };
            },
        }),
        UserModule,
        PassportModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
