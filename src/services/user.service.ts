import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/db/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/dto/create.user.dto';
import { UserRepository } from 'src/db/repositories/user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async create(data: CreateUserDto): Promise<UserEntity> {
        const hash = bcrypt.hashSync(data.password, 10);

        const newUser = await this.userRepository.createUser({
            email: data.email,
            password: hash,
            fullname: data.fullname,
            role: data.role,
        });

        return newUser;
    }

    async findAll(): Promise<UserEntity[]> {
        return this.userRepository.findAll();
    }

    async findById(id: string): Promise<UserEntity> {
        return this.userRepository.findById(id);
    }

    async findByEmail(email: string): Promise<UserEntity> {
        return this.userRepository.findByEmail(email);
    }

    async delete(id: string): Promise<void> {
        return this.userRepository.delete(id);
    }

    async getAll(): Promise<UserEntity[]> {
        return this.userRepository.findAll();
    }
}
