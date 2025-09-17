import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controllers/user.controller';
import { UserEntity } from 'src/db/entities/user.entity';
import { UserRepository } from 'src/db/repositories/user.repository';
import { UserService } from 'src/services/user.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserRepository, UserService],
    exports: [UserService],
})
export class UserModule {}
